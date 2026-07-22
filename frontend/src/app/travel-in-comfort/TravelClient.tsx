"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Car,
  Shield,
  CheckCircle,
  Wind,
  BadgeCheck,
  Armchair,
  Package,
  PlaneLanding,
  Route,
  Users,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

// ─── Every Journey Includes ────────────────────────────────────────────────────
const FEATURES = [
  {
    Icon: Wind,
    accent: "#F4B942",
    label: "Air-Conditioned Comfort",
    body: "Travel in modern, fully air-conditioned vehicles designed to ensure a pleasant and comfortable journey in Sri Lanka's tropical climate.",
  },
  {
    Icon: BadgeCheck,
    accent: "#7BC8A4",
    label: "Experienced Professional Chauffeurs",
    body: "Our courteous and knowledgeable drivers are carefully selected for their professionalism, safe driving standards, and local expertise.",
  },
  {
    Icon: Armchair,
    accent: "#22D3EE",
    label: "Spacious & Comfortable Seating",
    body: "Relax in well-maintained vehicles offering comfortable seating, generous legroom, and a pleasant environment for both short and longer journeys.",
  },
  {
    Icon: Shield,
    accent: "#F4B942",
    label: "Safety & Reliability",
    body: "All vehicles undergo regular maintenance and safety inspections to meet high operational standards, providing peace of mind throughout your travels.",
  },
  {
    Icon: Package,
    accent: "#7BC8A4",
    label: "Ample Luggage Capacity",
    body: "Whether travelling light or on an extended holiday, our vehicles provide sufficient space for all luggage and personal belongings.",
  },
  {
    Icon: PlaneLanding,
    accent: "#22D3EE",
    label: "Airport Meet & Greet Service",
    body: "Enjoy a seamless arrival experience with professional airport transfers, including a personalised welcome from the moment you land.",
  },
  {
    Icon: Route,
    accent: "#F4B942",
    label: "Flexible & Personalised Service",
    body: "Our transportation is tailored to your itinerary, allowing you to travel at your own pace with the flexibility to stop along the way whenever desired.",
  },
];

// ─── Fleet categories ──────────────────────────────────────────────────────────
const FLEET_CATS = [
  {
    type: "Sedan Car",
    pax: "1 – 2 Pax",
    paxNum: 2,
    icon: Car,
    accent: "#F4B942",
    desc: "Perfect for solo travellers and couples — a smooth, private transfer experience.",
    features: ["Private chauffeur", "Premium comfort", "Ideal for airports & city transfers"],
  },
  {
    type: "Micro Van",
    pax: "3 – 8 Pax",
    paxNum: 8,
    icon: Car,
    accent: "#7BC8A4",
    desc: "Spacious and comfortable for small groups, families, and multi-bag journeys.",
    features: ["Large luggage area", "Captain seats available", "Ideal for families"],
  },
  {
    type: "Mini Coach",
    pax: "7 – 15 Pax",
    paxNum: 15,
    icon: Car,
    accent: "#22D3EE",
    desc: "The ideal mid-size option for groups exploring Sri Lanka together.",
    features: ["Reclining seats", "Central aisle", "Ideal for group tours"],
  },
  {
    type: "Large Coach",
    pax: "16 – 45 Pax",
    paxNum: 45,
    icon: Car,
    accent: "#F4B942",
    desc: "Full-size coaches for corporate groups, conferences, and large travel parties.",
    features: ["Air-con throughout", "PA system available", "Ideal for large groups"],
  },
];

