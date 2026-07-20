import { prisma } from "@/lib/prisma";
import { LuxuryHero } from "@/components/LuxuryHero";
import { SriLankaExperiences } from "@/components/SriLankaExperiences";
import { SriLankaPackages } from "@/components/SriLankaPackages";
import { JourneyCTA } from "@/components/JourneyCTA";
import { MaldivesSection } from "@/components/MaldivesSection";
import { TransportService } from "@/components/TransportService";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default async function Page() {
  const dbTours = await prisma.tour.findMany({
    take: 6,
    include: {
      categories: { include: { category: true } },
      media: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const featuredTours = dbTours.map((t: any) => ({
    name: t.name,
    slug: t.slug,
    duration: String(t.days).toLowerCase().includes("day") ? t.days : `${t.days || 1} Days`,
    places: Array.isArray(t.destinations) ? t.destinations.join(" · ") : (t.destinations || ""),
    image: t.media && t.media.length > 0 ? (t.media.find((m: any) => m.type === "hero")?.url || t.media[0].url) : "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?auto=format&fit=crop&q=80",
    tag: t.categories?.[0]?.category?.name || "Featured",
  }));

  const dbCategories = await prisma.tourCategory.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const featuredCategories = dbCategories.map((c: any) => ({
    name: c.name,
    tourTag: c.slug,
    sub: c.destinations ? c.destinations.split(',').slice(0, 2).join(' · ') : "",
    image: c.image || "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1200",
    tags: c.destinations ? c.destinations.split(',').map((d: string) => d.trim()).slice(0, 3) : [],
  }));

  return (
    <>
      <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" />
      <LuxuryHero />
      <SriLankaExperiences categories={featuredCategories} />
      <SriLankaPackages tours={featuredTours} />
      <JourneyCTA />
      <MaldivesSection />
      <TransportService />
      <Testimonials />
      <Footer />
    </>
  );
}
