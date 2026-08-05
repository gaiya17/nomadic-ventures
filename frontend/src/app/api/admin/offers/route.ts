import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * @description Zod schema for Offer create requests. Enforces the two core
 * business rules: exactly one of resortId/tourId must be set, and tour
 * offers can only ever be percentage-based (fixed packages are resort-only).
 */
const offerSchema = z
  .object({
    resortId: z.string().optional().nullable(),
    tourId: z.string().optional().nullable(),
    type: z.enum(['PERCENTAGE', 'FIXED_PACKAGE']),
    title: z.string().optional().nullable(),
    discountPercent: z.number().int().min(1).max(90).optional().nullable(),
    packageNights: z.number().int().min(1).optional().nullable(),
    packagePrice: z.number().positive().optional().nullable(),
    validFrom: z.string().optional().nullable(),
    validUntil: z.string().optional().nullable(),
    isActive: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    const hasResort = !!data.resortId;
    const hasTour = !!data.tourId;
    if (hasResort === hasTour) {
      ctx.addIssue({ code: 'custom', message: 'Exactly one of resortId or tourId must be set', path: ['resortId'] });
    }
    if (hasTour && data.type === 'FIXED_PACKAGE') {
      ctx.addIssue({ code: 'custom', message: 'Tour offers must be percentage-based', path: ['type'] });
    }
    if (data.type === 'PERCENTAGE' && !data.discountPercent) {
      ctx.addIssue({ code: 'custom', message: 'discountPercent is required for percentage offers', path: ['discountPercent'] });
    }
    if (data.type === 'FIXED_PACKAGE' && (!data.packageNights || !data.packagePrice)) {
      ctx.addIssue({ code: 'custom', message: 'packageNights and packagePrice are required for fixed package offers', path: ['packageNights'] });
    }
    if (data.validFrom && data.validUntil && new Date(data.validUntil) <= new Date(data.validFrom)) {
      ctx.addIssue({ code: 'custom', message: 'validUntil must be after validFrom', path: ['validUntil'] });
    }
  });

/**
 * @route GET /api/admin/offers
 * @description Lists every offer (resort + tour) for the admin Offers table. Protected by edge middleware.
 */
export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        resort: { select: { id: true, name: true, slug: true, media: { where: { type: 'card' }, take: 1 } } },
        tour: { select: { id: true, name: true, slug: true, media: { where: { type: 'card' }, take: 1 } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return Response.json({ success: true, offers });
  } catch (err) {
    console.error('Error fetching offers:', err);
    return Response.json({ success: false, error: 'Failed to fetch offers' }, { status: 500 });
  }
}

/**
 * @route POST /api/admin/offers
 * @description Creates a new offer attached to either a resort or a tour.
 */
export async function POST(request: Request) {
  try {
    const rawData = await request.json();

    const validation = offerSchema.safeParse(rawData);
    if (!validation.success) {
      return Response.json({ success: false, error: 'Validation Failed', details: validation.error.format() }, { status: 400 });
    }
    const data = validation.data;

    const offer = await prisma.offer.create({
      data: {
        type: data.type,
        title: data.title || null,
        discountPercent: data.type === 'PERCENTAGE' ? data.discountPercent : null,
        packageNights: data.type === 'FIXED_PACKAGE' ? data.packageNights : null,
        packagePrice: data.type === 'FIXED_PACKAGE' ? data.packagePrice : null,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        isActive: data.isActive ?? true,
        resortId: data.resortId || null,
        tourId: data.tourId || null,
      },
    });

    return Response.json({ success: true, offer });
  } catch (err: any) {
    console.error('Error creating offer:', err);
    return Response.json({ success: false, error: 'Failed to create offer', details: err.message }, { status: 500 });
  }
}
