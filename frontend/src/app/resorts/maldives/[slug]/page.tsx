"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  MapPin,
  Calendar,
  Users,
  Check,
  X,
  Star,
  Sparkles,
  ChevronRight,
  Heart,
  Waves,
  Anchor,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { getResort, RESORTS } from "@/data/resorts";

const COUNTRIES = [
  { name: "Australia", code: "+61" },
  { name: "Canada", code: "+1" },
  { name: "France", code: "+33" },
  { name: "Germany", code: "+49" },
  { name: "India", code: "+91" },
  { name: "Maldives", code: "+960" },
  { name: "Singapore", code: "+65" },
  { name: "Sri Lanka", code: "+94" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Other", code: "" }
];

export default function Page() {
  const { slug = "" } = useParams();
  const resort = getResort(slug as string);
  const [activeExp, setActiveExp] = useState(0);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    mobileNo: "",
    adults: "2",
    children: "0",
    infants: "0",
    package: resort ? resort.name : "",
    travelDate: "",
    noOfNights: "7",
    description: "",
  });

  const handleCountryChange = (countryName: string) => {
    const country = COUNTRIES.find((c) => c.name === countryName);
    let newMobile = form.mobileNo;
    if (country && country.code) {
      if (!form.mobileNo) {
        newMobile = country.code + " ";
      } else {
        const oldCountry = COUNTRIES.find((c) => c.name === form.country);
        if (oldCountry && oldCountry.code && form.mobileNo.startsWith(oldCountry.code)) {
          newMobile = form.mobileNo.replace(oldCountry.code, country.code);
        } else if (!form.mobileNo.startsWith("+")) {
          newMobile = country.code + " " + form.mobileNo;
        }
      }
    }
    setForm((prev) => ({ ...prev, country: countryName, mobileNo: newMobile }));
  };

  if (!resort) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center"
        style={{
          background:
            "linear-gradient(180deg, #021830 0%, #032440 50%, #010c1c 100%)",
          color: "white",
        }}
      >
        <Navbar accent="#89F3FF" glow="rgba(137,243,255,0.35)" />
        <div className="text-center px-8">
          <div
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 60,
              letterSpacing: "-0.02em",
            }}
          >
            Resort not found
          </div>
          <p
            className="mt-4 mb-8"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}
          >
            Browse our current collection of Maldives resorts.
          </p>
          <Link
            href="/resorts/maldives"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: "linear-gradient(135deg, #89F3FF, #5BD4E5)",
              color: "#021830",
              fontSize: 13,
              letterSpacing: "0.15em",
            }}
          >
            BACK TO RESORTS
          </Link>
        </div>
      </div>
    );
  }

  const related = Object.values(RESORTS)
    .filter((r) => r.slug !== resort.slug && r.tag === resort.tag)
    .slice(0, 3);
  const fillRelated =
    related.length < 3
      ? [
          ...related,
          ...Object.values(RESORTS)
            .filter(
              (r) =>
                r.slug !== resort.slug &&
                !related.find((x) => x.slug === r.slug)
            )
            .slice(0, 3 - related.length),
        ]
      : related;

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "linear-gradient(180deg, #021830 0%, #032440 50%, #010c1c 100%)",
        color: "white",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Navbar accent="#89F3FF" glow="rgba(137,243,255,0.35)" />

      {/* HERO */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "94vh" }}>
        <div className="absolute inset-0">
          <ImageWithFallback
            src={resort.image}
            alt={resort.name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(2,24,48,0.45) 0%, rgba(3,36,64,0.2) 40%, rgba(1,12,28,0.96) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 500px at 85% 15%, rgba(137,243,255,0.22), transparent 65%), radial-gradient(700px 400px at 15% 80%, rgba(244,185,66,0.12), transparent 60%)",
            }}
          />
        </div>

        {/* floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                background: "#89F3FF",
                left: `${(i * 53) % 100}%`,
                top: `${(i * 37) % 100}%`,
                opacity: 0.4,
              }}
              animate={{ y: [0, -16, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 6 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-[1400px] mx-auto px-8 pt-44 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 flex-wrap"
            style={{
              fontSize: 11,
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <Link href="/" className="hover:text-white transition-colors">
              HOME
            </Link>
            <ChevronRight className="w-3 h-3" style={{ color: "#89F3FF" }} />
            <Link
              href="/resorts/maldives"
              className="hover:text-white transition-colors"
            >
              MALDIVES RESORTS
            </Link>
            <ChevronRight className="w-3 h-3" style={{ color: "#89F3FF" }} />
            <span style={{ color: "white" }}>{resort.name.toUpperCase()}</span>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-10 items-end mt-12">
            <div className="md:col-span-8">
              {/* ── Category · Rating · Location ── */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="flex items-center gap-3 mb-5 flex-wrap"
              >
                <span
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(137,243,255,0.95)",
                    color: "#021830",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    fontFamily: "'Clash Display', sans-serif",
                  }}
                >
                  {resort.tag.toUpperCase()}
                </span>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(137,243,255,0.25)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <Star
                    className="w-3 h-3"
                    style={{ color: "#89F3FF", fill: "#89F3FF" }}
                  />
                  4.97 · 218 STAYS
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <MapPin className="w-3 h-3" />
                  {resort.atoll.toUpperCase()}
                </div>
              </motion.div>

              {/* ── Resort title ── */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8 }}
                className="mb-4"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(36px, 4.5vw, 64px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  color: "white",
                }}
              >
                {resort.name}
              </motion.h1>

              {/* ── Short description ── */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-xl"
                style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.68)",
                }}
              >
                {resort.dek}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="mt-10 flex items-center gap-3 flex-wrap"
              >
                {resort.amenities.map((a) => (
                  <span
                    key={a}
                    className="px-4 py-2 rounded-full border"
                    style={{
                      background: "rgba(137,243,255,0.06)",
                      borderColor: "rgba(137,243,255,0.25)",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {a}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Booking card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="md:col-span-4 p-7 rounded-[28px] border"
              style={{
                background:
                  "linear-gradient(180deg, rgba(137,243,255,0.10), rgba(2,24,48,0.7))",
                borderColor: "rgba(137,243,255,0.25)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 30px 80px rgba(0,15,40,0.5)",
              }}
            >
              <div className="flex items-baseline gap-2 mb-6">
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: "0.2em",
                  }}
                >
                  FROM
                </span>
                <span
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 44,
                    lineHeight: 1,
                    color: "white",
                  }}
                >
                  ${resort.price}
                </span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                  / night
                </span>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="First name"
                    value={form.firstName}
                    onChange={(v) => setForm({ ...form, firstName: v })}
                    placeholder="Anjali"
                  />
                  <Field
                    label="Last name"
                    value={form.lastName}
                    onChange={(v) => setForm({ ...form, lastName: v })}
                    placeholder="Perera"
                  />
                </div>

                <Field
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  placeholder="anjali@email.com"
                />

                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Country"
                    value={form.country}
                    onChange={handleCountryChange}
                    options={[
                      { label: "Select Country", value: "" },
                      ...COUNTRIES.map((c) => ({ label: c.name, value: c.name })),
                    ]}
                  />
                  <Field
                    label="Mobile No"
                    value={form.mobileNo}
                    onChange={(v) => setForm({ ...form, mobileNo: v })}
                    placeholder="+94 77 123 4567"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <SelectField
                    label="Adults"
                    value={form.adults}
                    onChange={(v) => setForm({ ...form, adults: v })}
                    options={Array.from({ length: 15 }, (_, i) => ({
                      label: String(i + 1),
                      value: String(i + 1),
                    }))}
                  />
                  <SelectField
                    label="Children"
                    value={form.children}
                    onChange={(v) => setForm({ ...form, children: v })}
                    options={Array.from({ length: 11 }, (_, i) => ({
                      label: String(i),
                      value: String(i),
                    }))}
                  />
                  <SelectField
                    label="Infants"
                    value={form.infants}
                    onChange={(v) => setForm({ ...form, infants: v })}
                    options={Array.from({ length: 11 }, (_, i) => ({
                      label: String(i),
                      value: String(i),
                    }))}
                  />
                </div>

                <Field
                  label="Package"
                  value={form.package}
                  onChange={(v) => {}}
                  readOnly={true}
                  placeholder="Resort Name"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Travel date"
                    type="date"
                    icon={Calendar}
                    value={form.travelDate}
                    onChange={(v) => setForm({ ...form, travelDate: v })}
                  />
                  <SelectField
                    label="No of nights"
                    value={form.noOfNights}
                    onChange={(v) => setForm({ ...form, noOfNights: v })}
                    options={Array.from({ length: 30 }, (_, i) => ({
                      label: String(i + 1) + " Nights",
                      value: String(i + 1),
                    }))}
                  />
                </div>

                <div>
                  <label
                    className="block mb-1.5"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    DESCRIPTIONS
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Tell us what you're dreaming of..."
                    rows={3}
                    className="w-full bg-transparent outline-none px-3 py-2.5 rounded-[12px] border placeholder:text-white/35 text-white resize-none"
                    style={{
                      fontSize: 13,
                      background: "rgba(2,24,48,0.5)",
                      borderColor: "rgba(137,243,255,0.14)",
                    }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="mt-6 w-full flex items-center justify-center gap-3 py-3.5 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #89F3FF, #5BD4E5)",
                    color: "#021830",
                    fontSize: 13,
                    letterSpacing: "0.18em",
                    boxShadow: "0 18px 50px rgba(137,243,255,0.35)",
                  }}
                >
                  INQUIRE NOW
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS STRIP */}
      <section className="max-w-[1400px] mx-auto px-8 -mt-12 relative z-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-4 gap-5 p-8 rounded-[32px] border"
          style={{
            background:
              "linear-gradient(135deg, rgba(137,243,255,0.10) 0%, rgba(2,24,48,0.85) 50%, rgba(244,185,66,0.06) 100%)",
            borderColor: "rgba(137,243,255,0.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          {resort.highlights.slice(0, 4).map((h, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(137,243,255,0.25), rgba(244,185,66,0.15))",
                  border: "1px solid rgba(137,243,255,0.4)",
                  fontFamily: "'Clash Display', sans-serif",
                  color: "#89F3FF",
                  fontSize: 13,
                  letterSpacing: "0.1em",
                }}
              >
                0{i + 1}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {h}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* EXPERIENCES — interactive split */}
      <section className="max-w-[1400px] mx-auto px-8 pb-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div className="max-w-xl">
            <div
              className="flex items-center gap-3 mb-5"
              style={{
                fontSize: 11,
                letterSpacing: "0.4em",
                color: "#89F3FF",
              }}
            >
              <Waves className="w-3.5 h-3.5" />
              DAYS AT {resort.name.toUpperCase()}
            </div>
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(40px, 4.5vw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Four signature{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, #89F3FF, #ffffff, #F4B942)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                experiences.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 flex flex-col">
            {resort.experiences.map((exp, i) => {
              const active = activeExp === i;
              return (
                <button
                  key={exp.title}
                  onMouseEnter={() => setActiveExp(i)}
                  onClick={() => setActiveExp(i)}
                  className="group grid grid-cols-12 gap-4 py-6 text-left border-t last:border-b items-center"
                  style={{ borderColor: "rgba(137,243,255,0.12)" }}
                >
                  <div
                    className="col-span-1"
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 16,
                      letterSpacing: "0.2em",
                      color: active ? "#89F3FF" : "rgba(255,255,255,0.35)",
                    }}
                  >
                    0{i + 1}
                  </div>
                  <div className="col-span-9">
                    <div
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 22,
                        lineHeight: 1.2,
                        color: active ? "white" : "rgba(255,255,255,0.7)",
                        letterSpacing: "-0.01em",
                        transition: "color 0.3s",
                      }}
                    >
                      {exp.title}
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <motion.div
                      animate={{
                        rotate: active ? 0 : -30,
                        scale: active ? 1 : 0.85,
                      }}
                      transition={{ duration: 0.4 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: active
                          ? "#89F3FF"
                          : "rgba(255,255,255,0.05)",
                        color: active ? "#021830" : "rgba(255,255,255,0.5)",
                        border: active
                          ? "none"
                          : "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeExp}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 relative overflow-hidden rounded-[32px]"
            style={{ minHeight: 480 }}
          >
            <ImageWithFallback
              src={
                resort.gallery?.[activeExp % (resort.gallery?.length ?? 1)] ??
                resort.image
              }
              alt={resort.experiences[activeExp].title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(2,24,48,0.2) 40%, rgba(2,24,48,0.95) 100%)",
              }}
            />
            <div className="absolute bottom-8 left-8 right-8">
              <div
                className="flex items-center gap-3 mb-3"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  color: "#89F3FF",
                }}
              >
                EXPERIENCE 0{activeExp + 1}
              </div>
              <div
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 32,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  color: "white",
                }}
              >
                {resort.experiences[activeExp].title}
              </div>
              <p
                className="mt-4 max-w-xl"
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                {resort.experiences[activeExp].body}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VILLA TYPES */}
      <section className="max-w-[1400px] mx-auto px-8 pb-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
          <div>
            <div
              className="flex items-center gap-3 mb-5"
              style={{
                fontSize: 11,
                letterSpacing: "0.4em",
                color: "#F4B942",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, #F4B942)",
                }}
              />
              WHERE YOU'LL STAY
            </div>
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(40px, 4.5vw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Three villa{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, #89F3FF, #ffffff, #F4B942)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                categories.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {resort.villaTypes.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="p-7 rounded-[24px] border flex flex-col"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(137,243,255,0.15)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 13,
                  letterSpacing: "0.3em",
                  color: "#89F3FF",
                  marginBottom: 12,
                }}
              >
                0{i + 1}
              </div>
              <div
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 24,
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                  color: "white",
                }}
              >
                {v.name}
              </div>
              <div
                className="mt-3"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.05em",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {v.size}
              </div>
              <p
                className="mt-5 flex-1"
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {v.note}
              </p>
              <div
                className="mt-7 pt-5 border-t flex items-baseline justify-between"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <div className="flex items-baseline gap-1.5">
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.55)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    FROM
                  </span>
                  <span
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 24,
                      color: "white",
                    }}
                  >
                    {v.from}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                    /night
                  </span>
                </div>
                <ArrowUpRight
                  className="w-4 h-4"
                  style={{ color: "#89F3FF" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INCLUDES / EXCLUDES */}
      <section className="max-w-[1400px] mx-auto px-8 pb-32">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7 grid md:grid-cols-2 gap-5">
            <Panel
              title="Included in the stay"
              accent="#89F3FF"
              items={resort.includes}
              positive
            />
            <Panel
              title="Not included"
              accent="#F4B942"
              items={resort.excludes}
            />
          </div>
          <div className="md:col-span-5">
            <div
              className="p-8 rounded-[28px] border h-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(137,243,255,0.10), rgba(2,24,48,0.6))",
                borderColor: "rgba(137,243,255,0.25)",
              }}
            >
              <Sparkles className="w-5 h-5 mb-5" style={{ color: "#89F3FF" }} />
              <h3
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 28,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                Pair this with a{" "}
                <span style={{ color: "#89F3FF", fontStyle: "italic" }}>
                  Sri Lanka journey?
                </span>
              </h3>
              <p
                className="mt-4"
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Our most-requested itineraries open with a week across Sri Lanka
                and close with three to five nights at a Maldivian atoll. Your
                designer will sketch a full draft in 24 hours.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-3 pl-6 pr-3 py-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #89F3FF, #5BD4E5)",
                  color: "#021830",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                }}
              >
                DESIGN A TWIN-CENTRE TRIP
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "#021830", color: "#89F3FF" }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {resort.gallery && resort.gallery.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-8 pb-32">
          <div className="flex items-end justify-between gap-8 flex-wrap mb-10">
            <div>
              <div
                className="flex items-center gap-3 mb-5"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.4em",
                  color: "#89F3FF",
                }}
              >
                FROM THE ATOLL
              </div>
              <h2
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(36px, 4vw, 54px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                Frames from{" "}
                <span style={{ color: "#89F3FF", fontStyle: "italic" }}>
                  {resort.name}.
                </span>
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 pb-1 border-b"
              style={{
                borderColor: "rgba(255,255,255,0.3)",
                fontSize: 12,
                letterSpacing: "0.15em",
                color: "white",
              }}
            >
              FULL GALLERY <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {resort.gallery.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="overflow-hidden rounded-[24px] group"
                style={{ border: "1px solid rgba(137,243,255,0.15)" }}
              >
                <ImageWithFallback
                  src={src}
                  alt={`${resort.name} ${i + 1}`}
                  className="w-full h-80 object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* RELATED */}
      <section className="max-w-[1400px] mx-auto px-8 pb-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <div
              className="flex items-center gap-3 mb-5"
              style={{
                fontSize: 11,
                letterSpacing: "0.4em",
                color: "#89F3FF",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, #89F3FF)",
                }}
              />
              SIMILAR ATOLLS
            </div>
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(36px, 4.5vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Other resorts in{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, #89F3FF, #ffffff, #F4B942)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                this spirit.
              </span>
            </h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {fillRelated.map((r) => (
            <Link
              href={`/resorts/maldives/${r.slug}`}
              key={r.slug}
              className="group"
            >
              <div
                className="relative overflow-hidden rounded-[24px] mb-5"
                style={{
                  height: 340,
                  border: "1px solid rgba(137,243,255,0.15)",
                }}
              >
                <ImageWithFallback
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(2,24,48,0.9) 100%)",
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(2,24,48,0.7)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(137,243,255,0.25)",
                      fontSize: 10,
                      letterSpacing: "0.25em",
                      color: "#89F3FF",
                    }}
                  >
                    {r.atoll.toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div
                    className="mb-1"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.3em",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    FROM ${r.price}/NIGHT
                  </div>
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 24,
                      lineHeight: 1.15,
                      color: "white",
                    }}
                  >
                    {r.name}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block mb-1.5"
      style={{
        fontSize: 10,
        letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.5)",
      }}
    >
      {children?.toString().toUpperCase()}
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  className,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: any;
  className?: string;
  readOnly?: boolean;
}) {
  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-[12px] border"
        style={{
          background: "rgba(2,24,48,0.5)",
          borderColor: "rgba(137,243,255,0.14)",
        }}
      >
        {Icon && (
          <Icon
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "rgba(137,243,255,0.5)" }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`bg-transparent outline-none flex-1 placeholder:text-white/35 text-white [color-scheme:dark] min-w-0 ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
          style={{ fontSize: 13 }}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  icon: Icon,
  className,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { label: string; value: string })[];
  icon?: any;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-[12px] border"
        style={{
          background: "rgba(2,24,48,0.5)",
          borderColor: "rgba(137,243,255,0.14)",
        }}
      >
        {Icon && (
          <Icon
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "rgba(137,243,255,0.5)" }}
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none flex-1 text-white appearance-none cursor-pointer min-w-0"
          style={{ fontSize: 13 }}
        >
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val} style={{ background: "#021830" }}>
                {lbl}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

function FloatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-[14px] border"
      style={{
        background: "rgba(2,24,48,0.5)",
        borderColor: "rgba(137,243,255,0.15)",
      }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.55)" }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: 13, color: "white" }}>{value}</span>
    </div>
  );
}

function Panel({
  title,
  accent,
  items,
  positive = false,
}: {
  title: string;
  accent: string;
  items: string[];
  positive?: boolean;
}) {
  const Icon = positive ? Check : X;
  return (
    <div
      className="p-7 rounded-[24px] border"
      style={{
        background: "rgba(255,255,255,0.04)",
        borderColor: "rgba(137,243,255,0.12)",
      }}
    >
      <div
        className="flex items-center gap-3 mb-6"
        style={{
          fontSize: 11,
          letterSpacing: "0.35em",
          color: accent,
        }}
      >
        {title.toUpperCase()}
      </div>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{
                background: positive ? `${accent}1f` : "rgba(255,255,255,0.06)",
                border: `1px solid ${positive ? accent : "rgba(255,255,255,0.15)"}55`,
                color: positive ? accent : "rgba(255,255,255,0.5)",
              }}
            >
              <Icon className="w-3 h-3" />
            </div>
            <span
              style={{
                fontSize: 13.5,
                lineHeight: 1.6,
                color: positive
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.55)",
              }}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
