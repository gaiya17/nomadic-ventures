"use client";
import { motion } from "motion/react";
import { Star, Quote, BadgeCheck, ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const FEATURED = {
  quote:
    "The team at Normadic Ventures crafted a private Sri Lanka journey beyond anything we imagined — from the Sigiriya sunrise to a lantern-lit dinner in Galle. Every guide, every transfer, every stay felt designed for us alone.",
  name: "Arjun Duggal",
  trip: "Essence of Sri Lanka · 7 Days",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&q=80",
  source: "Google Review",
};

const REVIEWS = [
  {
    name: "Borja Alvarez",
    quote:
      "Samanti, our guide, treated us like family. Every detail of the trip was thoughtful, warm and impossibly smooth.",
    trip: "Cultural Triangle",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&q=80",
    source: "Google",
  },
  {
    name: "Albina Kunz",
    quote:
      "My father visited Sri Lanka for the first time and was speechless. Hospitality, drivers, safaris — everything world-class.",
    trip: "Wildlife Discovery",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&q=80",
    source: "Google",
  },
  {
    name: "Kunz Rafael",
    quote:
      "Super, super. Danke, danke. The honeymoon of our dreams — Maldives via Bentota and we never wanted it to end.",
    trip: "Maldives + Sri Lanka",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=face&q=80",
    source: "TripAdvisor",
  },
  {
    name: "Maya Chen",
    quote:
      "Tea trails, train rides, and overwater villas in two perfectly stitched weeks. We barely lifted a finger.",
    trip: "Ultimate Sri Lanka + Maldives",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&q=80",
    source: "Google",
  },
];

interface TestimonialProps {
  featuredReview?: { quote: string; name: string; trip: string | null; avatar: string | null; source: string; rating: number } | null;
  standardReviews?: { id?: string; quote: string; name: string; trip: string | null; avatar: string | null; source: string; rating: number }[];
}

export function Testimonials({
  featuredReview,
  standardReviews,
}: TestimonialProps) {
  const displayFeatured = featuredReview || FEATURED;
  const displayReviews = standardReviews?.length ? standardReviews : REVIEWS;
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
            "radial-gradient(ellipse at 20% 30%, rgba(244,185,66,0.08) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(11,141,107,0.1) 0%, transparent 55%)",
        }}
      />

      <div className="relative max-w-[1320px] mx-auto">
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
                  TESTIMONIALS
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
                What our travelers
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(120deg, #F4B942 0%, #ffffff 60%, #F4B942 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  truly remember.
                </span>
              </h2>
            </div>

            <div className="flex items-end gap-10">
              <p
                className="text-white/65 max-w-[320px]"
                style={{ fontSize: 14, lineHeight: 1.65 }}
              >
                Real letters from 2,500+ travelers who let us design their
                Sri Lanka and Maldives journeys.
              </p>
              <motion.button
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 text-white border-b border-white/30 pb-1 whitespace-nowrap"
                style={{ fontSize: 13, letterSpacing: "0.1em" }}
              >
                WRITE A REVIEW <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — Trust card + Featured pull quote */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Trust aggregate */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-[28px] border p-7 flex items-center justify-between gap-6"
              style={{
                background:
                  "linear-gradient(120deg, rgba(244,185,66,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                borderColor: "rgba(244,185,66,0.22)",
                backdropFilter: "blur(14px)",
              }}
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current"
                      style={{ color: "#F4B942" }}
                    />
                  ))}
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 44,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    4.95
                  </span>
                  <span
                    className="text-white/55"
                    style={{ fontSize: 14 }}
                  >
                    / 5.0
                  </span>
                </div>
                <div
                  className="text-white/65 mt-2"
                  style={{ fontSize: 12, letterSpacing: "0.05em" }}
                >
                  2,500+ verified traveler reviews
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(11,141,107,0.18)",
                    border: "1px solid rgba(11,141,107,0.4)",
                  }}
                >
                  <BadgeCheck
                    className="w-3.5 h-3.5"
                    style={{ color: "#0B8D6B" }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      color: "#7EE0BD",
                    }}
                  >
                    VERIFIED · TRUSTINDEX
                  </span>
                </div>
                <div
                  className="text-white/50 text-right"
                  style={{ fontSize: 10, letterSpacing: "0.18em" }}
                >
                  GOOGLE · TRIPADVISOR
                  <br />
                  TRUSTPILOT
                </div>
              </div>
            </motion.div>

            {/* Featured pull quote */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex-1 rounded-[28px] border p-9 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(244,185,66,0.06) 0%, rgba(7,18,14,0.4) 100%)",
                borderColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(14px)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
              }}
            >
              <Quote
                className="absolute top-6 right-7 w-16 h-16 opacity-15"
                style={{ color: "#F4B942" }}
                strokeWidth={1}
              />

              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-current"
                    style={{ color: "#F4B942" }}
                  />
                ))}
              </div>

              <p
                className="text-white relative z-10"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(22px, 2.5vw, 28px)",
                  lineHeight: 1.4,
                  letterSpacing: "-0.01em",
                }}
              >
                "{displayFeatured.quote}"
              </p>

              <div
                className="w-12 h-px my-8 opacity-20"
                style={{ background: "#F4B942" }}
              />

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={displayFeatured.avatar || ""}
                    alt={displayFeatured.name}
                    className="w-14 h-14 rounded-full object-cover"
                    style={{ border: "2px solid rgba(244,185,66,0.2)" }}
                  />
                  <div>
                    <div
                      className="text-white font-medium"
                      style={{ fontSize: 16, letterSpacing: "0.02em" }}
                    >
                      {displayFeatured.name}
                    </div>
                    <div
                      className="text-white/40"
                      style={{ fontSize: 12, letterSpacing: "0.05em" }}
                    >
                      {displayFeatured.trip}
                    </div>
                  </div>
                </div>
                <div
                  className="px-4 py-1.5 rounded-full"
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    color: "#F4B942",
                  }}
                >
                  {displayFeatured.source.toUpperCase()} REVIEW
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Review grid */}
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-6 mt-6 lg:mt-0">
            {displayReviews.slice(0, 4).map((review, idx) => (
              <motion.div
                key={review.id || idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="rounded-[24px] border p-7 flex flex-col group cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(14px)",
                  minHeight: 280,
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className="w-3.5 h-3.5 fill-current"
                        style={{ color: "#F4B942" }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-white/40"
                    style={{ fontSize: 10, letterSpacing: "0.15em" }}
                  >
                    {review.source.toUpperCase()}
                  </span>
                </div>

                <p
                  className="text-white/85 flex-1 mb-6"
                  style={{ fontSize: 14, lineHeight: 1.65 }}
                >
                  "{review.quote}"
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-white/8">
                  <div className="relative">
                    <ImageWithFallback
                      src={review.avatar || ""}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "#0B8D6B" }}
                    >
                      <BadgeCheck className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-white"
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 14,
                      }}
                    >
                      {review.name}
                    </div>
                    <div
                      className="text-white/50 truncate"
                      style={{ fontSize: 11, letterSpacing: "0.03em" }}
                    >
                      {review.trip}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#F4B942] transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
