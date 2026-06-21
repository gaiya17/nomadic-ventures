"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// tourTag must match the tag values in tours data — used as URL param
const CATEGORIES = [
  {
    name: "Cultural & Heritage",
    tourTag: "Heritage",
    sub: "Sigiriya · Kandy",
    image:
      "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1200",
    tags: ["Sigiriya", "Temple of Tooth", "Anuradhapura"],
  },
  {
    name: "Hill Country Escapes",
    tourTag: "Scenic",
    sub: "Ella · Nuwara Eliya",
    image:
      "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1200",
    tags: ["Tea Trails", "Nine Arch", "Little Adam's Peak"],
  },
  {
    name: "Wildlife Safaris",
    tourTag: "Safari",
    sub: "Yala · Udawalawe",
    image:
      "https://images.unsplash.com/photo-1728455470905-156f4278056a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1200",
    tags: ["Leopards", "Elephants", "Bird Sanctuaries"],
  },
  {
    name: "Beach Getaways",
    tourTag: "Beaches",
    sub: "Mirissa · Bentota",
    image:
      "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1200",
    tags: ["Mirissa", "Coconut Hill", "Whale Watching"],
  },
  {
    name: "Luxury Honeymoons",
    tourTag: "Honeymoon",
    sub: "Private Villas",
    image:
      "https://images.unsplash.com/photo-1526786220381-1d21eedf92bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1200",
    tags: ["Boutique Stays", "Spa", "Sunset Dining"],
  },
  {
    name: "Adventure Tours",
    tourTag: "Adventure",
    sub: "Trails & Waterfalls",
    image:
      "https://images.unsplash.com/photo-1609681980718-340e7f4b11d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1200",
    tags: ["Hiking", "Surfing", "Rafting"],
  },
];

export function SriLankaExperiences() {
  const [active, setActive] = useState(0);
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  return (
    <section
      className="relative w-full py-32 px-6 lg:px-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #07120E 0%, #0A1A14 50%, #07120E 100%)",
      }}
    >
      {/* Subtle map texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(244,185,66,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(11,141,107,0.5) 0%, transparent 50%)",
        }}
      />

      {/* HEADER */}
      <div className="relative max-w-[720px] mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="mb-5"
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 14,
              letterSpacing: "0.35em",
              color: "#F4B942",
            }}
          >
            ✦ EXPLORE SRI LANKA
          </div>
          <h2
            className="text-white mb-5"
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(36px, 4.5vw, 60px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Experiences crafted for
            <br />
            <span
              style={{
                background:
                  "linear-gradient(120deg, #F4B942 0%, #ffffff 60%, #F4B942 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              every traveler
            </span>
          </h2>
          <p
            className="text-white/65 max-w-[600px] mx-auto"
            style={{ fontSize: 16, lineHeight: 1.6 }}
          >
            From ancient kingdoms and misty mountains to pristine beaches and
            wildlife adventures, discover Sri Lanka through carefully curated
            journeys.
          </p>
        </motion.div>
      </div>

      {/* CAPSULE GALLERY */}
      <div className="relative max-w-[1400px] mx-auto">
        <div className="flex gap-4 justify-center flex-wrap lg:flex-nowrap">
          {CATEGORIES.map((cat, i) => {
            const isActive = active === i;
            return (
              <motion.div
                key={cat.name}
                layout
                onMouseEnter={() => setActive(i)}
                onClick={() => navigate(`/gallery?category=${cat.tourTag}`)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.08,
                  layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                }}
                className="relative overflow-hidden cursor-pointer flex-shrink-0 border"
                style={{
                  width: isActive ? 360 : 140,
                  height: 500,
                  borderRadius: 160,
                  borderColor: isActive
                    ? "rgba(244,185,66,0.4)"
                    : "rgba(255,255,255,0.1)",
                  boxShadow: isActive
                    ? "0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(244,185,66,0.2)"
                    : "0 20px 50px rgba(0,0,0,0.4)",
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: isActive ? 1.05 : 1.2 }}
                  transition={{ duration: 0.8 }}
                >
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div
                  className="absolute inset-0"
                  style={{
                    background: isActive
                      ? "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)"
                      : "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)",
                  }}
                />

                {/* INDEX */}
                <div
                  className="absolute top-8 left-1/2 -translate-x-1/2 text-white/70"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 12,
                    letterSpacing: "0.2em",
                  }}
                >
                  0{i + 1}
                </div>

                {/* CONTENT */}
                <div className="absolute inset-x-0 bottom-0 p-8 text-center">
                  {!isActive && (
                    <div
                      className="text-white"
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 18,
                        writingMode: "vertical-rl" as const,
                        transform: "rotate(180deg)",
                        margin: "0 auto",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {cat.name}
                    </div>
                  )}

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <div
                        className="text-white/70 mb-2"
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.25em",
                        }}
                      >
                        {cat.sub.toUpperCase()}
                      </div>
                      <div
                        className="text-white mb-5"
                        style={{
                          fontFamily: "'Clash Display', sans-serif",
                          fontSize: 28,
                          lineHeight: 1.1,
                        }}
                      >
                        {cat.name}
                      </div>

                      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                        {cat.tags.map((tag, ti) => (
                          <motion.span
                            key={tag}
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                              duration: 3 + ti * 0.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="px-2.5 py-1 rounded-full text-white/85 border"
                            style={{
                              background: "rgba(255,255,255,0.1)",
                              borderColor: "rgba(255,255,255,0.18)",
                              backdropFilter: "blur(10px)",
                              fontSize: 10,
                              letterSpacing: "0.05em",
                            }}
                          >
                            <MapPin className="w-2.5 h-2.5 inline -mt-0.5 mr-1" />
                            {tag}
                          </motion.span>
                        ))}
                      </div>

                      <button
                        onClick={() => navigate(`/journeys?category=${CATEGORIES[active].tourTag}`)}
                        className="inline-flex items-center gap-1.5 text-white px-4 py-2 rounded-full border"
                        style={{
                          background: "rgba(244,185,66,0.15)",
                          borderColor: "rgba(244,185,66,0.4)",
                          backdropFilter: "blur(10px)",
                          fontSize: 12,
                          letterSpacing: "0.05em",
                        }}
                      >
                        Explore <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
