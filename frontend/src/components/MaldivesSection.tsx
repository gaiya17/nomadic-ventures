"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Waves,
  Sun,
  Wind,
  Anchor,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const STATS = [
  { value: "20",   label: "Luxury Resorts"   },
  { value: "30+",  label: "Private Atolls"   },
  { value: "5★",   label: "Avg. Resort Grade" },
];

const HIGHLIGHTS = [
  { Icon: Waves,  text: "Overwater & beach villas"          },
  { Icon: Sun,    text: "Seaplane & speedboat transfers"    },
  { Icon: Wind,   text: "Private sandbank experiences"      },
  { Icon: Anchor, text: "Reef diving & marine adventures"   },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  "https://images.unsplash.com/photo-1698726654908-834d3a5330d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  "https://images.unsplash.com/photo-1557750505-e7b4d1c40410?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
];

export function MaldivesSection() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  return (
    <section
      className="relative w-full overflow-hidden py-32 px-6 lg:px-20"
      style={{
        background:
          "linear-gradient(180deg, #07120E 0%, #020D1A 40%, #031525 70%, #020D1A 100%)",
      }}
    >
      {/* ── Ocean ambient glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, #22D3EE 0%, transparent 65%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[400px] opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, #0EA5E9 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        {/* subtle wave lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="mv-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(34,211,238,0.8)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mv-grid)" />
        </svg>
      </div>

      <div className="relative max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* ── LEFT: editorial copy ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            {/* eyebrow */}
            <div className="flex items-center gap-3 mb-7">
              <div className="h-px w-10" style={{ background: "#22D3EE" }} />
              <span style={{ fontSize: 10, letterSpacing: "0.38em", color: "#22D3EE" }}>
                ALSO DISCOVER
              </span>
            </div>

            {/* headline */}
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(42px, 5.5vw, 72px)",
                lineHeight: 0.96,
                letterSpacing: "-0.025em",
                color: "white",
              }}
            >
              Escape to the<br />
              <span
                style={{
                  background: "linear-gradient(120deg, #22D3EE 0%, #ffffff 55%, #22D3EE 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Maldives.
              </span>
            </h2>

            <p
              className="mb-8"
              style={{
                fontSize: "clamp(14px, 1.6vw, 17px)",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.6)",
                maxWidth: 480,
              }}
            >
              Drift into overwater serenity, glass-clear lagoons, and private
              sandbanks. From intimate boutique islands to world-renowned luxury
              resorts — every stay is handpicked by our Maldives specialists.
            </p>

            {/* highlight list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {HIGHLIGHTS.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(34,211,238,0.1)",
                      border: "1px solid rgba(34,211,238,0.25)",
                    }}
                  >
                    <Icon size={14} color="#22D3EE" />
                  </div>
                  <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)" }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* stats row */}
            <div
              className="flex items-center gap-8 pb-10 mb-10"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 34,
                      color: "#22D3EE",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.14em",
                      marginTop: 5,
                    }}
                  >
                    {s.label.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(34,211,238,0.35)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/maldives-resort")}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl text-white"
                style={{
                  background: "linear-gradient(120deg, #0891B2 0%, #22D3EE 100%)",
                  boxShadow: "0 10px 40px rgba(34,211,238,0.25)",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  fontFamily: "'Clash Display', sans-serif",
                }}
              >
                DISCOVER RESORTS
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/plan-trip")}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl border text-white"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(14px)",
                  fontSize: 13,
                  letterSpacing: "0.06em",
                }}
              >
                Plan a Maldives Trip
              </motion.button>
            </div>
          </motion.div>

          {/* ── RIGHT: Maldives card + mini gallery ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            {/* glow behind card */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 60% at 55% 50%, rgba(34,211,238,0.18) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />

            {/* ── Main clickable card ── */}
            <motion.button
              onClick={() => navigate("/maldives-resort")}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-[36px] overflow-hidden text-left group cursor-pointer flex-shrink-0"
              style={{
                width: 360,
                height: 520,
                border: "1px solid rgba(34,211,238,0.25)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(34,211,238,0.15)",
              }}
            >
              {/* main image */}
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=800"
                alt="Maldives overwater villa"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

              {/* cyan hover tint */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(180deg, rgba(34,211,238,0.07) 0%, transparent 50%)" }}
              />

              {/* top: label + price */}
              <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                <span
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(34,211,238,0.15)",
                    border: "1px solid rgba(34,211,238,0.4)",
                    color: "#22D3EE",
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    fontFamily: "'Clash Display', sans-serif",
                  }}
                >
                  NEXT DESTINATION
                </span>
                <span
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(34,211,238,0.18)",
                    border: "1px solid rgba(34,211,238,0.35)",
                    color: "#22D3EE",
                    fontSize: 11,
                    letterSpacing: "0.05em",
                  }}
                >
                  From $899
                </span>
              </div>

              {/* mini gallery strip — 3 thumb images */}
              <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 flex gap-2">
                {GALLERY.map((src, i) => (
                  <div
                    key={i}
                    className="flex-1 h-16 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <ImageWithFallback
                      src={src}
                      alt="Maldives"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* bottom: destination info */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p
                  className="mb-1"
                  style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(255,255,255,0.5)" }}
                >
                  CRYSTAL LAGOON ESCAPES
                </p>
                <h3
                  className="text-white mb-1"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 46,
                    lineHeight: 1,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Maldives
                </h3>
                <p className="mb-5" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                  20 Luxury Resorts
                </p>

                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <span
                    className="group-hover:tracking-widest transition-all duration-300"
                    style={{ fontSize: 11, color: "#22D3EE", letterSpacing: "0.14em" }}
                  >
                    DISCOVER RESORTS
                  </span>
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(34,211,238,0.18)",
                      border: "1px solid rgba(34,211,238,0.4)",
                    }}
                    whileHover={{ rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowUpRight size={16} color="#22D3EE" />
                  </motion.div>
                </div>
              </div>
            </motion.button>

            {/* floating resort count chip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="absolute right-0 top-1/3 px-5 py-3 rounded-2xl"
              style={{
                background: "rgba(2,13,26,0.9)",
                border: "1px solid rgba(34,211,238,0.25)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 28,
                  color: "#22D3EE",
                  lineHeight: 1,
                }}
              >
                20
              </p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", marginTop: 3 }}>
                LUXURY RESORTS
              </p>
            </motion.div>

            {/* floating "Seaplane Access" badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="absolute left-0 bottom-28 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
              style={{
                background: "rgba(2,13,26,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)" }}
              >
                <Wind size={12} color="#22D3EE" />
              </div>
              <div>
                <p style={{ fontSize: 12, color: "white", lineHeight: 1 }}>Seaplane Access</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
                  Direct to your resort
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
