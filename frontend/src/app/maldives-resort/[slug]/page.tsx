import { prisma } from '@/lib/prisma';
import { ResortClientContent } from './ResortClientContent';

export default async function ResortPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(decodedSlug);

  // 1. Server-Side Data Fetching
  const dbR = await prisma.resort.findFirst({
    where: isUUID ? { id: decodedSlug } : { slug: decodedSlug },
    include: {
      categories: { include: { category: true } },
      media: true,
      villas: true,
      restaurants: true,
      facilities: true,
    },
  });

  if (!dbR) {
    return <ResortClientContent resort={null} relatedResorts={[]} />;
  }

  // 2. Format Resort Data
  const heroMedia = dbR.media?.find((m:any) => m.type === "hero") || dbR.media?.[0];
  const displayHero = heroMedia ? heroMedia.url : "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800";
  const gallery = dbR.media?.filter((m:any) => m.type === "gallery").map((m:any) => m.url) || [];

  const formattedResort = {
    name: dbR.name,
    slug: dbR.slug,
    stars: dbR.stars,
    tag: dbR.categories?.[0]?.category?.name || "Resort",
    atoll: dbR.location || "Maldives",
    duration: dbR.duration,
    transfer: dbR.transferMethod,
    capacity: "Custom",
    hero: displayHero,
    image: displayHero,
    gallery: gallery.length > 0 ? gallery : [displayHero],
    description: dbR.description,
    dek: dbR.description,
    facilities: dbR.facilities?.map((f:any) => f.facilityName) || [],
    includes: ["Return seaplane or speedboat transfers", "Daily breakfast at signature restaurant", "Welcome champagne and in-villa fruit & canapés"],
    excludes: ["International flights and visa fees", "Lunches, à la carte dinners and beverages", "Personal expenses and gratuities"],
    highlights: [],
    price: dbR.price?.toString() || "On Request",
    experiences: [],
    restaurants: dbR.restaurants?.map((r:any) => {
      let timingStr = "Flexible";
      try {
        const timings = JSON.parse(r.timings || "[]");
        if (timings.length > 0) {
          timingStr = timings.map((t:any) => `${t.type}: ${t.startTime} - ${t.endTime}`).join(" | ");
        }
      } catch(e) {}
      return {
        name: r.name,
        timing: timingStr,
        description: r.description,
        image: r.image ? r.image : displayHero
      }
    }) || [],
    villaTypes: dbR.villas?.map((v:any) => {
      let images = [];
      try { images = JSON.parse(v.images || "[]").map((img:string) => img); } catch(e){}
      return {
        name: v.title,
        size: v.roomSize || "Custom",
        bedType: v.bedType,
        description: v.description,
        from: `$${dbR.price || 0}`,
        capacity: v.capacities ? (typeof v.capacities === 'string' && v.capacities.startsWith('[') ? JSON.parse(v.capacities)[0] : v.capacities) : "Custom",
        note: "",
        image: images[0] || displayHero
      };
    }) || [],
  };

  // 3. Fetch Related Resorts (Server-Side)
  const allResorts = await prisma.resort.findMany({
    where: { slug: { not: dbR.slug } },
    include: { media: true },
    take: 3,
  });

  const relatedResorts = allResorts.map((r:any) => {
    const displayMedia = r.media?.find((m:any) => m.type === "card") || r.media?.find((m:any) => m.type === "hero") || r.media?.find((m:any) => m.type === "gallery") || r.media?.[0];
    return {
      name: r.name,
      slug: r.slug,
      atoll: r.location || "Maldives",
      price: r.price || "On Request",
      image: displayMedia ? displayMedia.url : "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1000",
    }
  });

  // 4. Return Client Component
  return <ResortClientContent resort={formattedResort} relatedResorts={relatedResorts} />;
}
