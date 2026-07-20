import { prisma } from '@/lib/prisma';

// GET /api/admin/resorts/categories — Resort categories
export async function GET() {
  try {
    const categories = await prisma.resortCategory.findMany({
      include: {
        resorts: {
          include: {
            resort: {
              include: { media: true }
            }
          }
        }
      }
    });
    return Response.json({ success: true, categories });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/admin/resorts/categories — Create resort category
export async function POST(request: Request) {
  try {
    const { name, slug, description, whatDefines } = await request.json();
    const cat = await prisma.resortCategory.create({
      data: { name, slug, description, whatDefines },
    });
    return Response.json({ success: true, category: cat });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
