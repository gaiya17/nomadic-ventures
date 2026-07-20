"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import {
  ArrowUpRight, X, MapPin, Clock, Calendar, Star,
  Landmark, Mountain, Binoculars, Waves, Heart, Zap, Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export type Experience = {
  id: string;
  slug: string;
  title: string;
  locationPlace: string;
  locationCountry: string;
  tagline: string;
  bestTimeStart: string;
  bestTimeEnd: string;
  highlights: string;
  contentBlocks: string;
  gallery: string;
  status: string;
};

// ─── Detail Modal ──────────────────────────────────────────────────────────────
function DestinationModal({
  dest,
  onClose,
}: {
  dest: Experience;
  onClose: () => void;
}) {
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);
  
  let gallery: string[] = [];
  try { gallery = JSON.parse(dest.gallery) || []; } catch(e) {}
  
  let highlights: string[] = [];
  try { highlights = JSON.parse(dest.highlights) || []; } catch(e) {}
  
  let contentBlocks: any[] = [];
  try { contentBlocks = JSON.parse(dest.contentBlocks) || []; } catch(e) {}

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl max-h-[94vh] lg:max-h-[88vh] overflow-y-auto rounded-t-[28px] lg:rounded-[28px] flex flex-col"
        style={{
          background: "rgba(7,18,14,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero image ── */}
        <div className="relative flex-shrink-0 h-64 lg:h-80 overflow-hidden rounded-t-[28px] lg:rounded-t-[28px]">
          <ImageWithFallback
            src={gallery[activeImg] || "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=1400"}
            alt={dest.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(7,18,14,0.85) 100%)" }}
          />

          {/* close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <X size={16} color="white" />
          </button>

          {/* bottom: name + location */}
          <div className="absolute bottom-5 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={12} color="rgba(255,255,255,0.5)" />
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em" }}>
                {dest.locationPlace} • {dest.locationCountry}
              </p>
            </div>
            <h2
              className="text-white"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(26px, 4vw, 40px)",
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              {dest.title}
            </h2>
          </div>

          {/* gallery thumb nav */}
          <div className="absolute bottom-5 right-6 flex gap-1.5">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                className="rounded-full transition-all"
                style={{
                  width: i === activeImg ? 20 : 6,
                  height: 6,
                  background: i === activeImg ? "#C1A87D" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-0 divide-x" style={{ borderColor: "rgba(255,255,255,0.07)" }}>

            {/* Left: description */}
            <div className="p-6 lg:p-8">
              <p
                className="mb-5 italic"
                style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, fontStyle: "italic" }}
              >
                {dest.tagline}
              </p>

              <div className="space-y-6">
                {contentBlocks.map((block, i) => {
                  if (block.type === "paragraph") {
                    return <p key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.8 }}>{block.value}</p>;
                  }
                  if (block.type === "quote") {
                    return (
                      <blockquote key={i} className="pl-4 border-l-2 border-[#C1A87D] my-4 italic text-[15px] text-white/80">
                        "{block.value}"
                      </blockquote>
                    );
                  }
                  if (block.type === "list") {
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-1 my-2">
                        <li style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.8 }}>{block.value}</li>
                      </ul>
                    );
                  }
                  if (block.type === "tip") {
                    return (
                      <div key={i} className="bg-[#C1A87D]/10 border border-[#C1A87D]/20 p-4 rounded-xl flex gap-3 my-4">
                        <Star size={16} color="#C1A87D" className="mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-[#C1A87D] text-xs font-semibold tracking-wider mb-1 uppercase">Pro-Tip</h4>
                          <p className="text-white/70 text-sm leading-relaxed">{block.value}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Grid gallery */}
              <div className="mt-8 grid grid-cols-4 gap-3">
                {gallery.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="relative h-28 rounded-[14px] overflow-hidden cursor-pointer group"
                  >
                    <ImageWithFallback
                      src={img}
                      alt=""
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: details */}
            <div className="p-6 lg:p-8 bg-black/20">
              {/* Quick facts */}
              <div className="mb-8">
                <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
                  QUICK FACTS
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(244,185,66,0.1)", border: "1px solid rgba(244,185,66,0.2)" }}>
                      <Calendar size={13} color="#F4B942" />
                    </div>
                    <div>
                      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>BEST TIME</p>
                      <p style={{ fontSize: 13, color: "white" }}>{dest.bestTimeStart} – {dest.bestTimeEnd}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
                  HIGHLIGHTS
                </p>
                <div className="space-y-2.5">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                        <Star size={8} color="#A78BFA" />
                      </div>
                      <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                        {h}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Destination Card ──────────────────────────────────────────────────────────
function DestCard({
  dest,
  index,
  onOpen,
}: {
  dest: Experience;
  index: number;
  onOpen: () => void;
}) {
  let gallery: string[] = [];
  try { gallery = JSON.parse(dest.gallery) || []; } catch(e) {}
  const heroImage = gallery[0] || "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=1400";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      className="group relative rounded-[22px] overflow-hidden cursor-pointer"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      whileHover={{ y: -5 }}
    >
      {/* image */}
      <div className="relative overflow-hidden" style={{ height: 240 }}>
        <ImageWithFallback
          src={heroImage}
          alt={dest.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(7,18,14,0.78) 100%)" }}
        />

        {/* arrow icon */}
        <div
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <ArrowUpRight size={13} color="white" />
        </div>

        {/* name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={10} color="rgba(255,255,255,0.45)" />
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
              {dest.locationPlace} • {dest.locationCountry}
            </p>
          </div>
          <h3
            className="text-white"
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 20,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            {dest.title}
          </h3>
        </div>
      </div>

      {/* footer strip */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.4, maxWidth: "100%" }}>
          {dest.tagline}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────
export function PageContent({ initialSlug }: { initialSlug?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get("/api/admin/experiences");
        const exps = res.data;
        setExperiences(exps);
        
        // Open modal if initialSlug is provided and matches an experience
        if (initialSlug) {
          const match = exps.find((e: Experience) => e.slug === initialSlug);
          if (match) setSelectedId(match.id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperiences();
  }, [initialSlug]);

  const selectedDest = experiences.find((d) => d.id === selectedId) ?? null;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #07120E 0%, #030A06 100%)" }}
    >
      <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" solid />

      {/* ── Hero ── */}
      <section className="pt-40 pb-16 px-6" style={{ maxWidth: 1320, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px w-10" style={{ background: "#F4B942" }} />
          <span style={{ fontSize: 10, letterSpacing: "0.3em", color: "#F4B942" }}>
            EXPLORE
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(40px, 6vw, 76px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              color: "white",
            }}
          >
            Experiences crafted<br />
            <span
              style={{
                background: "linear-gradient(120deg, #F4B942 0%, #ffffff 55%, #7BC8A4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for every traveler.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.75,
              maxWidth: 380,
            }}
          >
            {isLoading ? "Loading destinations..." : `${experiences.length} destination${experiences.length !== 1 ? "s" : ""} — click any to read the full story and plan your visit.`}
          </motion.p>
        </div>
      </section>

      {/* ── Destinations grid ── */}
      <section className="py-12 pb-28 px-6" style={{ maxWidth: 1320, margin: "0 auto" }}>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F4B942]"></div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              layout
            >
              {experiences.map((dest, i) => (
                <DestCard
                  key={dest.id}
                  dest={dest}
                  index={i}
                  onOpen={() => {
                    setSelectedId(dest.id);
                    window.history.pushState(null, "", `/experiences/${dest.slug}`);
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      <Footer />

      {/* ── Destination detail modal ── */}
      <AnimatePresence>
        {selectedDest && (
          <DestinationModal
            dest={selectedDest}
            onClose={() => {
              setSelectedId(null);
              window.history.pushState(null, "", "/experiences");
            }}
          />
        )}
      </AnimatePresence>
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