// ─── Luxury fleet ──────────────────────────────────────────────────────────────
const LUXURY_FLEET = [
  {
    brand: "Mercedes-Benz",
    model: "Vito",
    category: "Luxury Van",
    seats: "Up to 7",
    image: "https://images.unsplash.com/photo-1625513123245-fcb02d69ad12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    accent: "#F4B942",
    tags: ["Executive Comfort", "Premium Finish", "Airport Transfers"],
  },
  {
    brand: "Mercedes-Benz",
    model: "Sedan",
    category: "Luxury Sedan",
    seats: "Up to 3",
    image: "https://images.unsplash.com/photo-1592309905620-e5b59f6dcb98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    accent: "#7BC8A4",
    tags: ["Chauffeur Driven", "Business Class", "VIP Arrival"],
  },
  {
    brand: "Toyota",
    model: "Land Cruiser",
    category: "Premium SUV",
    seats: "Up to 7",
    image: "https://images.unsplash.com/photo-1623659791251-b4d0881bb9d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    accent: "#22D3EE",
    tags: ["Safari Ready", "All-Terrain", "Highland Routes"],
  },
  {
    brand: "Toyota",
    model: "Alphard",
    category: "Luxury MPV",
    seats: "Up to 7",
    image: "https://images.unsplash.com/photo-1619221496652-7ee3d7406203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    accent: "#F4B942",
    tags: ["Captain Seats", "Privacy Glass", "Family & Groups"],
  },
];

