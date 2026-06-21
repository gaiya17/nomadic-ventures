"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { slugify } from "@/data/tours";
import {
  ArrowUpRight,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  Compass,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

type Category = {
  id: string;
  num: string;
  name: string;
  shortName: string;
  blurb: string;
  hero: string;
  bestSeason: string;
  idealDays: string;
  fromPrice: string;
  highlights: string[];
  tours: { name: string; days: string; image: string; price: string }[];
};

const CATEGORIES: Category[] = [
  {
    id: "cultural",
    num: "01",
    name: "Cultural & Heritage",
    shortName: "Cultural",
    blurb:
      "Walk through two thousand years of kingdoms, frescoes, and living temples — Sigiriya at dawn, Kandy by lantern light, Polonnaruwa by bicycle.",
    hero: "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    bestSeason: "Jan – Apr",
    idealDays: "5 – 8 Days",
    fromPrice: "$549",
    highlights: [
      "Sigiriya Rock Fortress at sunrise",
      "Temple of the Sacred Tooth, Kandy",
      "Polonnaruwa ruins by private cycle",
      "Private dinner with a local historian",
    ],
    tours: [
      {
        name: "Cultural Triangle",
        days: "5 Days",
        image:
          "https://images.unsplash.com/photo-1562698013-ac13558052cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "549",
      },
      {
        name: "Essence of Sri Lanka",
        days: "7 Days",
        image:
          "https://images.unsplash.com/photo-1713101335374-59ab9bb1fd54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "699",
      },
      {
        name: "Ancient Kingdoms",
        days: "6 Days",
        image:
          "https://images.unsplash.com/photo-1593377685064-720da51f3634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "629",
      },
      {
        name: "Heritage & Spice Trail",
        days: "8 Days",
        image:
          "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "789",
      },
    ],
  },
  {
    id: "hillcountry",
    num: "02",
    name: "Hill Country Escapes",
    shortName: "Hill Country",
    blurb:
      "Cool mountain air, mist-veiled tea estates, and the legendary blue train winding through clouds and waterfalls.",
    hero: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    bestSeason: "Dec – Mar",
    idealDays: "4 – 6 Days",
    fromPrice: "$449",
    highlights: [
      "Ride the Ella – Kandy blue train",
      "Stay in a colonial tea bungalow",
      "Hike Little Adam's Peak at dawn",
      "Private tea-tasting with the estate master",
    ],
    tours: [
      {
        name: "Tea Trails",
        days: "4 Days",
        image:
          "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "449",
      },
      {
        name: "Ella & Nine Arch",
        days: "5 Days",
        image:
          "https://images.unsplash.com/photo-1578519050142-afb511e518de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "499",
      },
      {
        name: "Hill Country Romance",
        days: "6 Days",
        image:
          "https://images.unsplash.com/photo-1609681980718-340e7f4b11d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "579",
      },
      {
        name: "Horton Plains Trek",
        days: "5 Days",
        image:
          "https://images.unsplash.com/photo-1713101335374-59ab9bb1fd54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "529",
      },
    ],
  },
  {
    id: "wildlife",
    num: "03",
    name: "Wildlife & Safari",
    shortName: "Wildlife",
    blurb:
      "Track leopards through Yala, watch herds of elephants gather at sunset, and sleep under a sky raucous with bird-call.",
    hero: "https://images.unsplash.com/photo-1728455470905-156f4278056a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    bestSeason: "Feb – Jul",
    idealDays: "4 – 6 Days",
    fromPrice: "$599",
    highlights: [
      "Private leopard safari in Yala Block 1",
      "Elephant gathering at Minneriya",
      "Tented luxury camp under the stars",
      "Conservationist-led wildlife walks",
    ],
    tours: [
      {
        name: "Wildlife Discovery",
        days: "6 Days",
        image:
          "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "599",
      },
      {
        name: "Leopards of Yala",
        days: "4 Days",
        image:
          "https://images.unsplash.com/photo-1728455470905-156f4278056a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "469",
      },
      {
        name: "Elephant Country",
        days: "5 Days",
        image:
          "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "529",
      },
      {
        name: "Wild Sri Lanka",
        days: "7 Days",
        image:
          "https://images.unsplash.com/photo-1728455470905-156f4278056a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "729",
      },
    ],
  },
  {
    id: "beach",
    num: "04",
    name: "Beach & Coastal",
    shortName: "Beach",
    blurb:
      "From Mirissa's whales to Galle's Dutch ramparts and Bentota's lagoon-side villas — Sri Lanka's southern coast at its most stylish.",
    hero: "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    bestSeason: "Nov – Apr",
    idealDays: "5 – 7 Days",
    fromPrice: "$499",
    highlights: [
      "Blue whale safari from Mirissa",
      "Sunset at Coconut Tree Hill",
      "Stay inside Galle Fort",
      "Private catamaran sail at golden hour",
    ],
    tours: [
      {
        name: "Southern Coast Escape",
        days: "5 Days",
        image:
          "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "499",
      },
      {
        name: "Galle & Mirissa",
        days: "6 Days",
        image:
          "https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "569",
      },
      {
        name: "Bentota Bliss",
        days: "5 Days",
        image:
          "https://images.unsplash.com/photo-1526786220381-1d21eedf92bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "549",
      },
      {
        name: "Coastal Odyssey",
        days: "7 Days",
        image:
          "https://images.unsplash.com/photo-1650970366119-34cb82f8b4c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "649",
      },
    ],
  },
  {
    id: "honeymoon",
    num: "05",
    name: "Luxury Honeymoons",
    shortName: "Honeymoon",
    blurb:
      "Private villas, candlelit jungle dining, couples spa rituals, and a private chauffeur tracing the island for two.",
    hero: "https://images.unsplash.com/photo-1526786220381-1d21eedf92bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    bestSeason: "Year Round",
    idealDays: "7 – 12 Days",
    fromPrice: "$1,199",
    highlights: [
      "Private overwater bungalow on the lagoon",
      "Couples Ayurvedic spa journey",
      "Candlelit dinner on a private sandbank",
      "Hot-air balloon over the Cultural Triangle",
    ],
    tours: [
      {
        name: "Honeymoon in Paradise",
        days: "8 Days",
        image:
          "https://images.unsplash.com/photo-1526786220381-1d21eedf92bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "1199",
      },
      {
        name: "Romance of Ceylon",
        days: "10 Days",
        image:
          "https://images.unsplash.com/photo-1675657144361-98ae33e6b6f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "1499",
      },
      {
        name: "Tea Hills for Two",
        days: "7 Days",
        image:
          "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "1099",
      },
      {
        name: "Ultimate Honeymoon",
        days: "12 Days",
        image:
          "https://images.unsplash.com/photo-1675657144361-98ae33e6b6f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "1899",
      },
    ],
  },
  {
    id: "adventure",
    num: "06",
    name: "Adventure & Trails",
    shortName: "Adventure",
    blurb:
      "Surf Arugam Bay, hike to Adam's Peak before dawn, raft Kelani's rapids, and dive shipwrecks off Hikkaduwa.",
    hero: "https://images.unsplash.com/photo-1609681980718-340e7f4b11d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800",
    bestSeason: "Dec – Apr",
    idealDays: "6 – 9 Days",
    fromPrice: "$649",
    highlights: [
      "Sunrise summit of Adam's Peak",
      "White-water rafting at Kitulgala",
      "Surf coaching at Arugam Bay",
      "Multi-day wilderness trekking",
    ],
    tours: [
      {
        name: "Peaks & Rivers",
        days: "6 Days",
        image:
          "https://images.unsplash.com/photo-1609681980718-340e7f4b11d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "649",
      },
      {
        name: "Adventure Triangle",
        days: "7 Days",
        image:
          "https://images.unsplash.com/photo-1609515286252-3429567a66fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "729",
      },
      {
        name: "Surf & Trek",
        days: "8 Days",
        image:
          "https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "799",
      },
      {
        name: "Ultimate Adventure",
        days: "9 Days",
        image:
          "https://images.unsplash.com/photo-1609681980718-340e7f4b11d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
        price: "899",
      },
    ],
  },
];

export default function Page() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const active = useMemo(
    () => CATEGORIES.find((c) => c.id === activeId)!,
    [activeId]
  );

  return (
    <div className="size-full" style={{ background: "#07120E" }}>
      <Navbar />

      {/* ───────── PAGE HERO ───────── */}
      <section className="relative w-full min-h-[88vh] flex items-end overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={active.hero}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={active.hero}
              alt={active.name}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(7,18,14,0.6) 0%, rgba(7,18,14,0.4) 40%, rgba(7,18,14,0.95) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 70%, rgba(244,185,66,0.15) 0%, transparent 55%)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-20 pt-40 pb-24">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2 mb-10 text-white/55"
            style={{ fontSize: 12, letterSpacing: "0.15em" }}
          >
            <span>HOME</span>
            <ChevronRight className="w-3 h-3" />
            <span>TOURS</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">SRI LANKA</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="lg:col-span-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8" style={{ background: "#F4B942" }} />
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.35em",
                    color: "#F4B942",
                  }}
                >
                  THE PEARL · CURATED JOURNEYS
                </span>
              </div>
              <h1
                className="text-white mb-6"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 500,
                  fontSize: "clamp(56px, 8vw, 120px)",
                  lineHeight: 0.94,
                  letterSpacing: "-0.03em",
                }}
              >
                Sri Lanka
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(120deg, #F4B942 0%, #ffffff 60%, #F4B942 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  tours
                </span>
              </h1>
              <p
                className="text-white/75 max-w-[560px]"
                style={{ fontSize: 17, lineHeight: 1.6 }}
              >
                Six worlds on one island — heritage, hill country, wildlife,
                coast, romance and adventure. Hand-built itineraries you can
                bend to your pace.
              </p>
            </motion.div>

            {/* Stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45 }}
              className="lg:col-span-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border"
              style={{
                borderColor: "rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px)",
              }}
            >
              {[
                { v: "06", l: "Categories" },
                { v: "24", l: "Itineraries" },
                { v: "4.95★", l: "Avg. Rating" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="p-5"
                  style={{ background: "rgba(7,18,14,0.6)" }}
                >
                  <div
                    className="text-white"
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 28,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    className="text-white/55 mt-1"
                    style={{ fontSize: 10, letterSpacing: "0.18em" }}
                  >
                    {s.l.toUpperCase()}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── STICKY CATEGORY CHIPS ───────── */}
      <div
        className="sticky top-0 z-30 backdrop-blur-md border-y"
        style={{
          background: "rgba(7,18,14,0.85)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-5 flex items-center gap-2 overflow-x-auto">
          <div
            className="hidden md:flex items-center gap-2 text-white/45 mr-3 whitespace-nowrap"
            style={{ fontSize: 11, letterSpacing: "0.25em" }}
          >
            <Compass className="w-3.5 h-3.5" style={{ color: "#F4B942" }} />
            FILTER BY
          </div>
          {CATEGORIES.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className="px-4 py-2.5 rounded-full border whitespace-nowrap transition-all"
                style={{
                  background: isActive
                    ? "#F4B942"
                    : "rgba(255,255,255,0.05)",
                  borderColor: isActive
                    ? "#F4B942"
                    : "rgba(255,255,255,0.12)",
                  color: isActive ? "#1a1308" : "rgba(255,255,255,0.8)",
                  fontSize: 12,
                  letterSpacing: "0.05em",
                }}
              >
                <span
                  className="mr-2"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    opacity: isActive ? 0.6 : 0.5,
                  }}
                >
                  {c.num}
                </span>
                {c.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────── CATEGORY EXPLORER ───────── */}
      <section
        className="relative w-full py-28 px-6 lg:px-20"
        style={{ background: "#07120E" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT — Category detail */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 14,
                        letterSpacing: "0.3em",
                        color: "#F4B942",
                      }}
                    >
                      {active.num} / 06
                    </span>
                    <span className="h-px flex-1" style={{ background: "rgba(244,185,66,0.3)" }} />
                  </div>

                  <h2
                    className="text-white mb-5"
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontWeight: 500,
                      fontSize: "clamp(36px, 4vw, 52px)",
                      lineHeight: 1.02,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {active.name}
                  </h2>
                  <p
                    className="text-white/70 mb-8"
                    style={{ fontSize: 15, lineHeight: 1.65 }}
                  >
                    {active.blurb}
                  </p>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { Icon: Calendar, label: "Best Season", value: active.bestSeason },
                      { Icon: Clock, label: "Ideal Days", value: active.idealDays },
                      { Icon: Sparkles, label: "From", value: active.fromPrice },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="p-4 rounded-2xl border"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          borderColor: "rgba(255,255,255,0.08)",
                        }}
                      >
                        <s.Icon
                          className="w-3.5 h-3.5 mb-2"
                          style={{ color: "#F4B942" }}
                        />
                        <div
                          className="text-white/50 mb-1"
                          style={{ fontSize: 10, letterSpacing: "0.15em" }}
                        >
                          {s.label.toUpperCase()}
                        </div>
                        <div
                          className="text-white"
                          style={{
                            fontFamily: "'Clash Display', sans-serif",
                            fontSize: 15,
                          }}
                        >
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="mb-8">
                    <div
                      className="text-white/50 mb-4"
                      style={{ fontSize: 11, letterSpacing: "0.25em" }}
                    >
                      WHAT MAKES IT EXCEPTIONAL
                    </div>
                    <ul className="space-y-3">
                      {active.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-3 text-white/85"
                          style={{ fontSize: 14, lineHeight: 1.55 }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                            style={{ background: "#F4B942" }}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-2xl"
                    style={{
                      background: "#F4B942",
                      color: "#1a1308",
                      fontSize: 13,
                      letterSpacing: "0.12em",
                      boxShadow: "0 15px 40px rgba(244,185,66,0.3)",
                    }}
                  >
                    VIEW ALL {active.tours.length} TOURS
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT — Tour grid */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + "-tours"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                >
                  {active.tours.map((t, i) => (
                    <motion.article
                      key={t.name}
                      onClick={() =>
                        navigate(`/tours/sri-lanka/${slugify(t.name)}`)
                      }
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ y: -6 }}
                      className={`relative rounded-[24px] overflow-hidden border group cursor-pointer ${i % 3 === 0 ? "sm:row-span-2" : ""}`}
                      style={{
                        height: i % 3 === 0 ? "auto" : 280,
                        minHeight: i % 3 === 0 ? 580 : 280,
                        borderColor: "rgba(255,255,255,0.08)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                      }}
                    >
                      <ImageWithFallback
                        src={t.image}
                        alt={t.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <span
                          className="px-3 py-1.5 rounded-full text-white border flex items-center gap-1.5"
                          style={{
                            background: "rgba(255,255,255,0.12)",
                            borderColor: "rgba(255,255,255,0.18)",
                            backdropFilter: "blur(12px)",
                            fontSize: 10,
                            letterSpacing: "0.1em",
                          }}
                        >
                          <Clock className="w-2.5 h-2.5" />
                          {t.days.toUpperCase()}
                        </span>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          style={{ background: "#F4B942", color: "#1a1308" }}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div
                          className="flex items-center gap-1 mb-2 text-white/80"
                          style={{ fontSize: 11 }}
                        >
                          {[...Array(5)].map((_, si) => (
                            <Star
                              key={si}
                              className="w-2.5 h-2.5 fill-current"
                              style={{ color: "#F4B942" }}
                            />
                          ))}
                          <span className="ml-1.5 text-white/55">4.9</span>
                        </div>
                        <h3
                          className="text-white mb-3"
                          style={{
                            fontFamily: "'Clash Display', sans-serif",
                            fontSize: i % 3 === 0 ? 26 : 20,
                            lineHeight: 1.15,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {t.name}
                        </h3>
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span
                              className="text-white/55"
                              style={{ fontSize: 11 }}
                            >
                              From
                            </span>
                            <span
                              className="text-white"
                              style={{
                                fontFamily: "'Clash Display', sans-serif",
                                fontSize: 18,
                              }}
                            >
                              ${t.price}
                            </span>
                          </div>
                          <span
                            className="text-white/70 group-hover:text-[#F4B942] transition-colors flex items-center gap-1"
                            style={{ fontSize: 11, letterSpacing: "0.15em" }}
                          >
                            <MapPin className="w-3 h-3" />
                            VIEW
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
