"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { slugify } from "@/data/tours";

const PACKAGES = [
  {
    name: "Essence of Sri Lanka",
    duration: "7 Days",
    places: "Colombo · Sigiriya · Kandy · Ella",
    price: "699",
    image:
      "https://images.unsplash.com/photo-1713101335374-59ab9bb1fd54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1600",
    tag: "Bestseller",
  },
  {
    name: "Southern Coast Escape",
    duration: "5 Days",
    places: "Galle · Mirissa · Bentota",
    price: "499",
    image:
      "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1600",
    tag: "Beaches",
  },
  {
    name: "Wildlife Discovery",
    duration: "6 Days",
    places: "Yala · Udawalawe",
    price: "599",
    image:
      "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1600",
    tag: "Safari",
  },
  {
    name: "Hill Country Tea Trails",
    duration: "4 Days",
    places: "Nuwara Eliya · Ella",
    price: "449",
    image:
      "https://images.unsplash.com/photo-1578519050142-afb511e518de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1600",
    tag: "Scenic",
  },
  {
    name: "Cultural Triangle",
    duration: "5 Days",
    places: "Sigiriya · Polonnaruwa · Kandy",
    price: "549",
    image:
      "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1600",
    tag: "Heritage",
  },
  {
    name: "Ultimate Sri Lanka",
    duration: "10 Days",
    places: "Island Wide Experience",
    price: "999",
    image:
      "https://images.unsplash.com/photo-1609681980718-340e7f4b11d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1600",
    tag: "Signature",
  },
];

export function SriLankaPackages() {
  const [hovered, setHovered] = useState<number | null>(null);

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
              <motion.button
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 text-white border-b border-white/30 pb-1 whitespace-nowrap"
                style={{ fontSize: 13, letterSpacing: "0.1em" }}
              >
                VIEW ALL <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* CLEAN 3-COL EDITORIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-14">
          {PACKAGES.map((pkg, i) => (
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
              <Link href={`/tours/sri-lanka/${slugify(pkg.name)}`} className="block">
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
                    {pkg.tag.toUpperCase()}
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

                {/* Duration */}
                <div className="absolute bottom-5 left-5 flex items-center gap-3 text-white/90">
                  <Clock className="w-3.5 h-3.5" />
                  <span
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {pkg.duration.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* META */}
              <div className="px-1">
                <div
                  className="flex items-center gap-1.5 text-white/55 mb-3"
                  style={{ fontSize: 12, letterSpacing: "0.05em" }}
                >
                  <MapPin className="w-3 h-3" />
                  {pkg.places}
                </div>
                <h3
                  className="text-white mb-4"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 24,
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {pkg.name}
                </h3>
                <div className="flex items-baseline justify-between pt-4 border-t border-white/10">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-white/55"
                      style={{ fontSize: 12, letterSpacing: "0.05em" }}
                    >
                      From
                    </span>
                    <span
                      className="text-white"
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 22,
                      }}
                    >
                      ${pkg.price}
                    </span>
                    <span
                      className="text-white/50"
                      style={{ fontSize: 12 }}
                    >
                      /person
                    </span>
                  </div>
                  <span
                    className="text-white group-hover:text-[#F4B942] transition-colors"
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.15em",
                    }}
                  >
                    EXPLORE →
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
