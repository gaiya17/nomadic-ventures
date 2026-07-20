import { prisma } from '@/lib/prisma';
import { TourClientContent } from './TourClientContent';

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(decodedSlug);
  
  // 1. Server-Side Data Fetching! (Instant load, perfect SEO)
  const dbTour = await prisma.tour.findFirst({
    where: isUUID ? { id: decodedSlug } : { slug: decodedSlug },
    include: {
      categories: { include: { category: true } },
      media: true,
      itineraries: true,
    },
  });

  if (!dbTour) {
    return <TourClientContent tour={null} />;
  }

  // 2. Format the data precisely as the Client Component expects
  const formattedTour = {
    id: dbTour.id,
    slug: dbTour.slug,
    name: dbTour.name,
    tag: dbTour.categories[0]?.category?.name || "All",
    duration: String(dbTour.days).toLowerCase().includes('day') ? dbTour.days : `${dbTour.days || 1} Days`,
    places: Array.isArray(dbTour.destinations) ? dbTour.destinations.join(" · ") : (dbTour.destinations || ""),
    image: dbTour.media && dbTour.media.length > 0 ? (dbTour.media.find((m:any) => m.type === 'hero')?.url || dbTour.media[0].url) : "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?auto=format&fit=crop&q=80",
    gallery: dbTour.media ? dbTour.media.filter((m:any) => m.type === 'gallery').map((m:any) => m.url) : [],
    highlights: dbTour.experiences ? JSON.parse(dbTour.experiences as string) : (Array.isArray(dbTour.destinations) ? dbTour.destinations : (dbTour.destinations ? dbTour.destinations.split(',').map((d: any) => d.trim()) : [])),
    itinerary: dbTour.itineraries ? dbTour.itineraries.map((it:any) => ({ day: `Day ${String(it.day).padStart(2, '0')}`, title: it.title, description: it.description })) : [],
    includes: dbTour.includes ? JSON.parse(dbTour.includes as string) : [],
    excludes: dbTour.excludes ? JSON.parse(dbTour.excludes as string) : [],
  };

  // 3. Pass formatted data to the interactive Client Component
  return <TourClientContent tour={formattedTour} />;
}
