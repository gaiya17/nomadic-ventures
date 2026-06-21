"use client";
import { Suspense } from "react";
import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Star,
  Waves,
  Mountain,
  Binoculars,
  Heart,
  Sparkles,
  Landmark,
  Zap,
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { TOURS, type Tour } from "@/data/tours";

// ─── All tours as flat array ───────────────────────────────────────────────────
const ALL_TOURS: Tour[] = Object.values(TOURS);

// ─── Categories — exactly mirrors the homepage SriLankaExperiences section ────
// `tag` matches the tour data tag value and the URL ?category= param
const CATEGORIES = [
  { id: "all",      label: "All Tours",            tag: null,         Icon: Sparkles,   accent: "#F4B942" },
  { id: "heritage", label: "Cultural & Heritage",   tag: "Heritage",   Icon: Landmark,   accent: "#A78BFA" },
  { id: "scenic",   label: "Hill Country Escapes",  tag: "Scenic",     Icon: Mountain,   accent: "#86EFAC" },
  { id: "safari",   label: "Wildlife Safaris",      tag: "Safari",     Icon: Binoculars, accent: "#7BC8A4" },
  { id: "beaches",  label: "Beach Getaways",        tag: "Beaches",    Icon: Waves,      accent: "#22D3EE" },
  { id: "honeymoon",label: "Luxury Honeymoons",     tag: "Honeymoon",  Icon: Heart,      accent: "#F472B6" },
  { id: "adventure",label: "Adventure Tours",       tag: "Adventure",  Icon: Zap,        accent: "#FB923C" },
] as const;

type CategoryId = typeof CATEGORIES[number]["id"];

// look up display meta from a tour's raw tag
function metaForTag(tag: string) {
  return (
    CATEGORIES.find((c) => c.tag === tag) ??
    { Icon: Sparkles, accent: "#F4B942" }
  );
}

// ─── Filter / sort options ─────────────────────────────────────────────────────
const DURATION_OPTS = [
  { label: "Any Duration", value: "all" },
  { label: "Short  (1–4 days)", value: "short" },
  { label: "Medium (5–7 days)", value: "medium" },
  { label: "Long   (8+ days)",  value: "long"   },
];

const PRICE_OPTS = [
  { label: "Any Price",    value: "all"     },
  { label: "Under $500",   value: "budget"  },
  { label: "$500–$800",    value: "mid"     },
  { label: "Over $800",    value: "premium" },
];

const SORT_OPTS = [
  { label: "Featured",              value: "featured"      },
  { label: "Price: Low → High",     value: "price-asc"     },
  { label: "Price: High → Low",     value: "price-desc"    },
  { label: "Duration: Short first", value: "duration-asc"  },
  { label: "Duration: Long first",  value: "duration-desc" },
];

