"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./Logo";
import { ArrowUpRight, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home",              to: "/" },
  { label: "Journeys",          to: "/journeys" },
  { label: "Maldives",          to: "/maldives-resort" },
  { label: "Experiences",       to: "/experiences" },
  { label: "Travel in Comfort", to: "/travel-in-comfort" },
  { label: "Why Nomadic",       to: "/why-nomadic" },
];

type Props = { accent?: string; glow?: string; solid?: boolean };

/* ── Mobile slide-in drawer ─────────────────────────────────────────────── */
function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const go = (p: string) => { router.push(p); onClose(); };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={onClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 flex flex-col"
            style={{ background: "rgba(7,18,14,0.97)", backdropFilter: "blur(40px)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <Logo accent="#F4B942" size={22} textSize={13} />
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <X size={18} color="white" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-4">
              {NAV_ITEMS.map(item => (
                <button key={item.to} onClick={() => go(item.to)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-white/[0.06] transition-colors text-left mb-1">
                  <span style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em" }}>{item.label}</span>
                  <ArrowUpRight size={14} color="rgba(255,255,255,0.35)" />
                </button>
              ))}
            </nav>
            <div className="p-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <button onClick={() => go("/plan-trip")} className="w-full py-4 rounded-2xl text-white"
                style={{ background: "linear-gradient(135deg,#F4B942 0%,#7BC8A4 100%)", fontSize: 13, letterSpacing: "0.1em", fontFamily: "'Clash Display',sans-serif" }}>
                PLAN MY TRIP
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Main Navbar ─────────────────────────────────────────────────────────── */
export function Navbar({ accent = "#F4B942", glow = "rgba(244,185,66,0.35)", solid = false }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const pillBg = solid || scrolled ? "rgba(7,18,14,0.88)" : "rgba(255,255,255,0.08)";

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-50"
        style={{
          top: scrolled ? 16 : 24,
          left: "50%",
          x: "-50%",        /* Framer Motion merges x with y animation — never gets overwritten */
          width: scrolled ? "88%" : "94%",
          maxWidth: 1440,
          transition: "top 0.4s ease, width 0.4s ease",
        }}
      >
        {/*
          3-section pill:
          [Logo flex-shrink-0] [Nav flex-1 justify-center] [CTA flex-shrink-0]

          KEY: do NOT set display on the nav section via inline style.
          Use className="hidden xl:flex" so Tailwind controls visibility,
          while inline style only sets flex-grow and justify behaviour.
          This prevents the inline style from overriding Tailwind's hidden class.
        */}
        <div className="flex items-center px-4 py-2.5 rounded-3xl border"
          style={{
            background: pillBg,
            backdropFilter: "blur(24px) saturate(140%)",
            WebkitBackdropFilter: "blur(24px) saturate(140%)",
            borderColor: "rgba(255,255,255,0.13)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            transition: "background 0.4s ease",
          }}
        >
          {/* ① Logo */}
          <Link href="/" className="flex items-center flex-shrink-0" suppressHydrationWarning>
            <Logo accent={accent} size={22} textSize={13} />
          </Link>

          {/* ② Nav links — ONLY inline style for flex-1 + centering; display is via Tailwind className */}
          <div
            className="hidden xl:flex items-center justify-center"
            style={{ flex: 1, gap: 2, minWidth: 0, overflow: "hidden" }}
          >
            {NAV_ITEMS.map(item => (
              <Link
                key={item.to}
                href={item.to}
                suppressHydrationWarning
                className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors duration-200 ${
                  pathname === item.to
                    ? "text-white bg-white/10"
                    : "text-white/65 hover:text-white hover:bg-white/[0.06]"
                }`}
                style={{ fontSize: 12, letterSpacing: "0.03em" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ③ CTA + hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto xl:ml-0">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/plan-trip")}
              className="hidden xl:block px-5 py-2 rounded-full border text-white"
              style={{
                background: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(10px)",
                fontSize: 11,
                letterSpacing: "0.1em",
                fontFamily: "'Clash Display',sans-serif",
                boxShadow: `0 0 20px ${glow}`,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              PLAN MY TRIP
            </motion.button>

            <button
              className="xl:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} color="white" />
            </button>
          </div>
        </div>
      </motion.nav>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
