"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Instagram,
  Facebook,
  Linkedin,
  Music2,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Logo } from "./Logo";

const SOCIALS = [
  { Icon: Facebook, label: "Facebook", link: "https://www.facebook.com/NomadicVenturesSriLanka/" },
  { Icon: Instagram, label: "Instagram", link: "https://www.instagram.com/nomadic_ventures_srilanka/" },
  { Icon: Music2, label: "TikTok", link: "#" },
  { Icon: Linkedin, label: "LinkedIn", link: "#" },
];

function AccordionSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {/* Mobile: tap-to-expand header */}
      <button
        className="md:hidden w-full flex items-center justify-between py-4 border-b"
        style={{ borderColor: "rgba(212,175,55,0.12)" }}
        onClick={() => setOpen((p) => !p)}
      >
        <span className="text-[#d4af37] font-semibold" style={{ fontSize: 12.5, letterSpacing: "0.25em" }}>
          {title}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
        </motion.div>
      </button>
      {/* Desktop: always-visible heading */}
      <div className="hidden md:block text-[#d4af37] mb-6 font-semibold" style={{ fontSize: 12.5, letterSpacing: "0.25em" }}>
        {title}
      </div>
      {/* Mobile: animated body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Desktop: always-visible body */}
      <div className="hidden md:block">{children}</div>
    </div>
  );
}

