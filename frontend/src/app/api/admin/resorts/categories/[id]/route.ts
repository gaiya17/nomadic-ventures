import { prisma } from '@/lib/prisma';

// PUT /api/admin/resorts/categories/[id] — Update resort category
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, slug, description, whatDefines } = await request.json();
    const cat = await prisma.resortCategory.update({
      where: { id },
      data: { name, slug, description, whatDefines },
    });
    return Response.json({ success: true, category: cat });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id] — Delete resort category
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.resortCategory.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
