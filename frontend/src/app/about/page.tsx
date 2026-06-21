"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import logoSrc from "@/imports/Normadic.png";
import {
  ArrowUpRight,
  Compass,
  Car,
  Star,
  Sparkles,
  Globe,
  Route,
  Camera,
  Heart,
  SlidersHorizontal,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

// ─── Why Normadic pillars ──────────────────────────────────────────────────────
const WHY_PILLARS = [
  {
    Icon: SlidersHorizontal,
    accent: "#F4B942",
    label: "Tailor-Made Travel, Designed Around You",
    body: "No two travelers are the same. Every journey we create is carefully designed around your interests, travel style, pace, and preferences, ensuring a truly personal experience.",
  },
  {
    Icon: Compass,
    accent: "#7BC8A4",
    label: "Local Expertise, Genuine Insight",
    body: "As a Sri Lankan travel specialist, we go beyond the guidebooks to connect you with the island's most remarkable destinations, authentic experiences, and hidden treasures.",
  },
  {
    Icon: Route,
    accent: "#22D3EE",
    label: "Seamless Travel from Start to Finish",
    body: "From the moment you enquire until your departure, our team handles every detail with care, allowing you to travel with confidence and peace of mind.",
  },
  {
    Icon: Car,
    accent: "#F4B942",
    label: "Travel in Comfort",
    body: "Our fleet of well-maintained vehicles and professional chauffeurs ensures a safe, comfortable, and enjoyable journey throughout Sri Lanka, whether you're travelling as a couple, family, or group.",
  },
  {
    Icon: Star,
    accent: "#7BC8A4",
    label: "Handpicked Experiences & Stays",
    body: "We carefully select accommodations, guides, and experiences that meet our standards for quality, comfort, authenticity, and value.",
  },
  {
    Icon: Heart,
    accent: "#22D3EE",
    label: "Creating Memories That Last",
    body: "More than just planning holidays, we create meaningful travel experiences that inspire, connect, and leave lasting memories long after the journey ends.",
  },
];

// ─── Philosophy chapters ───────────────────────────────────────────────────────
const CHAPTERS = [
  {
    eyebrow: "OUR PHILOSOPHY",
    heading: "We understand that every traveler is different.",
    body: "That's why we take a personalized approach to planning, ensuring that every journey is carefully designed around your travel style, pace, and preferences. Whether you're seeking iconic highlights, authentic local experiences, or hidden gems off the beaten path, our goal is to create journeys that feel personal, seamless, and memorable.",
    accent: "#F4B942",
    image: "https://images.unsplash.com/photo-1711797750174-c3750dd9d7c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
  },
  {
    eyebrow: "LOCAL EXPERTISE · GLOBAL PERSPECTIVE",
    heading: "We understand that expectations vary from one market to another.",
    body: "Having worked with travelers from diverse cultures and backgrounds, our team takes pride in creating experiences that resonate with each traveler while showcasing the very best of Sri Lanka and the Maldives.",
    accent: "#7BC8A4",
    image: "https://images.unsplash.com/photo-1580794749460-76f97b7180d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
  },
  {
    eyebrow: "TRAVEL WITH CONFIDENCE",
    heading: "Every aspect of your journey is managed with attention to detail.",
    body: "From the moment you arrive until your departure, with our own transportation services, trusted partners, carefully selected accommodations, and dedicated support, we ensure a smooth and comfortable travel experience throughout your stay.",
    accent: "#22D3EE",
    image: "https://images.unsplash.com/photo-1432462770865-65b70566d673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
  },
];

// ─── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "15+", label: "Years of experience" },
  { value: "2023", label: "Founded" },
  { value: "2", label: "Destinations" },
  { value: "100%", label: "Tailor-made" },
];

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#07120E", color: "white", fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" solid />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[700px] h-[600px] opacity-[0.12]"
            style={{ background: "radial-gradient(circle, #F4B942 0%, transparent 65%)", filter: "blur(80px)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #22D3EE 0%, transparent 65%)", filter: "blur(80px)" }}
          />
          {/* grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]">
            <defs>
              <pattern id="about-grid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" />
          </svg>
        </div>

        <div className="relative max-w-[1320px] mx-auto px-8 pt-44 pb-20">
          {/* breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-12"
            style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)" }}
          >
            <span>HOME</span>
            <span style={{ color: "#F4B942" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>WHY NORMADIC</span>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-16 items-end">
            {/* left: headline */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-3 mb-7"
              >
                <div className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #F4B942)" }} />
                <span style={{ fontSize: 10, letterSpacing: "0.4em", color: "#F4B942" }}>
                  WE ARE NORMADIC VENTURES
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(44px, 6.5vw, 88px)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                }}
              >
                Creating Meaningful<br />
                <span
                  style={{
                    background: "linear-gradient(120deg, #F4B942 0%, #ffffff 50%, #22D3EE 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontStyle: "italic",
                  }}
                >
                  Journeys
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-7 max-w-[520px]"
                style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.65)" }}
              >
                Across Sri Lanka &amp; the Maldives — founded in 2023 by{" "}
                <span className="text-white">Sanoj Wijemanne</span>, backed by more than
                15 years of experience in the tourism industry.
              </motion.p>
            </div>

            {/* right: stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="lg:col-span-5 grid grid-cols-2 gap-3"
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="rounded-[20px] p-6"
                  style={{
                    background: i % 2 === 0 ? "rgba(244,185,66,0.06)" : "rgba(34,211,238,0.05)",
                    border: `1px solid ${i % 2 === 0 ? "rgba(244,185,66,0.18)" : "rgba(34,211,238,0.15)"}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 36,
                      lineHeight: 1,
                      color: i % 2 === 0 ? "#F4B942" : "#22D3EE",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="mt-2"
                    style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)" }}
                  >
                    {s.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Gold hairline divider ── */}
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(244,185,66,0.4) 30%, rgba(34,211,238,0.3) 70%, transparent)" }} />
      </div>

      {/* ── Founding story ── */}
      <section className="max-w-[1320px] mx-auto px-8 py-28">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* ── Brand identity panel ── */}
            <div
              className="relative rounded-[32px] overflow-hidden flex flex-col"
              style={{
                height: 580,
                background: "linear-gradient(160deg, #080F0B 0%, #0C1A11 50%, #060D09 100%)",
                border: "1px solid rgba(244,185,66,0.18)",
              }}
            >
              {/* grid texture */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.045]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="brand-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#brand-grid)" />
              </svg>

              {/* corner accent lines */}
              <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-6 left-6 w-8 h-px" style={{ background: "#F4B942", opacity: 0.6 }} />
                <div className="absolute top-6 left-6 w-px h-8" style={{ background: "#F4B942", opacity: 0.6 }} />
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-6 right-6 w-8 h-px" style={{ background: "#F4B942", opacity: 0.6 }} />
                <div className="absolute top-6 right-6 w-px h-8" style={{ background: "#F4B942", opacity: 0.6 }} />
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
                <div className="absolute bottom-6 left-6 w-8 h-px" style={{ background: "#22D3EE", opacity: 0.45 }} />
                <div className="absolute bottom-6 left-6 w-px h-8" style={{ background: "#22D3EE", opacity: 0.45 }} />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
                <div className="absolute bottom-6 right-6 w-8 h-px" style={{ background: "#22D3EE", opacity: 0.45 }} />
                <div className="absolute bottom-6 right-6 w-px h-8" style={{ background: "#22D3EE", opacity: 0.45 }} />
              </div>

              {/* centre glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 60% 50% at 50% 44%, rgba(244,185,66,0.13) 0%, transparent 70%)",
                }}
              />

              {/* decorative orbit rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: -20 }}>
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 220, height: 220,
                    border: "1px solid rgba(244,185,66,0.1)",
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 320, height: 320,
                    border: "1px solid rgba(244,185,66,0.06)",
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 430, height: 430,
                    border: "1px solid rgba(34,211,238,0.05)",
                  }}
                />
              </div>

              {/* top eyebrow */}
              <div className="relative z-10 flex items-center justify-center pt-10">
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.45em",
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "'Clash Display', sans-serif",
                  }}
                >
                  NORMADIC VENTURES
                </span>
              </div>

              {/* logo + wordmark — centre */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-0 px-8">
                {/* glow disc */}
                <div
                  className="absolute w-36 h-36 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(244,185,66,0.22) 0%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />

                {/* logo icon */}
                <motion.img
                  src={logoSrc.src}
                  alt="Normadic Ventures"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: "contain",
                    filter: "drop-shadow(0 0 28px rgba(244,185,66,0.55)) drop-shadow(0 0 8px rgba(244,185,66,0.3))",
                    position: "relative",
                    zIndex: 1,
                  }}
                />

                {/* wordmark */}
                <div className="relative z-10 mt-6 text-center">
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 26,
                      letterSpacing: "0.35em",
                      color: "white",
                      lineHeight: 1,
                    }}
                  >
                    NORMADIC
                  </div>
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 26,
                      letterSpacing: "0.35em",
                      color: "#F4B942",
                      lineHeight: 1.1,
                    }}
                  >
                    VENTURES
                  </div>
                </div>

                {/* hairline + tagline */}
                <div className="relative z-10 mt-7 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(244,185,66,0.5))" }} />
                    <span style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(255,255,255,0.4)" }}>
                      EST. 2023
                    </span>
                    <div className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(244,185,66,0.5), transparent)" }} />
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.15em",
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "'Clash Display', sans-serif",
                      textAlign: "center",
                    }}
                  >
                    CREATING MEANINGFUL JOURNEYS
                  </p>
                </div>
              </div>

              {/* bottom strip */}
              <div
                className="relative z-10 flex items-center justify-between px-8 py-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="text-center">
                  <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, color: "#F4B942", lineHeight: 1 }}>
                    15+
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                    YEARS EXP.
                  </p>
                </div>
                <div
                  className="h-8 w-px"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
                <div className="text-center">
                  <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, color: "white", lineHeight: 1 }}>
                    Sanoj Wijemanne
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                    FOUNDER
                  </p>
                </div>
                <div
                  className="h-8 w-px"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
                <div className="text-center">
                  <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, color: "#22D3EE", lineHeight: 1 }}>
                    2
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                    DESTINATIONS
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: "#F4B942" }} />
              <span style={{ fontSize: 10, letterSpacing: "0.28em", color: "#F4B942" }}>OUR STORY</span>
            </div>
            <h2
              className="mb-8"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(32px, 4vw, 50px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "white",
              }}
            >
              Built on a simple belief.
            </h2>

            <div className="space-y-5" style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,0.62)" }}>
              <p>
                Nomadic Ventures was built on a simple belief: exceptional travel is created through{" "}
                <span className="text-white/90">local expertise, personalized service, and genuine care</span>{" "}
                for every traveler.
              </p>
              <p>
                Backed by more than 15 years of experience in the tourism industry, we specialize in
                designing tailor-made journeys across Sri Lanka and the Maldives for travelers from
                around the world.
              </p>
              <p>
                From cultural discoveries and wildlife encounters to luxury escapes, family holidays,
                and adventure-filled experiences, every itinerary is thoughtfully crafted to reflect
                the unique interests and expectations of each guest.
              </p>
            </div>

            {/* pull quote */}
            <div
              className="mt-10 p-6 rounded-[20px]"
              style={{
                background: "rgba(244,185,66,0.06)",
                border: "1px solid rgba(244,185,66,0.2)",
                borderLeft: "3px solid #F4B942",
              }}
            >
              <p
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 18,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.85)",
                  fontStyle: "italic",
                }}
              >
                "We look forward to welcoming you to Sri Lanka."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #F4B942, #22D3EE)", color: "#07120E", fontFamily: "'Clash Display', sans-serif", fontSize: 12 }}
                >
                  SW
                </div>
                <div>
                  <p style={{ fontSize: 13, color: "white" }}>Sanoj Wijemanne</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>
                    Founder · Nomadic Ventures
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Three philosophy chapters (alternating) ── */}
      {CHAPTERS.map((chapter, i) => (
        <section
          key={chapter.eyebrow}
          className="border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-[1320px] mx-auto px-8 py-24">
            <div className={`grid lg:grid-cols-12 gap-14 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
              {/* image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5 lg:[direction:ltr]"
              >
                <div className="relative rounded-[28px] overflow-hidden" style={{ height: 420 }}>
                  <ImageWithFallback
                    src={chapter.image}
                    alt={chapter.eyebrow}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(7,18,14,0.6) 100%)" }} />
                  {/* accent chip */}
                  <div
                    className="absolute top-5 left-5 px-3 py-1.5 rounded-full"
                    style={{
                      background: `${chapter.accent}18`,
                      border: `1px solid ${chapter.accent}40`,
                      color: chapter.accent,
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      fontFamily: "'Clash Display', sans-serif",
                    }}
                  >
                    {chapter.eyebrow}
                  </div>
                </div>
              </motion.div>

              {/* text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-7 lg:[direction:ltr]"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8" style={{ background: chapter.accent }} />
                  <span style={{ fontSize: 10, letterSpacing: "0.25em", color: chapter.accent }}>
                    {chapter.eyebrow}
                  </span>
                </div>
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    color: "white",
                  }}
                >
                  {chapter.heading}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.85, color: "rgba(255,255,255,0.58)", maxWidth: 540 }}>
                  {chapter.body}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* ── More Than a Holiday ── */}
      <section
        className="relative overflow-hidden border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.08]"
            style={{ background: "radial-gradient(ellipse, #F4B942 0%, transparent 70%)", filter: "blur(60px)" }}
          />
        </div>
        <div className="relative max-w-[1320px] mx-auto px-8 py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Sparkles className="w-5 h-5 mx-auto mb-6" style={{ color: "#F4B942" }} />
            <p style={{ fontSize: 10, letterSpacing: "0.3em", color: "#F4B942", marginBottom: 20 }}>
              MORE THAN A HOLIDAY
            </p>
            <h2
              className="mx-auto mb-8"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(36px, 5.5vw, 72px)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                maxWidth: 820,
                background: "linear-gradient(120deg, #ffffff 30%, rgba(255,255,255,0.6) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              We don't simply arrange trips — we create{" "}
              <span
                style={{
                  background: "linear-gradient(120deg, #F4B942, #22D3EE)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                meaningful experiences
              </span>
            </h2>
            <p
              className="mx-auto"
              style={{
                fontSize: 17,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.55)",
                maxWidth: 620,
              }}
            >
              Our passion for hospitality, commitment to service, and deep knowledge of our
              destinations allow us to deliver journeys that inspire, connect, and leave a
              lasting impression long after the journey ends.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Why Normadic Ventures — 6 pillars ── */}
      <section
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-[1320px] mx-auto px-8 py-28">
          {/* header */}
          <div className="grid lg:grid-cols-12 gap-10 mb-16">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8" style={{ background: "#F4B942" }} />
                <span style={{ fontSize: 10, letterSpacing: "0.28em", color: "#F4B942" }}>
                  WHY NORMADIC VENTURES
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(36px, 4.5vw, 60px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  color: "white",
                }}
              >
                Six reasons to travel with us.
              </h2>
            </div>
            <div className="lg:col-span-7 flex items-end">
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", maxWidth: 520 }}>
                Every decision we make — from the partners we choose to the drivers we hire —
                comes back to one question: does this make the journey better for you?
              </p>
            </div>
          </div>

          {/* 6 pillar cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative p-7 rounded-[24px] overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "border-color 0.3s, background 0.3s",
                }}
                whileHover={{
                  backgroundColor: "rgba(255,255,255,0.055)",
                }}
              >
                {/* hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(400px at 0% 0%, ${pillar.accent}08 0%, transparent 70%)`,
                  }}
                />

                {/* icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: `${pillar.accent}14`,
                    border: `1px solid ${pillar.accent}30`,
                  }}
                >
                  <pillar.Icon size={20} color={pillar.accent} />
                </div>

                {/* number */}
                <span
                  className="absolute top-6 right-6"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.12)",
                    letterSpacing: "0.05em",
                  }}
                >
                  0{i + 1}
                </span>

                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 19,
                    lineHeight: 1.25,
                    color: "white",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {pillar.label}
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.72, color: "rgba(255,255,255,0.52)" }}>
                  {pillar.body}
                </p>

                {/* bottom accent line */}
                <div
                  className="absolute bottom-0 left-7 right-7 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${pillar.accent}50, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global reach visual strip ── */}
      <section
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
      >
        <div className="max-w-[1320px] mx-auto px-8 py-12">
          <div className="flex flex-wrap items-center justify-between gap-8">
            {[
              { Icon: Globe, label: "Sri Lanka", sub: "12 Curated Regions" },
              { Icon: Compass, label: "Maldives", sub: "20 Luxury Resorts" },
              { Icon: Car, label: "Own Transport Fleet", sub: "Sri Lanka Wide" },
              { Icon: Camera, label: "Tailor-Made Only", sub: "Zero Off-the-Shelf" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(244,185,66,0.1)", border: "1px solid rgba(244,185,66,0.2)" }}
                >
                  <item.Icon size={18} color="#F4B942" />
                </div>
                <div>
                  <p style={{ fontSize: 15, color: "white", fontFamily: "'Clash Display', sans-serif" }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
                    {item.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-[1320px] mx-auto px-8 py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[40px] p-14 lg:p-20 grid lg:grid-cols-12 gap-10 items-center"
          style={{
            background: "linear-gradient(135deg, rgba(244,185,66,0.1) 0%, rgba(7,18,14,0.5) 50%, rgba(34,211,238,0.08) 100%)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(700px 350px at 80% 50%, rgba(34,211,238,0.1), transparent 60%)" }}
          />

          <div className="lg:col-span-8 relative">
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(36px, 4.5vw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                color: "white",
              }}
            >
              Ready when{" "}
              <span
                style={{
                  background: "linear-gradient(120deg, #F4B942, #ffffff 50%, #22D3EE)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                you are.
              </span>
            </h2>
            <p className="mt-5 max-w-lg" style={{ fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.6)" }}>
              Tell us where you'd like to wake up next. One of our designers will respond within 72 hours.
            </p>
          </div>

          <div className="lg:col-span-4 relative flex lg:justify-end">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-3 pl-7 pr-3 py-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, #F4B942, #E8A923)",
                color: "#07120E",
                fontSize: 12,
                letterSpacing: "0.18em",
                fontFamily: "'Clash Display', sans-serif",
                boxShadow: "0 18px 50px rgba(244,185,66,0.3)",
              }}
            >
              START A CONVERSATION
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "#07120E", color: "#F4B942" }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