export function FooterClient({
  tourCategories,
  resortCategories,
}: {
  tourCategories: { id?: string; name: string; slug: string }[];
  resortCategories: { id?: string; name: string; slug: string }[];
}) {
  return (
    <footer
      className="relative w-full pt-16 lg:pt-28 pb-10 px-6 lg:px-20 overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-x-0 top-0 h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 60%)" }}
      />

      <div className="relative max-w-[1320px] mx-auto">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 lg:mb-16">

          {/* BRAND */}
          <div className="lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-6">
              <Logo accent="#d4af37" size={30} textSize={18} />
            </div>
            <p className="text-white/60 mb-8 max-w-[360px]" style={{ fontSize: 15.5, lineHeight: 1.7 }}>
              Nomadic Ventures designs personal, unforgettable journeys across Sri Lanka and
              the Maldives — from cultural pilgrimages to overwater retreats,
              every detail curated by humans who live the islands.
            </p>
            {/* Contact */}
            <div className="space-y-4 mb-8 w-full max-w-[360px]">
              <div className="flex items-start gap-3 text-white/70" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", color: "#d4af37" }}>
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="text-left">No 6 /12, 3rd Lane, Nawala Road,<br/>Rajagiriya, Sri Lanka</span>
              </div>
              <div className="flex items-start gap-3 text-white/70" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", color: "#d4af37" }}>
                  <Phone className="w-3 h-3" />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <span>+94 112 474 472 <span className="text-white/40 ml-1">(Call)</span></span>
                  <span>{process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+94 77 17 66 134"} <span className="text-white/40 ml-1">(Call / WhatsApp)</span></span>
                  <span>+94 77 11 56 646 <span className="text-white/40 ml-1">(WhatsApp)</span></span>
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
            <div className="flex items-center justify-center md:justify-start gap-2">
              {SOCIALS.map(({ Icon, label, link }) => (
                <motion.a
                  key={label}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(212,175,55,0.25)", borderColor: "rgba(212,175,55,0.4)" }}
                  className="w-10 h-10 rounded-full flex items-center justify-center border text-white/70 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* LINK COLUMNS */}
          <div className="lg:col-span-7 pl-0 lg:pl-10">
            {/* Mobile: collapsible accordions */}
            <div className="md:hidden flex flex-col">
              <AccordionSection title="SRI LANKA">
                <ul className="space-y-4">
                  {tourCategories.map((cat) => (
                    <li key={cat.id || cat.slug}>
                      <a href={`/journeys?category=${cat.slug}`} className="text-white/60 hover:text-[#d4af37] transition-colors flex items-center gap-2 group" style={{ fontSize: 15 }}>
                        {cat.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </AccordionSection>
              <AccordionSection title="MALDIVES">
                <ul className="space-y-4">
                  {resortCategories.map((cat) => (
                    <li key={cat.id || cat.slug}>
                      <a href={`/maldives-resort?category=${cat.slug}`} className="text-white/60 hover:text-[#d4af37] transition-colors flex items-center gap-2 group" style={{ fontSize: 15 }}>
                        {cat.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </AccordionSection>
              <AccordionSection title="COMPANY">
                <ul className="space-y-4">
                  {[
                    { name: "Travel in Comfort", link: "/travel-in-comfort" },
                    { name: "Why Nomadic", link: "/why-nomadic" },
                    { name: "Plan my trip", link: "/plan-trip" },
                  ].map((item) => (
                    <li key={item.name}>
                      <a href={item.link} className="text-white/60 hover:text-[#d4af37] transition-colors flex items-center gap-2 group" style={{ fontSize: 15 }}>
                        {item.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </AccordionSection>
            </div>

            {/* Desktop: original 3-col grid */}
            <div className="hidden md:grid grid-cols-3 gap-10 lg:gap-12">
              <div>
                <div className="text-[#d4af37] mb-6 font-semibold" style={{ fontSize: 12.5, letterSpacing: "0.25em" }}>SRI LANKA</div>
                <ul className="space-y-4">
                  {tourCategories.map((cat) => (
                    <li key={cat.id || cat.slug}>
                      <a href={`/journeys?category=${cat.slug}`} className="text-white/60 hover:text-[#d4af37] transition-colors flex items-center gap-2 group" style={{ fontSize: 15 }}>
                        {cat.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[#d4af37] mb-6 font-semibold" style={{ fontSize: 12.5, letterSpacing: "0.25em" }}>MALDIVES</div>
                <ul className="space-y-4">
                  {resortCategories.map((cat) => (
                    <li key={cat.id || cat.slug}>
                      <a href={`/maldives-resort?category=${cat.slug}`} className="text-white/60 hover:text-[#d4af37] transition-colors flex items-center gap-2 group" style={{ fontSize: 15 }}>
                        {cat.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[#d4af37] mb-6 font-semibold" style={{ fontSize: 12.5, letterSpacing: "0.25em" }}>COMPANY</div>
                <ul className="space-y-4">
                  {[
                    { name: "Travel in Comfort", link: "/travel-in-comfort" },
                    { name: "Why Nomadic", link: "/why-nomadic" },
                    { name: "Plan my trip", link: "/plan-trip" },
                  ].map((item) => (
                    <li key={item.name}>
                      <a href={item.link} className="text-white/60 hover:text-[#d4af37] transition-colors flex items-center gap-2 group" style={{ fontSize: 15 }}>
                        {item.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
          {/* Mobile: stacked centered */}
          <div className="md:hidden flex flex-col items-center gap-3 text-center">
            <span className="text-white/40" style={{ fontSize: 13 }}>
              © {new Date().getFullYear()} Nomadic Ventures.
            </span>
            <span className="text-white/40" style={{ fontSize: 13 }}>
              Created by MINDZ IT Solutions
            </span>
            <a href="/privacy-policy" className="text-white/50 hover:text-[#d4af37] transition-colors" style={{ fontSize: 13 }}>
              Privacy Policy
            </a>
          </div>

          {/* Desktop: 3-item row */}
          <div className="hidden md:flex items-center justify-between gap-5">
            <span className="text-white/40" style={{ fontSize: 13.5 }}>
              © {new Date().getFullYear()} Nomadic Ventures.
            </span>
            <span className="text-white/40" style={{ fontSize: 13.5 }}>
              Created by MINDZ IT Solutions
            </span>
            <a href="/privacy-policy" className="text-white/50 hover:text-[#d4af37] transition-colors" style={{ fontSize: 13.5 }}>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