// ─── Pax dot visualiser ────────────────────────────────────────────────────────
function PaxDots({ count, accent }: { count: number; accent: string }) {
  const maxDots = 8;
  const filled = Math.min(count, maxDots);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxDots }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: i < filled ? accent : "rgba(255,255,255,0.12)" }}
        />
      ))}
      {count > maxDots && (
        <span style={{ fontSize: 9, color: accent, marginLeft: 4, letterSpacing: "0.05em" }}>
          +{count - maxDots}
        </span>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function TravelClient({ travelComfortHeroImage, fleetImages }: { travelComfortHeroImage?: string; fleetImages?: string[] }) {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #07120E 0%, #030A06 100%)" }}
    >
      <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" solid />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={travelComfortHeroImage || "https://images.unsplash.com/photo-1432462770865-65b70566d673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"}
            alt="Travel in Comfort"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(7,18,14,0.95) 0%, rgba(7,18,14,0.72) 55%, rgba(7,18,14,0.4) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 50%, rgba(7,18,14,1) 100%)" }}
          />
        </div>

        <div
          className="relative z-10 mx-auto px-6"
          style={{ maxWidth: 1320, paddingTop: 200, paddingBottom: 120 }}
        >
          {/* breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-10"
            style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)" }}
          >
            <span>HOME</span>
            <span style={{ color: "#F4B942" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>TRAVEL IN COMFORT</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mb-7"
          >
            <div className="h-px w-10" style={{ background: "#F4B942" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.4em", color: "#F4B942" }}>
              GROUND TRANSPORTATION · SRI LANKA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(42px, 7vw, 88px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              color: "white",
              maxWidth: 700,
            }}
          >
            Travel in<br />
            <span
              style={{
                background: "linear-gradient(90deg, #F4B942 0%, #7BC8A4 55%, #22D3EE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Complete Comfort
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-7 mb-10"
            style={{
              fontSize: "clamp(15px, 1.7vw, 18px)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.8,
              maxWidth: 560,
            }}
          >
            Reliable transportation is an essential part of every journey. Our carefully selected
            vehicles and experienced drivers ensure a comfortable travel experience from arrival
            to departure.
          </motion.p>

          {/* amenity chips */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-3"
          >
            {["Comfortable Seating", "Air-Conditioned", "Ample Luggage Space"].map((chip) => (
              <span
                key={chip}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(244,185,66,0.1)",
                  border: "1px solid rgba(244,185,66,0.28)",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                <CheckCircle size={12} color="#F4B942" />
                {chip}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Every Journey Includes ── */}
      <section className="py-28">
        <div className="mx-auto px-6" style={{ maxWidth: 1320 }}>
          {/* header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8" style={{ background: "#F4B942" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.28em", color: "#F4B942" }}>
              EVERY JOURNEY INCLUDES
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-16 items-end">
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(30px, 4vw, 52px)",
                color: "white",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              What's included as<br />standard — always.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 460 }}>
              From the moment we collect you to the moment we drop you off, every detail
              of your ground experience is handled with care.
            </p>
          </div>

          {/* 7 feature cards: 3 + 3 + 1 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative p-7 rounded-[24px] overflow-hidden ${
                  i === 6 ? "lg:col-span-1" : ""
                }`}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(350px at 0% 0%, ${f.accent}09 0%, transparent 70%)`,
                  }}
                />
                {/* bottom accent on hover */}
                <div
                  className="absolute bottom-0 left-7 right-7 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.accent}50, transparent)` }}
                />

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${f.accent}14`, border: `1px solid ${f.accent}30` }}
                >
                  <f.Icon size={20} color={f.accent} />
                </div>

                <span
                  className="absolute top-6 right-6"
                  style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.1)" }}
                >
                  0{i + 1}
                </span>

                <h3
                  className="mb-3 text-white"
                  style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, lineHeight: 1.25, letterSpacing: "-0.01em" }}
                >
                  {f.label}
                </h3>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.72 }}>
                  {f.body}
                </p>
              </motion.div>
            ))}

            {/* 7th card fills last slot — make it a CTA card on large screens */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative p-7 rounded-[24px] overflow-hidden flex flex-col justify-between cursor-pointer group"
              style={{
                background: "linear-gradient(135deg, rgba(244,185,66,0.1) 0%, rgba(34,211,238,0.07) 100%)",
                border: "1px solid rgba(244,185,66,0.22)",
              }}
              onClick={() => navigate("/plan-trip")}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "rgba(244,185,66,0.04)" }}
              />
              <div>
                <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "#F4B942", marginBottom: 12 }}>
                  READY TO TRAVEL?
                </p>
                <h3
                  className="text-white mb-3"
                  style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 22, lineHeight: 1.2 }}
                >
                  Plan your journey with us
                </h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                  Tell us your travel dates and we'll match you with the perfect vehicle.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2" style={{ color: "#F4B942", fontSize: 12, letterSpacing: "0.1em" }}>
                GET IN TOUCH
                <ArrowUpRight size={14} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Fleet Categories ── */}
      <section
        className="py-28 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="mx-auto px-6" style={{ maxWidth: 1320 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8" style={{ background: "#F4B942" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.28em", color: "#F4B942" }}>
              OUR FLEET
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-14 items-end">
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(30px, 4vw, 52px)",
                color: "white",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              The right vehicle<br />for every group.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 440 }}>
              From solo travellers to large tour groups — we have the vehicle that fits your party perfectly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FLEET_CATS.map((cat, i) => (
              <motion.div
                key={cat.type}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-[24px] overflow-hidden flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* top colour bar */}
                <div className="h-1 w-full" style={{ background: cat.accent }} />

                <div className="p-6 flex flex-col flex-1">
                  {/* pax badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="px-3 py-1 rounded-full"
                      style={{
                        background: `${cat.accent}18`,
                        border: `1px solid ${cat.accent}35`,
                        color: cat.accent,
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        fontFamily: "'Clash Display', sans-serif",
                      }}
                    >
                      {cat.pax}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${cat.accent}12`, border: `1px solid ${cat.accent}25` }}
                    >
                      <Users size={16} color={cat.accent} />
                    </div>
                  </div>

                  {/* pax dots */}
                  <div className="mb-5">
                    <PaxDots count={cat.paxNum} accent={cat.accent} />
                  </div>

                  <h3
                    className="mb-2 text-white"
                    style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 20, letterSpacing: "-0.01em" }}
                  >
                    {cat.type}
                  </h3>
                  <p
                    className="mb-6 flex-1"
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}
                  >
                    {cat.desc}
                  </p>

                  {/* features */}
                  <div className="space-y-2">
                    {cat.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2">
                        <ChevronRight size={11} color={cat.accent} />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Luxury Fleet ── */}
      <section
        className="py-28 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="mx-auto px-6" style={{ maxWidth: 1320 }}>
          {/* header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8" style={{ background: "#F4B942" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.28em", color: "#F4B942" }}>
              PREMIUM SELECTION
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-14 items-end">
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(30px, 4vw, 52px)",
                color: "white",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              Our luxury<br />fleet.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 440 }}>
              For travellers who want the finest — our premium fleet combines prestige engineering
              with exceptional in-cabin comfort.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {LUXURY_FLEET.map((vehicle, i) => (
              <motion.div
                key={`${vehicle.brand}-${vehicle.model}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-[28px] overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 0 0 0 transparent",
                }}
              >
                {/* image */}
                <div className="relative h-60 overflow-hidden">
                  <ImageWithFallback
                    src={fleetImages?.[i] || vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(7,18,14,0.85) 100%)",
                    }}
                  />
                  {/* brand badge */}
                  <div className="absolute top-5 left-5">
                    <span
                      className="px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(7,18,14,0.8)",
                        border: `1px solid ${vehicle.accent}40`,
                        color: vehicle.accent,
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        fontFamily: "'Clash Display', sans-serif",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      LUXURY FLEET
                    </span>
                  </div>
                  {/* seats badge */}
                  <div className="absolute top-5 right-5">
                    <span
                      className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
                      style={{
                        background: "rgba(7,18,14,0.8)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: 10,
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <Users size={10} />
                      {vehicle.seats}
                    </span>
                  </div>
                </div>

                {/* content */}
                <div
                  className="p-6"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p
                        style={{ fontSize: 10, letterSpacing: "0.2em", color: vehicle.accent, marginBottom: 4 }}
                      >
                        {vehicle.brand.toUpperCase()}
                      </p>
                      <h3
                        className="text-white"
                        style={{
                          fontFamily: "'Clash Display', sans-serif",
                          fontSize: 26,
                          lineHeight: 1,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {vehicle.model}
                      </h3>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3, letterSpacing: "0.06em" }}>
                        {vehicle.category}
                      </p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ background: `${vehicle.accent}14`, border: `1px solid ${vehicle.accent}30` }}
                    >
                      <Car size={16} color={vehicle.accent} />
                    </div>
                  </div>

                  {/* tags */}
                  <div className="flex flex-wrap gap-2">
                    {vehicle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.55)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="mx-auto px-6" style={{ maxWidth: 1320 }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[40px] p-14 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-10"
            style={{
              background: "linear-gradient(135deg, rgba(244,185,66,0.1) 0%, rgba(7,18,14,0.5) 50%, rgba(34,211,238,0.07) 100%)",
              border: "1px solid rgba(244,185,66,0.18)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-[500px] h-[300px] pointer-events-none opacity-20"
              style={{ background: "radial-gradient(ellipse, #F4B942 0%, transparent 70%)", filter: "blur(60px)" }}
            />
            <div className="relative z-10">
              <p style={{ fontSize: 10, letterSpacing: "0.28em", color: "#F4B942", marginBottom: 12 }}>
                READY TO TRAVEL IN COMFORT?
              </p>
              <h2
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(28px, 4vw, 52px)",
                  color: "white",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                }}
              >
                Let us take care<br />of the road.
              </h2>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/plan-trip")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white"
                style={{
                  background: "linear-gradient(135deg, #F4B942 0%, #22D3EE 100%)",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  fontFamily: "'Clash Display', sans-serif",
                }}
              >
                PLAN MY JOURNEY
                <ArrowUpRight size={15} />
              </motion.button>
              <button
                onClick={() => navigate("/journeys")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border text-white hover:bg-white/[0.05] transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.2)", fontSize: 12, letterSpacing: "0.06em" }}
              >
                Browse Journeys
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
