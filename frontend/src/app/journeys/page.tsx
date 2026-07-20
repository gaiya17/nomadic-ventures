"use client";
import { Suspense } from "react";
import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PageLoader } from "@/components/PageLoader";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface DbTour {
  slug: string;
  name: string;
  categoryName: string;
  categorySlug: string;
  days: number;
  shortDescription: string;
  destinations: string;
  image: string;
}

interface DbCategory {
  id: string;
  name: string;
  slug: string;
}

// ─── Accent colours pool ───────────────────────────────────────────────────────
const ACCENT_POOL = ["#F4B942", "#A78BFA", "#86EFAC", "#7BC8A4", "#22D3EE", "#F472B6", "#FB923C"];
function accentForSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffff;
  return ACCENT_POOL[h % ACCENT_POOL.length];
}

// ─── Filter / sort options ─────────────────────────────────────────────────────
const DURATION_OPTS = [
  { label: "Any Duration",       value: "all"    },
  { label: "Short  (1–4 days)",  value: "short"  },
  { label: "Medium (5–7 days)",  value: "medium" },
  { label: "Long   (8+ days)",   value: "long"   },
];
const SORT_OPTS = [
  { label: "Featured",              value: "featured"     },
  { label: "Duration: Short first", value: "duration-asc" },
  { label: "Duration: Long first",  value: "duration-desc"},
];

