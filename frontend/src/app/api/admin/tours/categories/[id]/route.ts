import { prisma } from '@/lib/prisma';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// PUT /api/admin/tours/categories/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, slug, description, destinations, image } = await request.json();

    const existingCat = await prisma.tourCategory.findUnique({ where: { id } });
    if (existingCat && existingCat.image && existingCat.image !== image) {
      await deleteFromCloudinary(existingCat.image);
    }

    const cat = await prisma.tourCategory.update({
      where: { id },
      data: { name, slug, description, destinations, image },
    });
    return Response.json({ success: true, category: cat });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to update tour category' }, { status: 500 });
  }
}

// DELETE /api/admin/tours/categories/[id]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const cat = await prisma.tourCategory.findUnique({ where: { id } });
    if (cat?.image) {
      await deleteFromCloudinary(cat.image);
    }

    await prisma.tourCategory.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to delete tour category' }, { status: 500 });
  }
}
