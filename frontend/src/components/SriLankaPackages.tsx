"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { slugify } from "@/lib/utils";

export function SriLankaPackages({ tours }: { tours?: any[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Fallback if no tours are found (for development or empty DB)
  const displayTours = tours && tours.length > 0 ? tours : [];

  if (displayTours.length === 0) return null;

  return (
    <section
      className="relative w-full py-36 px-6 lg:px-20"
      style={{ background: "#07120E" }}
    >
      <div className="max-w-[1320px] mx-auto">
        {/* HEADER */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-end justify-between gap-12 flex-wrap"
          >
            <div className="max-w-[640px]">
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
                  POPULAR JOURNEYS
                </span>
              </div>
              <h2
                className="text-white"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 500,
                  fontSize: "clamp(38px, 4vw, 56px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.025em",
                }}
              >
                Handpicked Sri Lanka tours
              </h2>
            </div>

            <div className="flex items-end gap-10">
              <p
                className="text-white/60 max-w-[320px]"
                style={{ fontSize: 14, lineHeight: 1.65 }}
              >
                Carefully designed itineraries combining culture, nature, luxury
                and authentic local experiences.
              </p>
              <Link href="/journeys">
                <motion.button
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-white border-b border-white/30 pb-1 whitespace-nowrap"
                  style={{ fontSize: 13, letterSpacing: "0.1em" }}
                >
                  VIEW ALL <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* CLEAN 3-COL EDITORIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-14">
          {displayTours.map((pkg, i) => (
            <motion.article
              key={pkg.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: (i % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group cursor-pointer"
            >
              <Link href={`/tours/${pkg.slug}`} className="block">
              {/* IMAGE */}
              <div
                className="relative overflow-hidden rounded-[28px] mb-6"
                style={{
                  height: 380,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: hovered === i ? 1.08 : 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ImageWithFallback
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                {/* Top row */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                  <span
                    className="px-3 py-1.5 rounded-full text-white/95 border"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      borderColor: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(12px)",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {pkg.tag ? pkg.tag.toUpperCase() : "FEATURED"}
                  </span>
                  <motion.div
                    animate={{
                      rotate: hovered === i ? 0 : -30,
                      scale: hovered === i ? 1 : 0.85,
                    }}
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{
                      background: "#F4B942",
                      color: "#1a1308",
                    }}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </motion.div>
                </div>

                {/* Quick Info overlays at bottom */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white"
                    style={{
                      background: "rgba(0,0,0,0.35)",
                      backdropFilter: "blur(8px)",
                      fontSize: 11.5,
                    }}
                  >
                    <Clock className="w-3.5 h-3.5" style={{ color: "#F4B942" }} />
                    {pkg.duration}
                  </div>
                  {pkg.places && (
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white max-w-[60%] overflow-hidden"
                      style={{
                        background: "rgba(0,0,0,0.35)",
                        backdropFilter: "blur(8px)",
                        fontSize: 11.5,
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "#F4B942" }} />
                      <span className="truncate">{pkg.places}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* TEXT CONTENT */}
              <div>
                <h3
                  className="text-white mb-2 transition-colors duration-300"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 24,
                    letterSpacing: "-0.01em",
                    color: hovered === i ? "#F4B942" : "white",
                  }}
                >
                  {pkg.name}
                </h3>
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
                  <span
                    style={{
                      fontSize: 17,
                      color: "#F4B942",
                      fontFamily: "'Clash Display', sans-serif",
                    }}
                  >
                    Rate/ On request
                  </span>
                  <span
                    className="text-[#F4B942] flex items-center gap-1 group-hover:gap-2 transition-all"
                    style={{ fontSize: 13, letterSpacing: "0.1em" }}
                  >
                    EXPLORE <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
