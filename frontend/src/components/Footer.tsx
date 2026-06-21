"use client";
import { motion } from "motion/react";
import {
  Instagram,
  Facebook,
  Linkedin,
  Music2,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Categories",
    links: [
      "Cultural & Heritage",
      "Hill Country Escapes",
      "Wildlife Safaris",
      "Beach Getaways",
      "Luxury Honeymoons",
      "Adventure Tours",
    ],
  },
  {
    title: "Destinations",
    links: [
      "Sri Lanka Tours",
      "Maldives Resorts",
      "Sigiriya & Kandy",
      "Ella & Tea Country",
      "Galle & South Coast",
      "Yala & Wildlife",
    ],
  },
  {
    title: "Experiences",
    links: [
      "Private Transport",
      "Honeymoon Planning",
      "Family Journeys",
      "Wellness & Spa",
      "Group Charters",
      "Bespoke Itineraries",
    ],
  },
  {
    title: "Company",
    links: ["About Us", "Travel Designers", "Press & Awards", "Sustainability", "Blog & Stories", "Contact"],
  },
];

const SOCIALS = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: Music2, label: "TikTok" },
  { Icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer
      className="relative w-full pt-28 pb-10 px-6 lg:px-20 overflow-hidden"
      style={{ background: "#07120E" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-x-0 top-0 h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(244,185,66,0.1) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[1320px] mx-auto">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 mb-16">
          {/* BRAND */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Logo accent="#F4B942" size={30} textSize={18} />
            </div>

            <p
              className="text-white/60 mb-8 max-w-[360px]"
              style={{ fontSize: 14, lineHeight: 1.7 }}
            >
              Normadic Ventures designs personal, unforgettable journeys across Sri Lanka and
              the Maldives — from cultural pilgrimages to overwater retreats,
              every detail curated by humans who live the islands.
            </p>

            {/* Contact */}
            <div className="space-y-3 mb-8">
              {[
                { Icon: MapPin, text: "32 Galle Face Terrace, Colombo 03" },
                { Icon: Phone, text: "+94 11 234 5678" },
                { Icon: Mail, text: "hello@normadicventures.com" },
              ].map((row) => (
                <div
                  key={row.text}
                  className="flex items-center gap-3 text-white/70"
                  style={{ fontSize: 13 }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(244,185,66,0.1)",
                      border: "1px solid rgba(244,185,66,0.25)",
                      color: "#F4B942",
                    }}
                  >
                    <row.Icon className="w-3 h-3" />
                  </div>
                  {row.text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  whileHover={{
                    y: -3,
                    boxShadow: "0 8px 30px rgba(244,185,66,0.3)",
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center border text-white/70 hover:text-white"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* LINK COLUMNS */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-6">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <div
                  className="text-white/45 mb-5"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.25em",
                  }}
                >
                  {col.title.toUpperCase()}
                </div>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-white/75 hover:text-white transition-colors flex items-center gap-1.5 group"
                        style={{ fontSize: 13 }}
                      >
                        {link}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* AS FEATURED IN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 py-8 border-y flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="text-white/45 flex items-center gap-3 whitespace-nowrap"
            style={{ fontSize: 11, letterSpacing: "0.3em" }}
          >
            <span className="h-px w-6" style={{ background: "rgba(244,185,66,0.6)" }} />
            AS FEATURED IN
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {[
              "Condé Nast Traveller",
              "Travel + Leisure",
              "Forbes",
              "Vogue",
              "Robb Report",
            ].map((pub) => (
              <span
                key={pub}
                className="text-white/55 hover:text-white transition-colors"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 18,
                  letterSpacing: "-0.005em",
                }}
              >
                {pub}
              </span>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM BAR */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-5 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="text-white/45 flex flex-wrap items-center gap-x-3 gap-y-1 justify-center md:justify-start"
            style={{ fontSize: 12 }}
          >
            <span>© 2026 Normadic Ventures.</span>
            <span className="text-white/20">·</span>
            <span>Crafted in Colombo & Malé.</span>
          </div>

          <div
            className="flex items-center gap-6 text-white/55"
            style={{ fontSize: 12 }}
          >
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Sitemap
            </a>
          </div>

          <div
            className="flex items-center gap-2 text-white/40"
            style={{ fontSize: 11, letterSpacing: "0.05em" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#0B8D6B" }}
            />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
