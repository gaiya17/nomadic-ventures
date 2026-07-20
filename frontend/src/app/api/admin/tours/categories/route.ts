import { prisma } from '@/lib/prisma';

// GET /api/admin/tours/categories
export async function GET() {
  try {
    const categories = await prisma.tourCategory.findMany({
      include: {
        tours: {
          include: {
            tour: {
              include: { media: true }
            }
          }
        }
      }
    });
    return Response.json({ success: true, categories });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to fetch tour categories' }, { status: 500 });
  }
}

// POST /api/admin/tours/categories
export async function POST(request: Request) {
  try {
    const { name, slug, description, destinations, image } = await request.json();
    const cat = await prisma.tourCategory.create({
      data: { name, slug, description, destinations, image },
    });
    return Response.json({ success: true, category: cat });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: 'Failed to create tour category' }, { status: 500 });
  }
}
