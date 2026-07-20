"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Instagram,
  Facebook,
  Linkedin,
  Music2,
  MapPin,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const SL = {
  label: "Pearl of the Indian Ocean",
  description:
    "Thoughtfully planned journeys across breathtaking landscapes, rich cultural heritage, vibrant wildlife, and authentic local experiences.",
  tags: ["Sigiriya", "Ella", "Safari", "Tea Country", "Galle Fort"],
  image:
    "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1600",
  overlay:
    "linear-gradient(160deg, rgba(8,30,22,0.92) 0%, rgba(10,40,28,0.6) 50%, rgba(8,20,18,0.88) 100%)",
  primary: "#0B8D6B",
  gold: "#F4B942",
  glow: "rgba(244,185,66,0.35)",
};

export function LuxuryHero() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Static background ── */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={SL.image}
          alt="Sri Lanka"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: SL.overlay }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* ── Film grain ── */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* ── Social icons ── */}
      <div className="hidden md:flex flex-col gap-3 fixed right-6 top-1/2 -translate-y-1/2 z-40">
        {[Instagram, Facebook, Music2, Linkedin].map((Icon, i) => (
          <motion.a
            key={i}
            href="#"
            whileHover={{ scale: 1.15, boxShadow: `0 0 24px ${SL.glow}` }}
            className="w-10 h-10 rounded-full flex items-center justify-center border text-white/80 hover:text-white"
            style={{
              background: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Icon className="w-4 h-4" />
          </motion.a>
        ))}
      </div>

      {/* ── Main content — centred ── */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-[760px] mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-10" style={{ background: SL.gold }} />
              <span style={{ letterSpacing: "0.38em", fontSize: 11, color: SL.gold }}>
                DISCOVER · {SL.label.toUpperCase()}
              </span>
              <span className="h-px w-10" style={{ background: SL.gold }} />
            </div>

            {/* headline — single line */}
            <h1
              className="mb-5 whitespace-nowrap"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(44px, 7vw, 96px)",
                lineHeight: 1,
                letterSpacing: "-0.025em",
              }}
            >
              <span className="text-white/95">Discover </span>
              <span
                style={{
                  background: `linear-gradient(120deg, ${SL.gold} 0%, #ffffff 55%, ${SL.gold} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Sri Lanka
              </span>
            </h1>

            {/* description — single line */}
            <p
              className="mb-9 whitespace-nowrap"
              style={{
                fontSize: "clamp(13px, 1.3vw, 16px)",
                lineHeight: 1,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {SL.description}
            </p>

            {/* tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-11">
              {SL.tags.map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ y: -2 }}
                  className="px-4 py-1.5 rounded-full border text-white/80"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.16)",
                    backdropFilter: "blur(10px)",
                    fontSize: 12,
                    letterSpacing: "0.08em",
                  }}
                >
                  <MapPin className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate("/journeys")}
                whileHover={{ scale: 1.04, boxShadow: `0 0 40px ${SL.glow}` }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl flex items-center gap-2 text-white"
                style={{
                  background: `linear-gradient(120deg, ${SL.primary} 0%, ${SL.primary}cc 100%)`,
                  boxShadow: `0 10px 40px ${SL.glow}`,
                  fontSize: 14,
                  letterSpacing: "0.05em",
                }}
              >
                Explore Journeys
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => navigate("/plan-trip")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl flex items-center gap-2 border text-white"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,0.22)",
                  backdropFilter: "blur(14px)",
                  fontSize: 14,
                  letterSpacing: "0.05em",
                }}
              >
                Plan Your Journey
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-2 text-white/50">
        <span style={{ fontSize: 10, letterSpacing: "0.35em" }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </div>
    </div>
  );
}
