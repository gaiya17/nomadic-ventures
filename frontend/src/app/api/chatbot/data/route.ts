import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * GET /api/chatbot/data
 * Public endpoint — aggregates all data the chatbot needs in a single query.
 * Designed to be fetched once and cached client-side for the session.
 */
export async function GET() {
  try {
    const [tourCategories, resortCategories, experiences] = await Promise.all([
      // Tour categories + their active tours
      prisma.tourCategory.findMany({
        include: {
          tours: {
            include: {
              tour: {
                include: { media: true },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      // Resort categories + their resorts (with media)
      prisma.resortCategory.findMany({
        include: {
          resorts: {
            include: {
              resort: {
                include: { media: true },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      // All published experiences
      prisma.experience.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          slug: true,
          tagline: true,
          locationCountry: true,
          gallery: true,
        },
        orderBy: { locationCountry: 'asc' },
      }),
    ]);

    // Shape tour categories — only include those with ≥1 tour
    const shapedTourCats = tourCategories
      .filter((cat) => cat.tours.length > 0)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
        tours: cat.tours.map((t) => {
          const tour = t.tour;
          const heroMedia =
            tour.media?.find((m) => m.type === 'hero') ||
            tour.media?.find((m) => m.type === 'card') ||
            tour.media?.[0];
          return {
            id: tour.id,
            name: tour.name,
            slug: tour.slug,
            days: tour.days ?? '',
            price: tour.price ?? 'On Request',
            heroImage: heroMedia?.url ?? null,
          };
        }),
      }));

    // Shape resort categories — only include those with ≥1 resort
    const shapedResortCats = resortCategories
      .filter((cat) => cat.resorts.length > 0)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        resorts: cat.resorts.map((r) => {
          const resort = r.resort;
          const heroMedia =
            resort.media?.find((m) => m.type === 'hero') ||
            resort.media?.find((m) => m.type === 'card') ||
            resort.media?.[0];
          return {
            id: resort.id,
            name: resort.name,
            slug: resort.slug,
            location: resort.location ?? 'Maldives',
            price: resort.price ?? 'On Request',
            heroImage: heroMedia?.url ?? null,
          };
        }),
      }));

    // Shape experiences
    const shapedExperiences = experiences.map((exp) => {
      const galleryArr = Array.isArray(exp.gallery)
        ? exp.gallery
        : typeof exp.gallery === 'string'
        ? JSON.parse(exp.gallery as string)
        : [];
      return {
        id: exp.id,
        title: exp.title,
        slug: exp.slug,
        tagline: exp.tagline ?? '',
        locationCountry: exp.locationCountry ?? 'Sri Lanka',
        heroImage: galleryArr[0] ?? null,
      };
    });

    return NextResponse.json({
      success: true,
      tourCategories: shapedTourCats,
      resortCategories: shapedResortCats,
      experiences: shapedExperiences,
    });
  } catch (err) {
    console.error('[chatbot/data] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chatbot data' },
      { status: 500 }
    );
  }
}
