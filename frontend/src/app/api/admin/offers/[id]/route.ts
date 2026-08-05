import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * Offer target (resort vs tour) is fixed at creation time — PUT only edits
 * the offer's own fields, never re-parents it.
 */
const offerUpdateSchema = z
  .object({
    type: z.enum(['PERCENTAGE', 'FIXED_PACKAGE']),
    title: z.string().optional().nullable(),
    discountPercent: z.number().int().min(1).max(90).optional().nullable(),
    packageNights: z.number().int().min(1).optional().nullable(),
    packagePrice: z.number().positive().optional().nullable(),
    validFrom: z.string().optional().nullable(),
    validUntil: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
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
 * @route PUT /api/admin/offers/[id]
 * @description Updates an existing offer. Re-checks the tour-percentage-only rule against the offer's original target.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await prisma.offer.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ success: false, error: 'Offer not found' }, { status: 404 });
    }

    const rawData = await request.json();
    const validation = offerUpdateSchema.safeParse(rawData);
    if (!validation.success) {
      return Response.json({ success: false, error: 'Validation Failed', details: validation.error.format() }, { status: 400 });
    }
    const data = validation.data;

    if (existing.tourId && data.type === 'FIXED_PACKAGE') {
      return Response.json({ success: false, error: 'Tour offers must be percentage-based' }, { status: 400 });
    }

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        type: data.type,
        title: data.title ?? null,
        discountPercent: data.type === 'PERCENTAGE' ? data.discountPercent : null,
        packageNights: data.type === 'FIXED_PACKAGE' ? data.packageNights : null,
        packagePrice: data.type === 'FIXED_PACKAGE' ? data.packagePrice : null,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        isActive: data.isActive ?? existing.isActive,
      },
    });

    return Response.json({ success: true, offer });
  } catch (err: any) {
    console.error('Error updating offer:', err);
    return Response.json({ success: false, error: 'Failed to update offer', details: err.message }, { status: 500 });
  }
}

/**
 * @route DELETE /api/admin/offers/[id]
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.offer.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting offer:', err);
    return Response.json({ success: false, error: 'Failed to delete offer' }, { status: 500 });
  }
}
