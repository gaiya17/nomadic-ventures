"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";

export function SriLankaExperiences({ categories }: { categories?: any[] }) {
  const [active, setActive] = useState(0);
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const displayCategories = categories && categories.length > 0 ? categories : [];
  if (displayCategories.length === 0) return null;

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
        <div className="flex gap-4 justify-center items-center flex-wrap lg:flex-nowrap">
          {displayCategories.map((cat, i) => {
            const isActive = active === i;
            return (
              <motion.div
                key={cat.name}
                onMouseEnter={() => setActive(i)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  opacity: { duration: 0.6, delay: i * 0.1 },
                  y: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
                }}
                className="relative overflow-hidden cursor-pointer group"
                style={{
                  height: isActive ? 640 : 580,
                  width: isActive ? 480 : 150,
                  borderRadius: 999,
                  border: isActive
                    ? "1px solid rgba(244,185,66,0.3)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: "#111",
                }}
              >
                <Link href={`/journeys?category=${cat.tourTag}`} className="absolute inset-0 z-0" />
                {/* Background Image */}
                <motion.div
                  className="absolute inset-0 origin-center"
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isActive
                        ? "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)"
                        : "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.95) 100%)",
                    }}
                  />
                </motion.div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                  {/* Number indicator */}
                  <motion.div
                    animate={{ y: isActive ? 0 : 20 }}
                    className="absolute top-10 text-white/50"
                    style={{ fontSize: 13, letterSpacing: "0.2em" }}
                  >
                    0{i + 1}
                  </motion.div>

                  {/* Title (Vertical when inactive, horizontal when active) */}
                  <div
                    className="w-full"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      position: isActive ? "relative" : "static",
                      zIndex: 10,
                    }}
                  >
                    {!isActive ? (
                      <div
                        key="inactive-text"
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-white group-hover:text-[#F4B942]"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          fontFamily: "'Clash Display', sans-serif",
                          fontSize: 24,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {cat.name}
                      </div>
                    ) : (
                      <motion.div
                        key="active-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="w-full"
                      >
                        <div
                          className="flex items-center justify-center gap-2 mb-3 text-white/70"
                          style={{
                            fontSize: 11,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                          }}
                        >
                          <MapPin size={12} className="text-[#F4B942]" />
                          {cat.sub}
                        </div>

                        <h3
                          className="text-white mb-6"
                          style={{
                            fontFamily: "'Clash Display', sans-serif",
                            fontSize: "clamp(28px, 3vw, 36px)",
                            lineHeight: 1.1,
                          }}
                        >
                          {cat.name}
                        </h3>

                        {/* Little feature tags */}
                        {cat.tags && cat.tags.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {cat.tags.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 rounded-full border border-white/20 text-white/80"
                                style={{
                                  fontSize: 12,
                                  background: "rgba(255,255,255,0.05)",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                {idx === 0 && <MapPin size={10} className="inline mr-1" />}
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link href={`/journeys?category=${cat.tourTag}`} className="relative z-20">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#F4B942]/50 text-white transition-all hover:bg-[#F4B942]/10"
                            style={{
                              fontSize: 13,
                              letterSpacing: "0.1em",
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            Explore <ArrowUpRight className="w-4 h-4" />
                          </motion.button>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
