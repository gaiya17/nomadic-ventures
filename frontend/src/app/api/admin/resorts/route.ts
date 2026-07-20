import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * @description Zod schema for secure validation of Resort POST requests.
 * Ensures that malformed or malicious data cannot be inserted into the database.
 */
const resortSchema = z.object({
  basic: z.object({
    name: z.string().min(1, 'Resort name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    location: z.string(),
    stars: z.number().min(1).max(7),
    duration: z.string(),
    transferMethod: z.string(),
    price: z.union([z.string(), z.number()]).transform(val => String(val)),
    categories: z.array(z.string()).optional(),
  }),
}).passthrough();

/**
 * @route GET /api/admin/resorts
 * @description Fetches all resorts from the database. Protected by edge middleware.
 */
export async function GET() {
  try {
    const resorts = await prisma.resort.findMany({
      include: {
        categories: { include: { category: true } },
        media: true,
        villas: true,
        restaurants: true,
        facilities: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return Response.json({ success: true, resorts });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to fetch resorts' }, { status: 500 });
  }
}

/**
 * @route POST /api/admin/resorts
 * @description Creates a new resort. Validates input using Zod before database insertion.
 */
export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    
    // 1. Strict Input Validation (Security)
    const validation = resortSchema.safeParse(rawData);
    if (!validation.success) {
      return Response.json({ success: false, error: 'Validation Failed', details: validation.error.format() }, { status: 400 });
    }
    
    const data = validation.data as any;

    // 2. Generate safe URL slug
    let generatedSlug = data.basic.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (generatedSlug.endsWith('-')) generatedSlug = generatedSlug.slice(0, -1);
    if (generatedSlug.startsWith('-')) generatedSlug = generatedSlug.slice(1);

    const existing = await prisma.resort.findUnique({ where: { slug: generatedSlug } });
    if (existing) generatedSlug += '-' + Date.now().toString().slice(-4);

    // 3. Insert into Database
    const resort = await prisma.resort.create({
      data: {
        name: data.basic.name,
        slug: generatedSlug,
        description: data.basic.description,
        location: data.basic.location,
        transferMethod: data.basic.transferMethod,
        duration: data.basic.duration,
        price: data.basic.price,
        stars: Number(data.basic.stars || 5),
        status: 'Active',

        categories: {
          create: (data.basic.categories || []).map((catId: string) => ({
            category: { connect: { id: catId } },
          })),
        },

        media: {
          create: [
            ...(data.media?.heroImage ? [{ type: 'hero', url: data.media.heroImage }] : []),
            ...(data.media?.cardImage ? [{ type: 'card', url: data.media.cardImage }] : []),
            ...(data.media?.gallery || []).map((url: string) => ({ type: 'gallery', url })),
          ],
        },

        villas: {
          create: (data.villas || []).map((v: any) => ({
            title: v.title,
            bedType: v.bedType,
            description: v.description,
            roomSize: v.roomSize,
            capacities: JSON.stringify(v.capacities || []),
            features: JSON.stringify(v.features || []),
            images: JSON.stringify(v.images || []),
          })),
        },

        restaurants: {
          create: (data.restaurants || []).map((r: any) => ({
            name: r.name,
            description: r.description,
            image: r.image,
            timings: JSON.stringify(r.timings || []),
          })),
        },

        facilities: {
          create: (data.extras?.facilities || []).map((f: string) => ({
            facilityName: f,
          })),
        },
      },
    });

    return Response.json({ success: true, resort });
  } catch (err: any) {
    console.error('Error creating resort:', err);
    return Response.json({ success: false, error: 'Failed to create resort', details: err.message }, { status: 500 });
  }
}
