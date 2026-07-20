import { prisma } from '@/lib/prisma';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// GET /api/admin/resorts/[id] (can be ID or slug)
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    
    const resort = await prisma.resort.findFirst({
      where: isUUID ? { id } : { slug: id },
      include: {
        categories: { include: { category: true } },
        media: true,
        villas: true,
        restaurants: true,
        facilities: true,
      },
    });
    if (!resort) return Response.json({ success: false, error: 'Resort not found' }, { status: 404 });
    return Response.json({ success: true, resort });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to fetch resort' }, { status: 500 });
  }
}

// PUT /api/admin/resorts/[id] — update resort
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    // --- CLOUDINARY CLEANUP LOGIC ---
    // 1. Fetch old media URLs
    const oldResort = await prisma.resort.findUnique({
      where: { id },
      include: { media: true, villas: true, restaurants: true }
    });
    
    const oldUrls: string[] = [];
    if (oldResort) {
      oldUrls.push(...oldResort.media.map((m: any) => m.url));
      oldUrls.push(...oldResort.restaurants.map((r: any) => r.image).filter(Boolean));
      oldResort.villas.forEach((v: any) => {
        if (v.images) {
          try {
            const imgs = JSON.parse(v.images);
            if (Array.isArray(imgs)) oldUrls.push(...imgs);
          } catch(e) {}
        }
      });
    }

    // 2. Aggregate all new URLs
    const newUrls: string[] = [
      data.media?.heroImage,
      data.media?.cardImage,
      ...(data.media?.gallery || []),
      ...(data.restaurants || []).map((r: any) => r.image)
    ];
    (data.villas || []).forEach((v: any) => {
      if (Array.isArray(v.images)) newUrls.push(...v.images);
      else if (typeof v.images === 'string') {
        try { newUrls.push(...JSON.parse(v.images)); } catch(e){}
      }
    });
    
    const safeNewUrls = newUrls.filter(Boolean);

    // 3. Delete abandoned URLs from Cloudinary
    const urlsToDelete = oldUrls.filter(url => !safeNewUrls.includes(url));
    if (urlsToDelete.length > 0) {
      await Promise.all(urlsToDelete.map(url => deleteFromCloudinary(url)));
    }
    // ---------------------------------

    // Clear nested relations first, then re-create
    await prisma.resortCategoryMapping.deleteMany({ where: { resortId: id } });
    await prisma.resortMedia.deleteMany({ where: { resortId: id } });
    await prisma.resortVilla.deleteMany({ where: { resortId: id } });
    await prisma.resortRestaurant.deleteMany({ where: { resortId: id } });
    await prisma.resortFacility.deleteMany({ where: { resortId: id } });

    const resort = await prisma.resort.update({
      where: { id },
      data: {
        name: data.basic.name,
        description: data.basic.description,
        location: data.basic.location,
        transferMethod: data.basic.transferMethod,
        duration: data.basic.duration,
        price: data.basic.price,
        stars: Number(data.ratings?.stars || 5),

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
            capacities: typeof v.capacities === 'string' ? v.capacities : JSON.stringify(v.capacities || []),
            features: typeof v.features === 'string' ? v.features : JSON.stringify(v.features || []),
            images: typeof v.images === 'string' ? v.images : JSON.stringify(v.images || []),
          })),
        },

        restaurants: {
          create: (data.restaurants || []).map((r: any) => ({
            name: r.name,
            description: r.description,
            image: r.image,
            timings: typeof r.timings === 'string' ? r.timings : JSON.stringify(r.timings || []),
          })),
        },

        facilities: {
          create: (data.extras?.facilities || []).map((f: any) => ({
            facilityName: typeof f === 'string' ? f : f.facilityName,
          })),
        },
      },
    });

    return Response.json({ success: true, resort });
  } catch (err: any) {
    console.error('Error updating resort:', err);
    return Response.json({ success: false, error: 'Failed to update resort', details: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/resorts/[id] — delete resort (Cloudinary URLs — no local file cleanup needed)
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Fetch resort with all media to delete from Cloudinary
    const resort = await prisma.resort.findUnique({ 
      where: { id },
      include: { media: true, villas: true, restaurants: true }
    });
    if (!resort) return Response.json({ success: false, error: 'Resort not found' }, { status: 404 });

    // Aggregate all Cloudinary URLs
    const urlsToDelete: string[] = [];
    urlsToDelete.push(...resort.media.map((m: any) => m.url));
    urlsToDelete.push(...resort.restaurants.map((r: any) => r.image).filter(Boolean));
    resort.villas.forEach((v: any) => {
      if (v.images) {
        try {
          const imgs = JSON.parse(v.images);
          if (Array.isArray(imgs)) urlsToDelete.push(...imgs);
        } catch(e) {}
      }
    });

    if (urlsToDelete.length > 0) {
      await Promise.all(urlsToDelete.map(url => deleteFromCloudinary(url)));
    }

    await prisma.resort.delete({ where: { id } });

    return Response.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting resort:', err);
    return Response.json({ success: false, error: 'Failed to delete resort', details: err.message }, { status: 500 });
  }
}
