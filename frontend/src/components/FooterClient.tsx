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

const SOCIALS = [
  { Icon: Facebook, label: "Facebook", link: "https://www.facebook.com/NomadicVenturesSriLanka/" },
  { Icon: Instagram, label: "Instagram", link: "https://www.instagram.com/nomadic_ventures_srilanka/" },
  { Icon: Music2, label: "TikTok", link: "#" },
  { Icon: Linkedin, label: "LinkedIn", link: "#" },
];

export function FooterClient({
  tourCategories,
  resortCategories,
}: {
  tourCategories: { id?: string; name: string; slug: string }[];
  resortCategories: { id?: string; name: string; slug: string }[];
}) {
  return (
    <footer
      className="relative w-full pt-28 pb-10 px-6 lg:px-20 overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-x-0 top-0 h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[1320px] mx-auto">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 mb-16">
          {/* BRAND */}
          <div className="lg:col-span-5">
            <div className="mb-6">
              <Logo accent="#d4af37" size={30} textSize={18} />
            </div>

            <p
              className="text-white/60 mb-8 max-w-[360px]"
              style={{ fontSize: 15.5, lineHeight: 1.7 }}
            >
              Nomadic Ventures designs personal, unforgettable journeys across Sri Lanka and
              the Maldives — from cultural pilgrimages to overwater retreats,
              every detail curated by humans who live the islands.
            </p>

            {/* Contact */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 text-white/70" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", color: "#d4af37" }}>
                  <MapPin className="w-3 h-3" />
                </div>
                <span>No 6 /12, 3rd Lane, Nawala Road,<br/>Rajagiriya, Sri Lanka</span>
              </div>
              <div className="flex items-start gap-3 text-white/70" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", color: "#d4af37" }}>
                  <Phone className="w-3 h-3" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span>+94 112 474 472 <span className="text-white/40 ml-1">(Call)</span></span>
                  <span>+94 71 523 3845 <span className="text-white/40 ml-1">(WhatsApp)</span></span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-white/70" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", color: "#d4af37" }}>
                  <Mail className="w-3 h-3" />
                </div>
                <a href="mailto:info@nomadicsrilanka.com" className="hover:text-white transition-colors mt-0.5">info@nomadicsrilanka.com</a>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ Icon, label, link }) => (
                <motion.a
                  key={label}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{
                    y: -3,
                    boxShadow: "0 8px 30px rgba(212,175,55,0.25)",
                    borderColor: "rgba(212,175,55,0.4)"
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center border text-white/70 hover:text-white transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderColor: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* LINK COLUMNS */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 pl-0 lg:pl-10">
            
            {/* SRI LANKA */}
            <div>
              <div className="text-[#d4af37] mb-6 font-semibold" style={{ fontSize: 12.5, letterSpacing: "0.25em" }}>
                SRI LANKA
              </div>
              <ul className="space-y-4">
                {tourCategories.map((cat) => (
                  <li key={cat.id || cat.slug}>
                    <a
                      href={`/journeys?category=${cat.slug}`}
                      className="text-white/60 hover:text-[#d4af37] transition-colors flex items-center gap-2 group"
                      style={{ fontSize: 15 }}
                    >
                      {cat.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* MALDIVES */}
            <div>
              <div className="text-[#d4af37] mb-6 font-semibold" style={{ fontSize: 12.5, letterSpacing: "0.25em" }}>
                MALDIVES
              </div>
              <ul className="space-y-4">
                {resortCategories.map((cat) => (
                  <li key={cat.id || cat.slug}>
                    <a
                      href={`/maldives-resort?category=${cat.slug}`}
                      className="text-white/60 hover:text-[#d4af37] transition-colors flex items-center gap-2 group"
                      style={{ fontSize: 15 }}
                    >
                      {cat.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <div className="text-[#d4af37] mb-6 font-semibold" style={{ fontSize: 12.5, letterSpacing: "0.25em" }}>
                COMPANY
              </div>
              <ul className="space-y-4">
                {[
                  { name: "Travel in Comfort", link: "/travel-in-comfort" },
                  { name: "Why Nomadic", link: "/why-nomadic" },
                  { name: "Plan my trip", link: "/plan-trip" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      className="text-white/60 hover:text-[#d4af37] transition-colors flex items-center gap-2 group"
                      style={{ fontSize: 15 }}
                    >
                      {item.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-5 border-t"
          style={{ borderColor: "rgba(212,175,55,0.15)" }}
        >
          <div
            className="text-white/40 flex flex-wrap items-center gap-x-3 gap-y-1 justify-center md:justify-start"
            style={{ fontSize: 13.5 }}
          >
            <span>© {new Date().getFullYear()} Nomadic Ventures.</span>
            <span className="text-[#d4af37]/40">·</span>
            <span>Crafted in Colombo & Malé.</span>
          </div>

          <div
            className="flex items-center gap-6 text-white/50"
            style={{ fontSize: 13.5 }}
          >
            <a href="#" className="hover:text-[#d4af37] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Cookies</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Sitemap</a>
          </div>

          <div
            className="flex items-center gap-2 text-[#d4af37]/70"
            style={{ fontSize: 12.5, letterSpacing: "0.05em" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#d4af37", boxShadow: "0 0 8px #d4af37" }}
            />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
