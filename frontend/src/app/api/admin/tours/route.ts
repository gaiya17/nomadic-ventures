import { prisma } from '@/lib/prisma';

// GET /api/admin/tours — all tours
export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        categories: { include: { category: true } },
        media: true,
        itineraries: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return Response.json({ success: true, tours });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to fetch tours' }, { status: 500 });
  }
}

// POST /api/admin/tours — create tour
export async function POST(request: Request) {
  try {
    const data = await request.json();

    let generatedSlug = data.basic.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (generatedSlug.endsWith('-')) generatedSlug = generatedSlug.slice(0, -1);
    if (generatedSlug.startsWith('-')) generatedSlug = generatedSlug.slice(1);

    const existing = await prisma.tour.findUnique({ where: { slug: generatedSlug } });
    if (existing) generatedSlug += '-' + Date.now().toString().slice(-4);

    const tour = await prisma.tour.create({
      data: {
        name: data.basic.name,
        slug: generatedSlug,
        description: data.basic.description,
        guests: data.basic.guests,
        days: data.basic.days,
        destinations: data.basic.destinations,
        price: data.basic.price,
        status: 'Active',
        includes: data.includesExcludes?.includes ? JSON.stringify(data.includesExcludes.includes) : null,
        excludes: data.includesExcludes?.excludes ? JSON.stringify(data.includesExcludes.excludes) : null,
        experiences: data.experiences ? JSON.stringify(data.experiences) : null,

        categories: {
          create: (data.basic.categories || []).map((catId: string) => ({
            category: { connect: { id: catId } },
          })),
        },

        media: {
          create: [
            ...(data.media?.heroImage ? [{ type: 'hero', url: data.media.heroImage }] : []),
            ...(data.media?.gallery || []).map((url: string) => ({ type: 'gallery', url })),
          ],
        },

        itineraries: {
          create: (data.itineraries || []).map((it: any) => ({
            title: it.title,
            description: it.description,
          })),
        },
      },
    });

    return Response.json({ success: true, tour });
  } catch (err: any) {
    console.error('Error creating tour:', err);
    return Response.json({ success: false, error: 'Failed to create tour', details: err.message }, { status: 500 });
  }
}