// ─── Small dropdown ────────────────────────────────────────────────────────────
function FilterDropdown({
  options,
  value,
  onChange,
  accent = "rgba(255,255,255,0.6)",
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  accent?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors"
        style={{
          background: open ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${open ? "rgba(244,185,66,0.35)" : "rgba(255,255,255,0.1)"}`,
          fontSize: 12.5,
          color: value !== "all" ? "#F4B942" : accent,
          letterSpacing: "0.03em",
        }}
      >
        {selected.label.split(" ")[0]}
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
function TourCard({ tour, index }: { tour: Tour; index: number }) {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const meta = metaForTag(tour.tag);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-[24px] overflow-hidden cursor-pointer flex flex-col"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onClick={() => navigate(`/tours/sri-lanka/${tour.slug}`)}
      whileHover={{ y: -4 }}
    >
      {/* image */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <ImageWithFallback
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(7,18,14,0.75) 100%)" }}
        />
        {/* category badge */}
        <span
          className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: `${meta.accent}18`,
            border: `1px solid ${meta.accent}40`,
            color: meta.accent,
            fontSize: 10,
            letterSpacing: "0.14em",
            fontFamily: "'Clash Display', sans-serif",
          }}
        >
          <meta.Icon size={10} />
          {tour.tag.toUpperCase()}
        </span>
        {/* duration */}
        <span
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(7,18,14,0.75)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.75)",
            fontSize: 10,
            backdropFilter: "blur(8px)",
          }}
        >
          {tour.duration}
        </span>
      </div>

      {/* content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-1">
          <MapPin size={11} color="rgba(255,255,255,0.35)" className="mt-0.5 flex-shrink-0" />
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, letterSpacing: "0.04em" }}>
            {tour.places}
          </p>
        </div>

        <h3
          className="text-white mb-2 mt-1 group-hover:text-white/90 transition-colors"
          style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, lineHeight: 1.2, letterSpacing: "-0.01em" }}
        >
          {tour.name}
        </h3>

        <p
          className="flex-1 mb-4"
          style={{ fontSize: 12.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.65 }}
        >
          {tour.dek.slice(0, 90)}…
        </p>

        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>FROM</p>
            <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 20, color: meta.accent, lineHeight: 1 }}>
              ${tour.price}
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 3 }}>pp</span>
            </p>
          </div>
          <motion.div
            whileHover={{ x: 2, y: -2 }}
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: `${meta.accent}16`, border: `1px solid ${meta.accent}30` }}
          >
            <ArrowUpRight size={15} color={meta.accent} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
function PageContent() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const searchParams = useSearchParams();

  // Initialise category from ?category= URL param (e.g. coming from homepage)
  const initialCategory = (): CategoryId => {
    const param = searchParams.get("category");
    if (!param) return "all";
    const match = CATEGORIES.find((c) => c.tag === param);
    return match ? match.id : "all";
  };

  const [categoryId, setCategoryId] = useState<CategoryId>(initialCategory);
  const [duration,   setDuration]   = useState("all");
  const [price,      setPrice]      = useState("all");
  const [sort,       setSort]       = useState("featured");
  const [search,     setSearch]     = useState("");

  // Sync when URL param changes (e.g. browser back/forward)
  useEffect(() => {
    setCategoryId(initialCategory());
  }, [searchParams]);

  const activeCategory = CATEGORIES.find((c) => c.id === categoryId)!;

  const activeFilterCount =
    (categoryId !== "all" ? 1 : 0) +
    (duration   !== "all" ? 1 : 0) +
    (price      !== "all" ? 1 : 0);

  const clearAll = () => {
    setCategoryId("all");
    setDuration("all");
    setPrice("all");
    setSort("featured");
    setSearch("");
  };

  const filtered = useMemo(() => {
    let tours = [...ALL_TOURS];

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      tours = tours.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.places.toLowerCase().includes(q) ||
          t.tag.toLowerCase().includes(q)
      );
    }

    // category — filter by the tag mapped to this category
    if (activeCategory.tag) {
      tours = tours.filter((t) => t.tag === activeCategory.tag);
    }

    // duration
    if (duration !== "all") {
      tours = tours.filter((t) => {
        const d = parseInt(t.duration);
        if (duration === "short")  return d <= 4;
        if (duration === "medium") return d >= 5 && d <= 7;
        if (duration === "long")   return d >= 8;
        return true;
      });
    }

    // price
    if (price !== "all") {
      tours = tours.filter((t) => {
        const p = parseInt(t.price);
        if (price === "budget")  return p < 500;
        if (price === "mid")     return p >= 500 && p <= 800;
        if (price === "premium") return p > 800;
        return true;
      });
    }

    // sort
    tours.sort((a, b) => {
      if (sort === "price-asc")     return parseInt(a.price) - parseInt(b.price);
      if (sort === "price-desc")    return parseInt(b.price) - parseInt(a.price);
      if (sort === "duration-asc")  return parseInt(a.duration) - parseInt(b.duration);
      if (sort === "duration-desc") return parseInt(b.duration) - parseInt(a.duration);
      return 0;
    });

    return tours;
  }, [categoryId, duration, price, sort, search]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #07120E 0%, #030A06 100%)" }}
    >
      <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" solid />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-40 pb-16">
        {/* ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/3 w-[600px] h-[400px] opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #F4B942 0%, transparent 70%)", filter: "blur(70px)" }}
          />
          <div
            className="absolute top-0 right-1/4 w-[400px] h-[400px] opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)", filter: "blur(70px)" }}
          />
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
            <span style={{ fontSize: 10, letterSpacing: "0.3em", color: "#F4B942" }}>
              SRI LANKA TOURS
            </span>
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
            <span
              style={{
                background: "linear-gradient(120deg, #F4B942 0%, #ffffff 55%, #7BC8A4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
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
              {ALL_TOURS.length} handcrafted itineraries across Sri Lanka — from 3-day coastal escapes to 10-day island-wide adventures.
            </p>
            {/* quick stats */}
            <div className="flex gap-6 ml-auto">
              {[
                { v: `${ALL_TOURS.length}`, l: "Tours" },
                { v: "8", l: "Categories" },
                { v: "3–10", l: "Days" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 28, color: "#F4B942", lineHeight: 1 }}>
                    {s.v}
                  </p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", marginTop: 3 }}>
                    {s.l.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky filter bar ── */}
      <div
        className="sticky top-[72px] z-30 border-b"
        style={{
          background: "rgba(7,18,14,0.94)",
          backdropFilter: "blur(24px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="mx-auto px-6" style={{ maxWidth: 1320 }}>
          {/* Category pills row */}
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full flex-shrink-0 transition-all duration-200"
                  style={{
                    background: isActive ? `${cat.accent}20` : "rgba(255,255,255,0.05)",
                    border: `1px solid ${isActive ? cat.accent + "55" : "rgba(255,255,255,0.1)"}`,
                    color: isActive ? cat.accent : "rgba(255,255,255,0.6)",
                    fontSize: 12.5,
                    letterSpacing: "0.03em",
                  }}
                >
                  <cat.Icon size={12} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Secondary filters row */}
          <div
            className="flex items-center gap-3 pb-4 border-t pt-3"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            {/* search */}
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
            <FilterDropdown options={PRICE_OPTS}    value={price}    onChange={setPrice}    />

            <div className="h-5 w-px ml-1 mr-1" style={{ background: "rgba(255,255,255,0.1)" }} />

            <FilterDropdown options={SORT_OPTS} value={sort} onChange={setSort} />

            {/* active count + clear */}
            <AnimatePresence>
              {(activeFilterCount > 0 || search) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl ml-auto"
                  style={{
                    background: "rgba(244,185,66,0.1)",
                    border: "1px solid rgba(244,185,66,0.25)",
                    fontSize: 12,
                    color: "#F4B942",
                  }}
                >
                  <SlidersHorizontal size={12} />
                  Clear
                  <X size={11} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
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
              Showing{" "}
              <span style={{ color: "#F4B942", fontFamily: "'Clash Display', sans-serif", fontSize: 16 }}>
                {filtered.length}
              </span>{" "}
              of {ALL_TOURS.length} journeys
            </motion.p>

            {categoryId !== "all" && (
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{
                  background: `${activeCategory.accent}15`,
                  border: `1px solid ${activeCategory.accent}35`,
                  color: activeCategory.accent,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                }}
              >
                <activeCategory.Icon size={11} />
                {activeCategory.label}
                <button onClick={() => setCategoryId("all")}>
                  <X size={10} />
                </button>
              </span>
            )}
          </div>

          {/* grid */}
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                layout
              >
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
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(244,185,66,0.1)", border: "1px solid rgba(244,185,66,0.2)" }}
                >
                  <Search size={24} color="#F4B942" />
                </div>
                <h3
                  style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 24, color: "white", marginBottom: 8 }}
                >
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
            style={{
              background: "linear-gradient(135deg, rgba(244,185,66,0.1) 0%, rgba(34,211,238,0.06) 100%)",
              border: "1px solid rgba(244,185,66,0.2)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-[400px] h-[250px] pointer-events-none opacity-20"
              style={{ background: "radial-gradient(ellipse, #F4B942 0%, transparent 70%)", filter: "blur(60px)" }}
            />
            <div className="relative z-10">
              <p style={{ fontSize: 10, letterSpacing: "0.28em", color: "#F4B942", marginBottom: 10 }}>
                NONE OF THESE FEEL QUITE RIGHT?
              </p>
              <h2
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(26px, 3.5vw, 46px)",
                  color: "white",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                We'll build yours from scratch.
              </h2>
              <p
                className="mt-4"
                style={{ fontSize: 15, color: "rgba(255,255,255,0.52)", lineHeight: 1.7, maxWidth: 420 }}
              >
                Every itinerary we've ever run started as a conversation. Tell us what you're dreaming of.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white"
                style={{
                  background: "linear-gradient(135deg, #F4B942 0%, #22D3EE 100%)",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  fontFamily: "'Clash Display', sans-serif",
                }}
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
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
