"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";

export function SriLankaExperiences({ categories }: { categories?: any[] }) {
  const [active, setActive] = useState(0);
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
  };

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
        {/* Navigation Arrows for Mobile */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between z-30 lg:hidden pointer-events-none">
          <button onClick={scrollLeft} className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-all hover:bg-white/10">
            <ChevronLeft size={24} />
          </button>
          <button onClick={scrollRight} className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-all hover:bg-white/10">
            <ChevronRight size={24} />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 items-center overflow-x-auto snap-x snap-mandatory pb-8 lg:pb-0 lg:overflow-visible lg:snap-none lg:flex-nowrap lg:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
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
                className="relative overflow-hidden cursor-pointer group shrink-0 snap-center w-[85vw] sm:w-[340px] h-[480px] lg:h-[var(--desk-h)] lg:w-[var(--desk-w)] transition-all duration-500 ease-linear"
                style={{
                  '--desk-h': `${isActive ? 640 : 580}px`,
                  '--desk-w': `${isActive ? 480 : 150}px`,
                  borderRadius: 999,
                  border: isActive
                    ? "1px solid rgba(244,185,66,0.4)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: "#111",
                } as any}
              >
                <Link href={`/journeys?category=${cat.tourTag}`} className="absolute inset-0 z-0" />
                {/* Background Image */}
                <motion.div
                  className="absolute inset-0 origin-center"
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.5, ease: "linear" }}
                >
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)"
                    }}
                  />
                </motion.div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                  {/* Number indicator */}
                  <motion.div
                    animate={{ y: isActive ? 0 : 20 }}
                    className="absolute top-10 text-white/50 hidden lg:block"
                    style={{ fontSize: 13, letterSpacing: "0.2em" }}
                  >
                    0{i + 1}
                  </motion.div>

                  <div className="w-full relative z-10 flex flex-col items-center justify-end h-full">
                    {/* Inactive Vertical Text (Desktop only) */}
                    <div
                      className={`absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-white group-hover:text-[#F4B942] hidden lg:block transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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

                    {/* Active Content (Visible on Mobile always, Visible on Desktop when active) */}
                    <div
                      className={`w-full transition-opacity duration-300 ${isActive ? 'relative opacity-100' : 'relative opacity-100 lg:absolute lg:opacity-0 lg:pointer-events-none'}`}
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
                    </div>
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