// ─── Small dropdown ────────────────────────────────────────────────────────────
function FilterDropdown({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value)!;

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors"
        style={{
          background: open ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${open ? "rgba(244,185,66,0.35)" : "rgba(255,255,255,0.1)"}`,
          fontSize: 12.5,
          color: value !== "all" ? "#F4B942" : "rgba(255,255,255,0.6)",
          letterSpacing: "0.03em",
        }}
      >
        {selected.label.split("  ")[0]}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full left-0 mt-2 z-30 rounded-[16px] overflow-hidden py-1.5"
            style={{
              background: "rgba(7,18,14,0.97)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              minWidth: 180,
            }}
          >
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.06] transition-colors text-left"
                style={{
                  fontSize: 13,
                  color: o.value === value ? "#F4B942" : "rgba(255,255,255,0.75)",
                }}
              >
                {o.label}
                {o.value === value && <div className="w-1.5 h-1.5 rounded-full bg-[#F4B942]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tour card ─────────────────────────────────────────────────────────────────
function TourCard({ tour, index }: { tour: DbTour; index: number }) {
  const router = useRouter();
  const accent = accentForSlug(tour.categorySlug);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-[24px] overflow-hidden cursor-pointer flex flex-col"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      onClick={() => router.push(`/tours/${tour.slug}`)}
      whileHover={{ y: -4 }}
    >
      {/* image */}
      <div className="relative overflow-hidden bg-[#07120E] isolate" style={{ height: 220 }}>
        {/* Wrapper that scales both image and gradient */}
        <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
          <ImageWithFallback
            src={tour.image}
            alt={tour.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(7,18,14,0.85) 100%)" }} />
        </div>
        {/* category badge */}
        <span
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}40`,
            color: accent,
            fontSize: 10,
            letterSpacing: "0.14em",
            fontFamily: "'Clash Display', sans-serif",
          }}
        >
          <Sparkles size={10} />
          <span className="pt-[2px]">{tour.categoryName.toUpperCase()}</span>
        </span>
        {/* duration */}
        <span
          className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(7,18,14,0.75)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.75)",
            fontSize: 10,
            backdropFilter: "blur(8px)",
          }}
        >
          {tour.days} Days
        </span>
      </div>

      {/* content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-white mb-2 mt-1 group-hover:text-white/90 transition-colors"
          style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, lineHeight: 1.2, letterSpacing: "-0.01em" }}
        >
          {tour.name}
        </h3>

        <div className="flex items-start gap-2 mb-2">
          <MapPin size={13} color="rgba(255,255,255,0.35)" className="mt-0.5 flex-shrink-0" />
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, letterSpacing: "0.02em" }}>
            {tour.destinations}
          </p>
        </div>

        <div
          className="flex items-center justify-between pt-4 mt-auto"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 15, color: accent, lineHeight: 1, letterSpacing: "0.02em" }}>
            Rate on request
          </p>
          <motion.div
            whileHover={{ x: 2, y: -2 }}
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: `${accent}16`, border: `1px solid ${accent}30` }}
          >
            <ArrowUpRight size={15} color={accent} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allTours,     setAllTours]     = useState<DbTour[]>([]);
  const [allCategories, setAllCategories] = useState<DbCategory[]>([]);
  const [loading,      setLoading]      = useState(true);

  // Fetch everything from the database
  useEffect(() => {
    fetch("/api/admin/tours/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const cats: DbCategory[] = data.categories.map((c: any) => ({
            id:   c.slug,
            name: c.name,
            slug: c.slug,
          }));
          setAllCategories(cats);

          const seen = new Set<string>();
          const tours: DbTour[] = [];
          data.categories.forEach((cat: any) => {
            (cat.tours || []).forEach((tMapping: any) => {
              const t = tMapping.tour;
              if (!t || seen.has(t.slug)) return;
              seen.add(t.slug);
              tours.push({
                slug:         t.slug,
                name:         t.name,
                categoryName: cat.name,
                categorySlug: cat.slug,
                days:         t.days || 1,
                shortDescription: t.shortDescription || "",
                destinations: Array.isArray(t.destinations)
                  ? t.destinations.join(" · ")
                  : (t.destinations || ""),
                image: t.media && t.media.length > 0
                  ? `${t.media.find((m: any) => m.type === "hero")?.url || t.media[0].url}`
                  : "https://images.unsplash.com/photo-1586227740560-8cf2732c1531?auto=format&fit=crop&q=80",
              });
            });
          });
          setAllTours(tours);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filters
  const [categoryId, setCategoryId] = useState<string>(() => searchParams.get("category") || "all");
  const [duration,   setDuration]   = useState("all");
  const [sort,       setSort]       = useState("featured");
  const [search,     setSearch]     = useState("");

  useEffect(() => {
    const param = searchParams.get("category");
    if (param) setCategoryId(param);
  }, [searchParams]);

  const clearAll = () => {
    setCategoryId("all");
    setDuration("all");
    setSort("featured");
    setSearch("");
  };

  const activeFilterCount =
    (categoryId !== "all" ? 1 : 0) +
    (duration   !== "all" ? 1 : 0);

  const filtered = useMemo(() => {
    let tours = [...allTours];

    if (search.trim()) {
      const q = search.toLowerCase();
      tours = tours.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.destinations.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q)
      );
    }

    if (categoryId !== "all") {
      tours = tours.filter((t) => t.categorySlug === categoryId);
    }

    if (duration !== "all") {
      tours = tours.filter((t) => {
        if (duration === "short")  return t.days <= 4;
        if (duration === "medium") return t.days >= 5 && t.days <= 7;
        if (duration === "long")   return t.days >= 8;
        return true;
      });
    }

    if (sort === "duration-asc")  tours.sort((a, b) => a.days - b.days);
    if (sort === "duration-desc") tours.sort((a, b) => b.days - a.days);

    return tours;
  }, [allTours, categoryId, duration, sort, search]);

  const minDays   = allTours.length > 0 ? Math.min(...allTours.map((t) => t.days)) : 0;
  const maxDays   = allTours.length > 0 ? Math.max(...allTours.map((t) => t.days)) : 0;
  const daysRange = minDays === maxDays ? `${minDays}` : `${minDays}–${maxDays}`;

  const activeCategory = allCategories.find((c) => c.id === categoryId);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #07120E 0%, #030A06 100%)" }}
    >
      <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" solid />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-40 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[400px] opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #F4B942 0%, transparent 70%)", filter: "blur(70px)" }} />
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)", filter: "blur(70px)" }} />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
            <defs>
              <pattern id="jgrid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#jgrid)" />
          </svg>
        </div>

        <div className="mx-auto px-6" style={{ maxWidth: 1320 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-10" style={{ background: "#F4B942" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.3em", color: "#F4B942" }}>ALL TOURS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(40px, 6.5vw, 82px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              color: "white",
            }}
          >
            Find your<br />
            <span style={{ background: "linear-gradient(90deg, #F4B942 0%, #89F3FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              perfect journey.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center gap-6 mt-7"
          >
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 480 }}>
              {loading
                ? "Loading itineraries…"
                : `${allTours.length} handcrafted itineraries — from ${minDays}-day coastal escapes to ${maxDays}-day island-wide adventures.`}
            </p>
            <div className="flex gap-6 ml-auto">
              {[
                { v: loading ? "—" : `${allTours.length}`, l: "Tours" },
                { v: loading ? "—" : `${allCategories.length}`, l: "Categories" },
                { v: loading ? "—" : daysRange, l: "Days" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 28, color: "#F4B942", lineHeight: 1 }}>{s.v}</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", marginTop: 3 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Filters ── */}
      <div className="sticky top-0 z-20 pb-6 pt-2">
        <div className="mx-auto px-6" style={{ maxWidth: 1320 }}>

          {/* Category pills — 100% from DB */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {/* All Tours pill */}
            <button
              onClick={() => setCategoryId("all")}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
              style={{
                background: categoryId === "all" ? "#F4B942" : "rgba(255,255,255,0.05)",
                border:     categoryId === "all" ? "1px solid #F4B942" : "1px solid rgba(255,255,255,0.12)",
                color:      categoryId === "all" ? "#07120E" : "rgba(255,255,255,0.7)",
                fontSize: 12.5,
                letterSpacing: "0.04em",
              }}
            >
              <Sparkles size={12} />
              All Tours
            </button>

            {/* DB category pills */}
            {allCategories.map((cat) => {
              const accent = accentForSlug(cat.slug);
              const isActive = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                  style={{
                    background: isActive ? accent : "rgba(255,255,255,0.05)",
                    border:     isActive ? `1px solid ${accent}` : "1px solid rgba(255,255,255,0.12)",
                    color:      isActive ? "#07120E" : "rgba(255,255,255,0.7)",
                    fontSize: 12.5,
                    letterSpacing: "0.04em",
                  }}
                >
                  <Sparkles size={12} />
                  {cat.name}
                </button>
              );
            })}
          </motion.div>

          {/* Search + filter row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="flex flex-wrap items-center gap-2"
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-[260px]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Search size={13} color="rgba(255,255,255,0.35)" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tours…"
                className="bg-transparent outline-none flex-1 text-white placeholder-white/30"
                style={{ fontSize: 12.5, letterSpacing: "0.03em" }}
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={12} color="rgba(255,255,255,0.35)" />
                </button>
              )}
            </div>

            <FilterDropdown options={DURATION_OPTS} value={duration} onChange={setDuration} />
            <div className="h-5 w-px ml-1 mr-1" style={{ background: "rgba(255,255,255,0.1)" }} />
            <FilterDropdown options={SORT_OPTS} value={sort} onChange={setSort} />

            <AnimatePresence>
              {(activeFilterCount > 0 || search) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl ml-auto"
                  style={{ background: "rgba(244,185,66,0.1)", border: "1px solid rgba(244,185,66,0.25)", fontSize: 12, color: "#F4B942" }}
                >
                  <SlidersHorizontal size={12} />
                  Clear
                  <X size={11} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── Results ── */}
      <section className="py-10 pb-28">
        <div className="mx-auto px-6" style={{ maxWidth: 1320 }}>
          {/* results count */}
          <div className="flex items-center justify-between mb-8">
            <motion.p
              key={filtered.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}
            >
              {loading ? "Loading…" : (
                <>
                  Showing{" "}
                  <span style={{ color: "#F4B942", fontFamily: "'Clash Display', sans-serif", fontSize: 16 }}>
                    {filtered.length}
                  </span>{" "}
                  of {allTours.length} journeys
                </>
              )}
            </motion.p>

            {categoryId !== "all" && activeCategory && (
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{
                  background: `${accentForSlug(activeCategory.slug)}15`,
                  border: `1px solid ${accentForSlug(activeCategory.slug)}35`,
                  color: accentForSlug(activeCategory.slug),
                  fontSize: 11,
                  letterSpacing: "0.08em",
                }}
              >
                <Sparkles size={11} />
                {activeCategory.name}
                <button onClick={() => setCategoryId("all")}><X size={10} /></button>
              </span>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-[24px] overflow-hidden animate-pulse" style={{ background: "rgba(255,255,255,0.04)", height: 360 }} />
              ))}
            </div>
          )}

          {/* Tour grid */}
          {!loading && (
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" layout>
                  {filtered.map((tour, i) => (
                    <TourCard key={tour.slug} tour={tour} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: "rgba(244,185,66,0.1)", border: "1px solid rgba(244,185,66,0.2)" }}>
                    <Search size={24} color="#F4B942" />
                  </div>
                  <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 24, color: "white", marginBottom: 8 }}>
                    No journeys match
                  </h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
                    Try adjusting your filters or searching for something else.
                  </p>
                  <button
                    onClick={clearAll}
                    className="px-6 py-2.5 rounded-full border text-white hover:bg-white/5 transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.2)", fontSize: 13 }}
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── Bespoke CTA ── */}
      <section className="pb-24">
        <div className="mx-auto px-6" style={{ maxWidth: 1320 }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[36px] p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10"
            style={{ background: "linear-gradient(135deg, rgba(244,185,66,0.1) 0%, rgba(34,211,238,0.06) 100%)", border: "1px solid rgba(244,185,66,0.2)" }}
          >
            <div className="absolute top-0 left-0 w-[400px] h-[250px] pointer-events-none opacity-20"
              style={{ background: "radial-gradient(ellipse, #F4B942 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div className="relative z-10">
              <p style={{ fontSize: 10, letterSpacing: "0.28em", color: "#F4B942", marginBottom: 10 }}>
                NONE OF THESE FEEL QUITE RIGHT?
              </p>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(26px, 3.5vw, 46px)", color: "white", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                We'll build yours from scratch.
              </h2>
              <p className="mt-4" style={{ fontSize: 15, color: "rgba(255,255,255,0.52)", lineHeight: 1.7, maxWidth: 420 }}>
                Every itinerary we've ever run started as a conversation. Tell us what you're dreaming of.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/plan-trip")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white"
                style={{ background: "linear-gradient(135deg, #F4B942 0%, #22D3EE 100%)", fontSize: 12, letterSpacing: "0.12em", fontFamily: "'Clash Display', sans-serif" }}
              >
                START A CONVERSATION
                <ArrowUpRight size={15} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PageContent />
    </Suspense>
  );
}
