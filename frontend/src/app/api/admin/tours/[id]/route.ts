import { prisma } from '@/lib/prisma';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// GET /api/admin/tours/[id] (can be ID or slug)
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    
    const tour = await prisma.tour.findFirst({
      where: isUUID ? { id } : { slug: id },
      include: {
        categories: { include: { category: true } },
        media: true,
        itineraries: true,
      },
    });
    if (!tour) return Response.json({ success: false, error: 'Tour not found' }, { status: 404 });
    return Response.json({ success: true, tour });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to fetch tour' }, { status: 500 });
  }
}

// PUT /api/admin/tours/[id] — update tour
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Fetch existing media to determine what needs deleting
    const oldMedia = await prisma.tourMedia.findMany({ where: { tourId: id } });
    const oldUrls = oldMedia.map((m: any) => m.url);
    
    const newUrls = [
      data.media?.heroImage,
      ...(data.media?.gallery || [])
    ].filter(Boolean);

    // Find URLs that exist in DB but aren't in the new payload
    const urlsToDelete = oldUrls.filter((url: string) => !newUrls.includes(url));
    await Promise.all(urlsToDelete.map((url: string) => deleteFromCloudinary(url)));

    await prisma.tourCategoryMapping.deleteMany({ where: { tourId: id } });
    await prisma.tourMedia.deleteMany({ where: { tourId: id } });
    await prisma.tourItinerary.deleteMany({ where: { tourId: id } });

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        name: data.basic.name,
        description: data.basic.description,
        guests: data.basic.guests,
        days: data.basic.days,
        destinations: data.basic.destinations,
        price: data.basic.price,
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
    console.error('Error updating tour:', err);
    return Response.json({ success: false, error: 'Failed to update tour', details: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/tours/[id] — delete tour
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Fetch tour with its media to delete them from Cloudinary
    const tour = await prisma.tour.findUnique({ 
      where: { id },
      include: { media: true } 
    });
    if (!tour) return Response.json({ success: false, error: 'Tour not found' }, { status: 404 });

    // Delete all associated media from Cloudinary
    if (tour.media && tour.media.length > 0) {
      await Promise.all(tour.media.map((m: any) => deleteFromCloudinary(m.url)));
    }

    await prisma.tour.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting tour:', err);
    return Response.json({ success: false, error: 'Failed to delete tour', details: err.message }, { status: 500 });
  }
}
