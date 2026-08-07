"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { slugify, parseDefinitionList } from "@/lib/utils";
import {
  ArrowUpRight,
  ChevronRight,
  Star,
  Waves,
  Compass,
  Wind,
  Sun,
  Anchor,
} from "lucide-react";
import axios from "axios";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PageLoader } from "@/components/PageLoader";
import { resolveLiveOffer, computeDiscountedPrice, getOfferBadgeLabel, type OfferLike } from "@/lib/offers";

type Collection = {
  id: string;
  num: string;
  name: string;
  short: string;
  blurb: string;
  hero: string;
  count: string;
  from: string;
  duration: string;
  vibe: string;
  highlights: string[];
  resorts: { name: string; atoll: string; image: string; price: string; offer?: OfferLike | null }[];
};

// ─── Page ──────────────────────────────────────────────────────────────────────
export function MaldivesClient({ maldivesHeroImage }: { maldivesHeroImage?: string }) {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  // Merge the dynamic hero images if they exist
  const [heroId, setHeroId] = useState("overwater");

  // Fix hydration mismatch for random particles
  const [particles, setParticles] = useState<any[]>([]);
  
  // Real categories only — no hardcoded fallback content. See isLoadingCategories below.
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    // Generate particles
    setParticles(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
      }))
    );

    // Fetch dynamic categories
    const fetchCats = async () => {
      try {
        const res = await axios.get("/api/admin/resorts/categories");
        if (res.data.success) {
          setDbCategories(res.data.categories);
        } else if (Array.isArray(res.data)) {
          setDbCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to load dynamic categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCats();
  }, []);

  const COLLECTIONS = dbCategories
    .filter(cat => cat.resorts && cat.resorts.length > 0)
    .map((cat, idx) => {
    const num = (idx + 1).toString().padStart(2, '0');
    const categoryResorts = cat.resorts ? cat.resorts.map((mapping: any) => {
      const resort = mapping.resort || mapping;
      const displayMedia = resort.media?.find((m: any) => m.type === "card") || resort.media?.find((m: any) => m.type === "hero") || resort.media?.find((m: any) => m.type === "gallery") || resort.media?.[0];
      return {
        name: resort.name,
        slug: resort.slug,
        atoll: resort.location || "Maldives",
        image: displayMedia ? `${displayMedia.url}` : "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1000",
        price: resort.price || "On Request",
        offer: resolveLiveOffer(resort.offers),
      }
    }).sort((a: any, b: any) => a.name.localeCompare(b.name)) : [];

    const defaultHero = categoryResorts.length > 0 ? categoryResorts[0].image : "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800";

    return {
      id: cat.slug || cat.id,
      num,
      name: cat.name,
      short: cat.name,
      blurb: cat.description || cat.blurb || "",
      hero: defaultHero,
      count: `${categoryResorts.length} Resort${categoryResorts.length !== 1 ? 's' : ''}`,
      from: categoryResorts.length > 0 ? `$${categoryResorts[0].price}` : "On Request",
      duration: "Flexible",
      vibe: "Collection",
      highlights: cat.whatDefines ? parseDefinitionList(cat.whatDefines) : (cat.highlights || []),
      resorts: categoryResorts
    };
  });

  const allResorts = dbCategories.flatMap(c => c.resorts?.map((r: any) => r.resort || r) || []);
  const uniqueResorts = Array.from(new Map(allResorts.map(r => [r.id || r.name, r])).values()).sort((a: any, b: any) => a.name.localeCompare(b.name));
  const totalResortsCount = uniqueResorts.length;
  const avgRating = totalResortsCount > 0
    ? (uniqueResorts.reduce((acc, r) => acc + (r.stars || 5), 0) / totalResortsCount).toFixed(2)
    : "5.00";

  const heroCol =
    COLLECTIONS.find((c) => c.id === heroId) || COLLECTIONS[0];

  // Show the real loading state instead of seeding the page with hardcoded fallback content.
  if (isLoadingCategories) {
    return <PageLoader />;
  }

  // Genuinely no categories with resorts yet — avoid crashing on an undefined heroCol.
  if (!heroCol) {
    return (
      <div className="size-full min-h-screen flex flex-col" style={{ background: "#021830" }}>
        <Navbar accent="#89F3FF" glow="rgba(137,243,255,0.35)" />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 28, color: "white", marginBottom: 12 }}>
            No resort collections available yet
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            Please check back soon.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="size-full" style={{ background: "#021830" }}>
      <Navbar accent="#89F3FF" glow="rgba(137,243,255,0.35)" />

      {/* ───────── PAGE HERO ───────── */}
      <section className="relative w-full min-h-[88vh] flex items-end overflow-hidden">
        {/* ── Background ── */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#021830]/80 via-transparent to-[#021830]/90 z-10" />
          <ImageWithFallback
            src={maldivesHeroImage || "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800"}
            alt="Maldives Resorts"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(2,24,48,0.6) 0%, rgba(2,24,48,0.35) 40%, rgba(2,24,48,0.95) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 80% 60%, rgba(137,243,255,0.2) 0%, transparent 55%)",
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                width: p.width,
                height: p.height,
                left: p.left,
                top: p.top,
                background: "rgba(137,243,255,0.6)",
                filter: "blur(1px)",
              }}
              animate={{ y: [0, -40, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-20 pt-28 md:pt-40 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2 mb-10 text-white/55"
            style={{ fontSize: 12, letterSpacing: "0.15em" }}
          >
            <span>HOME</span>
            <ChevronRight className="w-3 h-3" />
            <span>RESORTS</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">MALDIVES</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="lg:col-span-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8" style={{ background: "#89F3FF" }} />
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.35em",
                    color: "#89F3FF",
                  }}
                >
                  THE ATOLLS · SIGNATURE COLLECTIONS
                </span>
              </div>
              <h1
                className="text-white mb-6"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 500,
                  fontSize: "clamp(56px, 8vw, 120px)",
                  lineHeight: 0.94,
                  letterSpacing: "-0.03em",
                }}
              >
                Maldives
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(120deg, #89F3FF 0%, #ffffff 60%, #89F3FF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  resorts
                </span>
              </h1>
              <p
                className="hidden md:block text-white/75 max-w-[560px]"
                style={{ fontSize: 17, lineHeight: 1.6 }}
              >
                Six worlds across 1,192 islands — overwater icons, private
                reserves, marine sanctuaries and wellness havens. Curated by
                resort scouts who actually stay.
              </p>
            </motion.div>

            {/* Stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45 }}
              className="lg:col-span-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border"
              style={{
                borderColor: "rgba(137,243,255,0.2)",
                background: "rgba(137,243,255,0.1)",
                backdropFilter: "blur(14px)",
              }}
            >
              {[
                { v: String(COLLECTIONS.length).padStart(2, '0'), l: "Collections" },
                { v: String(totalResortsCount), l: "Resorts" },
                { v: `${avgRating}★`, l: "Avg. Rating" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="p-3 md:p-5"
                  style={{ background: "rgba(2,24,48,0.7)" }}
                >
                  <div
                    className="text-white"
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: "clamp(20px, 4vw, 28px)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    className="text-white/55 mt-1"
                    style={{ fontSize: 10, letterSpacing: "0.18em" }}
                  >
                    {s.l.toUpperCase()}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── STICKY COLLECTION RAIL ───────── */}
      <div
        className="sticky top-[72px] lg:top-[88px] z-30 backdrop-blur-md border-y"
        style={{
          background: "rgba(2,24,48,0.85)",
          borderColor: "rgba(137,243,255,0.1)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-5 flex items-center gap-2 overflow-x-auto">
          <div
            className="hidden md:flex items-center gap-2 text-white/45 mr-3 whitespace-nowrap"
            style={{ fontSize: 11, letterSpacing: "0.25em" }}
          >
            <Compass className="w-3.5 h-3.5" style={{ color: "#89F3FF" }} />
            JUMP TO
          </div>
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              onClick={(e) => { e.preventDefault(); setHeroId(c.id); document.getElementById(`col-${c.id}`)?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-4 py-2.5 rounded-full border whitespace-nowrap transition-all text-white/80 hover:text-white"
              style={{
                background: "rgba(137,243,255,0.05)",
                borderColor: "rgba(137,243,255,0.18)",
                fontSize: 12,
                letterSpacing: "0.05em",
              }}
            >
              <span
                className="mr-2"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  color: "#89F3FF",
                  opacity: 0.7,
                }}
              >
                {c.num}
              </span>
              {c.short}
            </button>
          ))}
        </div>
      </div>

      {/* ───────── MAGAZINE SPREADS ───────── */}
      <section
        className="relative w-full"
        style={{
          background:
            "linear-gradient(180deg, #021830 0%, #053859 35%, #074a73 70%, #032440 100%)",
        }}
      >
        {COLLECTIONS.map((c, idx) => {
          const reverse = idx % 2 === 1;
          const VibeIcon = [Waves, Sun, Anchor, Compass, Wind, Star][idx % 6];
          return (
            <div
              key={c.id}
              id={`col-${c.id}`}
              className="relative w-full py-14 lg:py-28 px-6 lg:px-20 border-b"
              style={{ borderColor: "rgba(137,243,255,0.08)" }}
            >
              <div className="relative max-w-[1400px] mx-auto">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${reverse ? "lg:[&>.copy]:order-2" : ""}`}
                >
                  {/* COPY */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="copy lg:col-span-5"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        style={{
                          fontFamily: "'Clash Display', sans-serif",
                          fontSize: 14,
                          letterSpacing: "0.3em",
                          color: "#89F3FF",
                        }}
                      >
                        {c.num} / {String(COLLECTIONS.length).padStart(2, '0')}
                      </span>
                      <span
                        className="h-px flex-1"
                        style={{ background: "rgba(137,243,255,0.3)" }}
                      />
                      <span
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-white/85"
                        style={{
                          background: "rgba(137,243,255,0.08)",
                          borderColor: "rgba(137,243,255,0.25)",
                          fontSize: 10,
                          letterSpacing: "0.15em",
                        }}
                      >
                        <VibeIcon
                          className="w-3 h-3"
                          style={{ color: "#89F3FF" }}
                        />
                        {c.vibe.toUpperCase()}
                      </span>
                    </div>

                    <h2
                      className="text-white mb-6"
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontWeight: 500,
                        fontSize: "clamp(36px, 4.5vw, 60px)",
                        lineHeight: 1,
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {c.name}
                    </h2>
                    <p
                      className="text-white/70 mb-9"
                      style={{ fontSize: 15, lineHeight: 1.65 }}
                    >
                      {c.blurb}
                    </p>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border mb-9"
                      style={{
                        borderColor: "rgba(137,243,255,0.18)",
                        background: "rgba(137,243,255,0.08)",
                      }}
                    >
                      {[
                        { l: "RESORTS", v: c.count.split(" ")[0] },
                        { l: "FROM", v: c.from },
                        { l: "STAY", v: c.duration.split(" ")[0] + "+ NT" },
                      ].map((s) => (
                        <div
                          key={s.l}
                          className="p-4"
                          style={{ background: "rgba(2,24,48,0.7)" }}
                        >
                          <div
                            className="text-white"
                            style={{
                              fontFamily: "'Clash Display', sans-serif",
                              fontSize: 20,
                            }}
                          >
                            {s.v}
                          </div>
                          <div
                            className="text-white/50 mt-1"
                            style={{ fontSize: 10, letterSpacing: "0.15em" }}
                          >
                            {s.l}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Highlights */}
                    <div className="mb-9">
                      <div
                        className="text-white/55 mb-4"
                        style={{ fontSize: 11, letterSpacing: "0.25em" }}
                      >
                        WHAT DEFINES THE COLLECTION
                      </div>
                      <ul className="space-y-3">
                        {c.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-3 text-white/85"
                            style={{ fontSize: 14, lineHeight: 1.55 }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                              style={{ background: "#89F3FF" }}
                            />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-7 py-3.5 rounded-2xl"
                      style={{
                        background: "#89F3FF",
                        color: "#021830",
                        fontSize: 13,
                        letterSpacing: "0.12em",
                        boxShadow: "0 15px 40px rgba(137,243,255,0.25)",
                      }}
                    >
                      EXPLORE {c.count.toUpperCase()}
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>

                  {/* ── MOBILE GALLERY (lg:hidden) ── */}
                  <div className="lg:hidden mt-10 flex flex-col gap-3">
                    {/* Featured — full-width tall card */}
                    <div
                      onClick={() => { if (c.resorts?.[0]) navigate(`/maldives-resort/${slugify(c.resorts[0].name)}`) }}
                      className="relative w-full rounded-[24px] overflow-hidden border group cursor-pointer"
                      style={{ height: 280, borderColor: "rgba(137,243,255,0.18)", boxShadow: "0 20px 60px rgba(0,15,40,0.55)" }}
                    >
                      <ImageWithFallback
                        src={c.hero}
                        alt={c.name}
                        className="w-full h-full object-cover transition-transform duration-[1600ms] group-active:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#021830]/80 via-transparent to-transparent" />
                      <div className="absolute top-5 left-5">
                        <span
                          className="px-3 py-1.5 rounded-full text-white border flex items-center gap-1.5"
                          style={{ background: "rgba(2,24,48,0.55)", borderColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(14px)", fontSize: 11, letterSpacing: "0.15em" }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#89F3FF" }} />
                          FEATURED · {c.resorts?.[0]?.atoll?.toUpperCase() || "MALDIVES"}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="text-white/65 mb-1" style={{ fontSize: 10, letterSpacing: "0.2em" }}>THE FLAGSHIP</div>
                        <div className="text-white" style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 26, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                          {c.resorts?.[0]?.name || c.name}
                        </div>
                      </div>
                    </div>

                    {/* Secondary resorts — 2-col row */}
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2].map((idx) => {
                        const resort = c.resorts?.[idx];
                        const fallbackImg = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900";
                        return (
                          <div
                            key={resort?.name || `fallback-mobile-${idx}`}
                            onClick={() => resort && navigate(`/maldives-resort/${slugify(resort.name)}`)}
                            className="relative rounded-[20px] overflow-hidden border group cursor-pointer"
                            style={{ height: 160, borderColor: "rgba(137,243,255,0.15)", boxShadow: "0 10px 30px rgba(0,15,40,0.5)" }}
                          >
                            <ImageWithFallback
                              src={resort?.image || fallbackImg}
                              alt={resort?.name || ""}
                              className="w-full h-full object-cover transition-transform duration-[1500ms] group-active:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#021830]/90 via-[#021830]/20 to-transparent" />
                            {resort && (
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <div className="text-white truncate" style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 14, lineHeight: 1.1 }}>{resort.name}</div>
                                <div className="text-[#89F3FF]/80 mt-1" style={{ fontSize: 10, letterSpacing: "0.1em" }}>{resort.atoll?.toUpperCase()}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── DESKTOP GALLERY (hidden lg:grid) ── */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden lg:grid lg:col-span-7 grid-cols-12 gap-3 h-[560px]"
                  >
                    {/* Big featured */}
                    <div
                      onClick={() => { if (c.resorts?.[0]) navigate(`/maldives-resort/${slugify(c.resorts[0].name)}`) }}
                      className="col-span-8 row-span-2 relative rounded-[28px] overflow-hidden border group cursor-pointer"
                      style={{
                        borderColor: "rgba(137,243,255,0.18)",
                        boxShadow:
                          "0 40px 100px rgba(0,15,40,0.55), 0 0 60px rgba(137,243,255,0.15)",
                      }}
                    >
                      <ImageWithFallback
                        src={c.hero}
                        alt={c.name}
                        className="w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#021830]/80 via-transparent to-transparent" />

                      {/* Floating featured chip */}
                      <div className="absolute top-6 left-6 flex items-center gap-2">
                        <span
                          className="px-3 py-1.5 rounded-full text-white border flex items-center gap-1.5"
                          style={{
                            background: "rgba(2,24,48,0.55)",
                            borderColor: "rgba(255,255,255,0.18)",
                            backdropFilter: "blur(14px)",
                            fontSize: 11,
                            letterSpacing: "0.15em",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#89F3FF" }}
                          />
                          FEATURED · {c.resorts?.[0]?.atoll?.toUpperCase() || "MALDIVES"}
                        </span>
                      </div>

                      {/* Featured resort name */}
                      <div className="absolute bottom-0 left-0 right-0 p-7">
                        <div
                          className="text-white/65 mb-2"
                          style={{ fontSize: 11, letterSpacing: "0.2em" }}
                        >
                          THE FLAGSHIP
                        </div>
                        <div
                          className="text-white"
                          style={{
                            fontFamily: "'Clash Display', sans-serif",
                            fontSize: "clamp(28px, 3vw, 40px)",
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {c.resorts?.[0]?.name || c.name}
                        </div>
                      </div>
                    </div>

                    {/* Two stacked small images */}
                    {[1, 2].map((idx) => {
                      const resort = c.resorts?.[idx];
                      if (resort) {
                        return (
                          <div
                            key={resort.name}
                            onClick={() => navigate(`/maldives-resort/${slugify(resort.name)}`)}
                            className="col-span-4 relative rounded-[24px] overflow-hidden border group cursor-pointer"
                            style={{
                              borderColor: "rgba(137,243,255,0.15)",
                              boxShadow: "0 20px 60px rgba(0,15,40,0.5)",
                            }}
                          >
                            <ImageWithFallback
                              src={resort.image}
                              alt={resort.name}
                              className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#021830]/90 via-[#021830]/20 to-transparent" />
                            
                            {/* Featured resort info */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex justify-between items-end">
                              <div className="flex-1 min-w-0 pr-3">
                                <div className="text-white truncate" style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(18px, 1.5vw, 24px)", lineHeight: 1.1 }}>
                                  {resort.name}
                                </div>
                                <div className="text-[#89F3FF]/80 mt-1.5" style={{ fontSize: 10, letterSpacing: "0.15em" }}>
                                  {resort.atoll?.toUpperCase()}
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center backdrop-blur-md group-hover:bg-[#89F3FF] group-hover:border-[#89F3FF] transition-all duration-300 shrink-0">
                                <ArrowUpRight className="w-4 h-4 text-white group-hover:text-[#021830]" />
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        const fallbackImg = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900";
                        return (
                          <div
                            key={`fallback-${idx}`}
                            className="col-span-4 relative rounded-[24px] overflow-hidden border group"
                            style={{
                              borderColor: "rgba(137,243,255,0.15)",
                              boxShadow: "0 20px 60px rgba(0,15,40,0.5)",
                            }}
                          >
                            <ImageWithFallback
                              src={fallbackImg}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#021830]/70 via-transparent to-transparent" />
                          </div>
                        );
                      }
                    })}
                  </motion.div>

                </div>

                {/* RESORT MINI-LIST */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {c.resorts.map((r) => {
                    const discounted = computeDiscountedPrice(r.price, r.offer);
                    return (
                    <div
                      key={r.name}
                      onClick={() => navigate(`/maldives-resort/${slugify(r.name)}`)}
                      className="rounded-2xl border p-5 flex items-center gap-4 group cursor-pointer"
                      style={{
                        background: "rgba(137,243,255,0.04)",
                        borderColor: "rgba(137,243,255,0.15)",
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative"
                      >
                        <ImageWithFallback
                          src={r.image}
                          alt={r.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {r.offer && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md" style={{ background: "#F4B942", fontSize: 8, fontWeight: 700, color: "#07120E" }}>
                            {getOfferBadgeLabel(r.offer)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-white truncate"
                          style={{
                            fontFamily: "'Clash Display', sans-serif",
                            fontSize: 16,
                            letterSpacing: "-0.005em",
                          }}
                        >
                          {r.name}
                        </div>
                        <div
                          className="text-white/55 mt-0.5 flex items-center gap-2"
                          style={{ fontSize: 11, letterSpacing: "0.05em" }}
                        >
                          {r.atoll}
                          <span
                            className="w-0.5 h-0.5 rounded-full bg-white/30"
                          />
                          {r.offer?.type === "FIXED_PACKAGE" ? (
                            <span style={{ color: "#89F3FF" }}>
                              {r.offer.packageNights}N · ${r.offer.packagePrice?.toLocaleString()}
                            </span>
                          ) : discounted !== null ? (
                            <span className="flex items-center gap-1">
                              <span style={{ color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>${r.price}</span>
                              <span style={{ color: "#89F3FF" }}>${discounted}</span>
                            </span>
                          ) : (
                            <span style={{ color: "#89F3FF" }}>
                              from ${r.price}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#89F3FF] transition-colors" />
                    </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          );
        })}
      </section>

      <Footer />
    </div>
  );
}
