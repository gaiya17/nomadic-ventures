"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Clock,
  Plane,
  Wrench,
  ArrowUpRight,
  Users,
  ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Safe & Vetted Drivers",
    desc: "English-speaking chauffeurs trained for premium hospitality.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    desc: "On-call concierge support across every leg of your journey.",
  },
  {
    icon: Plane,
    title: "Airport Transfers",
    desc: "Seamless meet-and-greet from arrival to your villa.",
  },
  {
    icon: Wrench,
    title: "Well-Maintained Fleet",
    desc: "Late-model SUVs, sedans, and group coaches — spotless every trip.",
  },
];

const CLASS_OPTIONS = [
  { id: "sedan", label: "Premium Sedan", pax: "1-3 Guests" },
  { id: "suv", label: "Luxury SUV", pax: "1-4 Guests" },
  { id: "van", label: "Executive Van", pax: "5-8 Guests" },
  { id: "coach", label: "Private Coach", pax: "9-24 Guests" },
];

export function TransportService({ transportImage = "https://images.unsplash.com/photo-1549424883-93666b3b05a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800" }: { transportImage?: string }) {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState("sedan");
  const navigate = (path: string) => router.push(path);
  const [selectedFleet, setSelectedFleet] = useState(0);

  return (
    <section
      className="relative w-full py-36 px-6 lg:px-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #07120E 0%, #0a1a14 50%, #07120E 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 30%, rgba(244,185,66,0.08) 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, rgba(11,141,107,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[1320px] mx-auto">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between gap-12 flex-wrap mb-14"
        >
          <div className="max-w-[560px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8" style={{ background: "#F4B942" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.35em", color: "#F4B942" }}>
                TRANSPORT SERVICE
              </span>
            </div>
            <h2
              className="text-white"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 500,
                fontSize: "clamp(36px, 4vw, 54px)",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
              }}
            >
              Comfortable rides,
              <br />
              <span
                style={{
                  background: "linear-gradient(120deg, #F4B942 0%, #ffffff 60%, #F4B942 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                effortless journeys.
              </span>
            </h2>
          </div>

          <p
            className="text-white/60 max-w-[360px]"
            style={{ fontSize: 14, lineHeight: 1.75 }}
          >
            Travel in style and ease with our private fleet — from
            Mercedes-class sedans to spacious coaches, curated for a smooth
            ride anywhere in Sri Lanka.
          </p>
        </motion.div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT: Vehicle image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative rounded-[28px] overflow-hidden border group"
            style={{
              minHeight: 560,
              borderColor: "rgba(255,255,255,0.1)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            }}
          >
            <ImageWithFallback
              src={transportImage}
              alt="Luxury transport"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/30 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-white"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(14px)",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#F4B942" }} />
                NORMADIC FLEET · LIVE
              </div>
              <div
                className="px-4 py-2 rounded-full border"
                style={{
                  background: "rgba(244,185,66,0.18)",
                  borderColor: "rgba(244,185,66,0.45)",
                  backdropFilter: "blur(14px)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "#F4B942",
                }}
              >
                FROM $49 / DAY
              </div>
            </div>

            {/* Bottom stat strip */}
            <div className="absolute bottom-6 left-6 right-6">
              <div
                className="rounded-2xl border p-5"
                style={{
                  background: "rgba(7,18,14,0.6)",
                  borderColor: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { v: "120+",  l: "Vehicles"     },
                    { v: "15K+",  l: "Journeys"     },
                    { v: "4.95★", l: "Rider Rating" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div
                        className="text-white"
                        style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 26, letterSpacing: "-0.01em" }}
                      >
                        {s.v}
                      </div>
                      <div
                        className="text-white/55 mt-0.5"
                        style={{ fontSize: 11, letterSpacing: "0.15em" }}
                      >
                        {s.l.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Features + Fleet selector ── */}
          <div className="lg:col-span-5 flex flex-col gap-3">

            {/* 4 feature rows */}
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="flex items-start gap-4 p-4 rounded-2xl border group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(244,185,66,0.12)",
                    border: "1px solid rgba(244,185,66,0.28)",
                  }}
                >
                  <f.icon size={16} color="#F4B942" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-white mb-0.5"
                    style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 15, letterSpacing: "-0.005em" }}
                  >
                    {f.title}
                  </div>
                  <p className="text-white/50" style={{ fontSize: 12.5, lineHeight: 1.55 }}>
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* ── Fleet selector — directly below Well-Maintained Fleet ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(244,185,66,0.07) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(244,185,66,0.2)",
              }}
            >
              {/* Card header */}
              <div
                className="flex items-center gap-2.5 px-5 py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ background: "rgba(244,185,66,0.18)", border: "1px solid rgba(244,185,66,0.35)" }}
                >
                  <Users size={11} color="#F4B942" />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    color: "#F4B942",
                    fontFamily: "'Clash Display', sans-serif",
                  }}
                >
                  CHOOSE YOUR CLASS
                </span>
              </div>

              {/* Fleet options */}
              <div className="p-3 flex flex-col gap-1.5">
                {FLEET.map((f, i) => {
                  const isSelected = selectedFleet === i;
                  return (
                    <motion.button
                      key={f.class}
                      onClick={() => setSelectedFleet(i)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: isSelected
                          ? "rgba(244,185,66,0.12)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isSelected ? "rgba(244,185,66,0.35)" : "rgba(255,255,255,0.06)"}`,
                      }}
                      whileHover={{ x: isSelected ? 0 : 3 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* radio dot */}
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          border: `1.5px solid ${isSelected ? "#F4B942" : "rgba(255,255,255,0.2)"}`,
                          background: isSelected ? "rgba(244,185,66,0.18)" : "transparent",
                        }}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#F4B942" }}
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <span
                          style={{
                            fontFamily: "'Clash Display', sans-serif",
                            fontSize: 14,
                            color: isSelected ? "white" : "rgba(255,255,255,0.7)",
                          }}
                        >
                          {f.class}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: 11,
                          color: isSelected ? "#F4B942" : "rgba(255,255,255,0.35)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {f.capacity}
                      </span>

                      <ChevronRight
                        size={13}
                        color={isSelected ? "#F4B942" : "rgba(255,255,255,0.2)"}
                      />
                    </motion.button>
                  );
                })}
              </div>

              {/* CTA */}
              <div
                className="px-4 pb-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/plan-trip")}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl"
                  style={{
                    background: "#F4B942",
                    color: "#07120E",
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    fontFamily: "'Clash Display', sans-serif",
                    boxShadow: "0 8px 30px rgba(244,185,66,0.3)",
                  }}
                >
                  <span>BOOK TRANSPORT</span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(7,18,14,0.15)" }}
                  >
                    <ArrowUpRight size={14} color="#07120E" />
                  </div>
                </motion.button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
