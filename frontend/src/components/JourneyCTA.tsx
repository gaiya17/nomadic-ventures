"use client";
import { motion } from "motion/react";
import { ArrowUpRight, Calendar, Users, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function JourneyCTA() {
  return (
    <section
      className="relative w-full py-32 px-6 lg:px-20"
      style={{
        background:
          "linear-gradient(180deg, #07120E 0%, #061827 60%, #021830 100%)",
      }}
    >
      <div className="max-w-[1320px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[40px] overflow-hidden border"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            boxShadow:
              "0 40px 120px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1746131272871-6058227a3f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=2000"
              alt="Tropical paradise"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(7,18,14,0.92) 0%, rgba(7,18,14,0.7) 40%, rgba(2,24,48,0.55) 100%)",
              }}
            />
          </div>

          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 90% 50%, rgba(137,243,255,0.18) 0%, transparent 55%), radial-gradient(ellipse at 5% 0%, rgba(244,185,66,0.12) 0%, transparent 50%)",
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 p-10 lg:p-20 items-center">
            {/* LEFT — copy */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="h-px w-8"
                    style={{ background: "#F4B942" }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.35em",
                      color: "#F4B942",
                    }}
                  >
                    PLAN YOUR JOURNEY
                  </span>
                </div>

                <h2
                  className="text-white mb-6"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 500,
                    fontSize: "clamp(36px, 4.5vw, 64px)",
                    lineHeight: 1,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Your private travel
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(120deg, #F4B942 0%, #ffffff 50%, #89F3FF 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    designer awaits.
                  </span>
                </h2>

                <p
                  className="text-white/70 mb-10 max-w-[520px]"
                  style={{ fontSize: 16, lineHeight: 1.65 }}
                >
                  Share your dates and dream — we'll craft a fully bespoke
                  itinerary across Sri Lanka and the Maldives within 24 hours,
                  obligation free.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(244,185,66,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(120deg, #F4B942 0%, #ffd06b 100%)",
                      color: "#1a1308",
                      fontSize: 13,
                      letterSpacing: "0.1em",
                      boxShadow: "0 15px 50px rgba(244,185,66,0.3)",
                    }}
                  >
                    START PLANNING
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl border text-white"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.22)",
                      backdropFilter: "blur(14px)",
                      fontSize: 13,
                      letterSpacing: "0.1em",
                    }}
                  >
                    TALK TO AN EXPERT
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* RIGHT — floating glass info card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="lg:col-span-5"
            >
              <div
                className="rounded-[28px] border p-7"
                style={{
                  background: "rgba(7,18,14,0.55)",
                  borderColor: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: "#F4B942" }}
                  />
                  <span
                    className="text-white"
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.2em",
                    }}
                  >
                    COMPLIMENTARY ITINERARY
                  </span>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      icon: Calendar,
                      label: "WHEN",
                      value: "Flexible — peak or off-season",
                    },
                    {
                      icon: Users,
                      label: "WHO",
                      value: "1–24 travelers, all ages",
                    },
                    {
                      icon: Sparkles,
                      label: "STYLE",
                      value: "Luxury · Cultural · Adventure · Romance",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start gap-4 pb-5 border-b last:border-0 last:pb-0"
                      style={{ borderColor: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(244,185,66,0.12)",
                          border: "1px solid rgba(244,185,66,0.28)",
                          color: "#F4B942",
                        }}
                      >
                        <row.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-white/55 mb-1"
                          style={{ fontSize: 10, letterSpacing: "0.2em" }}
                        >
                          {row.label}
                        </div>
                        <div
                          className="text-white"
                          style={{ fontSize: 14 }}
                        >
                          {row.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-7 pt-5 flex items-center justify-between border-t"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex -space-x-2">
                    {[
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face&q=80",
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&q=80",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&q=80",
                    ].map((src, i) => (
                      <ImageWithFallback
                        key={i}
                        src={src}
                        alt="Travel designer"
                        className="w-9 h-9 rounded-full border-2 object-cover"
                        style={{ borderColor: "#07120E" }}
                      />
                    ))}
                  </div>
                  <div className="text-right">
                    <div
                      className="text-white"
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 14,
                      }}
                    >
                      24 hr response
                    </div>
                    <div
                      className="text-white/50"
                      style={{ fontSize: 11, letterSpacing: "0.05em" }}
                    >
                      from a real human designer
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
