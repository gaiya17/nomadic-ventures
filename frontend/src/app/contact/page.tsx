"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Sparkles,
  Plus,
  Minus,
  Clock,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+94 76 555 0142",
    note: "Fastest · 24/7 concierge",
    accent: "#25D366",
  },
  {
    icon: Phone,
    label: "Direct line",
    value: "+94 11 234 5678",
    note: "Mon–Sat · 08:00–20:00 IST",
    accent: "#F4B942",
  },
  {
    icon: Mail,
    label: "Studio email",
    value: "hello@ewaytravels.com",
    note: "Reply within 4 hours",
    accent: "#89F3FF",
  },
];

const OFFICES = [
  {
    city: "Colombo",
    country: "Sri Lanka",
    address: "12 Galle Face Court, Colombo 03",
    hours: "08:00 – 20:00 IST",
    image:
      "https://images.unsplash.com/photo-1740812517495-812e90ca01b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    city: "Malé",
    country: "Maldives",
    address: "Boduthakurufaanu Magu, Henveiru, Malé",
    hours: "09:00 – 18:00 MVT",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
  {
    city: "London",
    country: "United Kingdom",
    address: "By appointment · Marylebone",
    hours: "10:00 – 18:00 GMT",
    image:
      "https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
  },
];

const FAQS = [
  {
    q: "How quickly will I hear back?",
    a: "A travel designer responds within four hours during studio hours, and by the next morning for after-hours enquiries.",
  },
  {
    q: "Do you have a minimum budget?",
    a: "Most of our private journeys start around $4,800 per person, but we'll always be honest if your brief is better suited elsewhere.",
  },
  {
    q: "Can you combine Sri Lanka and the Maldives?",
    a: "Yes — our most-requested itineraries pair a week across Sri Lanka with three to five nights on a Maldivian atoll.",
  },
  {
    q: "What happens after I send this form?",
    a: "We read it, draft a written response, and send a 25-minute call invite if it makes sense. No automated funnels.",
  },
];

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

const SRI_LANKA_DESTINATIONS = [
  "All of Sri Lanka",
  "Cultural Triangle",
  "Tea Country",
  "South Coast",
  "Yala National Park",
  "Colombo City",
];

const MALDIVES_DESTINATIONS = [
  "All of Maldives",
  "North Malé Atoll",
  "South Malé Atoll",
  "Baa Atoll",
  "Ari Atoll",
];

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    mobileNo: "",
    email: "",
    adults: "2",
    children: "0",
    infants: "0",
    location: "Sri Lanka",
    destination: "All of Sri Lanka",
    travelDate: "",
    noOfNights: "7",
    description: "",
  });

  const handleLocationChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      location: val,
      destination:
        val === "Sri Lanka" ? SRI_LANKA_DESTINATIONS[0] : MALDIVES_DESTINATIONS[0],
    }));
  };

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

  const getReturnDate = () => {
    if (!form.travelDate || !form.noOfNights) return null;
    const date = new Date(form.travelDate);
    if (isNaN(date.getTime())) return null;
    date.setDate(date.getDate() + parseInt(form.noOfNights, 10));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "#07120E",
        color: "white",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" />

      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(900px 500px at 80% 20%, rgba(244,185,66,0.18), transparent 60%), radial-gradient(700px 450px at 10% 80%, rgba(137,243,255,0.14), transparent 60%)",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto px-8 pt-44 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
            style={{
              fontSize: 11,
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            <span>HOME</span>
            <span style={{ color: "#F4B942" }}>›</span>
            <span>CONTACT</span>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-12 items-end mt-10">
            <div className="md:col-span-8">
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <div
                  style={{
                    width: 40,
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, #F4B942)",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.4em",
                    color: "#F4B942",
                  }}
                >
                  THE CONCIERGE DESK
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8 }}
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(60px, 8.5vw, 124px)",
                  lineHeight: 0.94,
                  letterSpacing: "-0.04em",
                }}
              >
                Let's design{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(120deg, #F4B942 0%, #ffffff 50%, #89F3FF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontStyle: "italic",
                  }}
                >
                  your next
                </span>{" "}
                quiet escape.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-8 max-w-xl"
                style={{
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                Tell us a little about the trip you're imagining. A real
                designer — not a chatbot — will reply within four hours with a
                considered first draft.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="md:col-span-4"
            >
              <div
                className="rounded-[24px] border p-6"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  className="flex items-center gap-3 mb-4"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    color: "#89F3FF",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#89F3FF",
                      boxShadow: "0 0 12px #89F3FF",
                    }}
                  />
                  CONCIERGE ONLINE
                </div>
                <div
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 28,
                    lineHeight: 1.1,
                    color: "white",
                  }}
                >
                  4-hour response time
                </div>
                <p
                  className="mt-3"
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  During studio hours. Out-of-hours enquiries are answered by
                  the next morning in your timezone.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form + channels */}
      <section className="max-w-[1400px] mx-auto px-8 pb-32">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            onSubmit={(e) => e.preventDefault()}
            className="md:col-span-7 p-10 md:p-12 rounded-[32px] border"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <div
              className="flex items-center gap-3 mb-8"
              style={{
                fontSize: 11,
                letterSpacing: "0.4em",
                color: "#F4B942",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              YOUR BRIEF
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="First name *"
                value={form.firstName}
                onChange={(v) => setForm({ ...form, firstName: v })}
                placeholder="Anjali"
              />
              <Field
                label="Last name *"
                value={form.lastName}
                onChange={(v) => setForm({ ...form, lastName: v })}
                placeholder="Perera"
              />

              <SelectField
                label="Country *"
                value={form.country}
                onChange={handleCountryChange}
                options={[
                  { label: "Select Country", value: "" },
                  ...COUNTRIES.map((c) => ({ label: c.name, value: c.name })),
                ]}
              />
              <Field
                label="Mobile No *"
                value={form.mobileNo}
                onChange={(v) => setForm({ ...form, mobileNo: v })}
                placeholder="+94 77 123 4567"
              />

              <Field
                label="Email address *"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="anjali@email.com"
                type="email"
              />

              <div>
                <FieldLabel>No of guests *</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  <SelectField
                    value={form.adults}
                    onChange={(v) => setForm({ ...form, adults: v })}
                    options={Array.from({ length: 10 }, (_, i) => ({
                      label: `${i + 1} Adults`,
                      value: `${i + 1}`,
                    }))}
                  />
                  <SelectField
                    value={form.children}
                    onChange={(v) => setForm({ ...form, children: v })}
                    options={Array.from({ length: 10 }, (_, i) => ({
                      label: `${i} Kids`,
                      value: `${i}`,
                    }))}
                  />
                  <SelectField
                    value={form.infants}
                    onChange={(v) => setForm({ ...form, infants: v })}
                    options={Array.from({ length: 10 }, (_, i) => ({
                      label: `${i} Infants`,
                      value: `${i}`,
                    }))}
                  />
                </div>
              </div>

              <SelectField
                label="Location *"
                value={form.location}
                onChange={handleLocationChange}
                options={["Sri Lanka", "Maldives"]}
              />
              <SelectField
                label="Destination *"
                value={form.destination}
                onChange={(v) => setForm({ ...form, destination: v })}
                options={
                  form.location === "Sri Lanka"
                    ? SRI_LANKA_DESTINATIONS
                    : MALDIVES_DESTINATIONS
                }
              />

              <Field
                label="Travel date *"
                value={form.travelDate}
                onChange={(v) => setForm({ ...form, travelDate: v })}
                type="date"
                icon={Calendar}
              />

              <div>
                <SelectField
                  label="No of nights *"
                  value={form.noOfNights}
                  onChange={(v) => setForm({ ...form, noOfNights: v })}
                  options={Array.from({ length: 30 }, (_, i) => ({
                    label: `${i + 1} Nights`,
                    value: `${i + 1}`,
                  }))}
                />
                <AnimatePresence>
                  {getReturnDate() && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-2 text-right font-medium pr-1"
                      style={{ fontSize: 11, color: "#89F3FF" }}
                    >
                      Return date: {getReturnDate()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-6">
              <FieldLabel>Description (Optional)</FieldLabel>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="A honeymoon, a milestone, a slow family week — anything you'd like us to know."
                rows={5}
                className="w-full bg-transparent outline-none px-5 py-4 rounded-[18px] border placeholder:text-white/35 text-white resize-none"
                style={{
                  fontSize: 14,
                  borderColor: "rgba(255,255,255,0.14)",
                  background: "rgba(7,18,14,0.5)",
                }}
              />
            </div>

            <div className="mt-8 flex items-center justify-between gap-6 flex-wrap">
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.6,
                }}
              >
                We'll only use this to design your journey. No third-party
                sharing, ever.
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 pl-7 pr-3 py-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #F4B942, #E8A923)",
                  color: "#07120E",
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  boxShadow: "0 18px 50px rgba(244,185,66,0.35)",
                }}
              >
                INQUIRE NOW
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "#07120E", color: "#F4B942" }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </motion.button>
            </div>
          </motion.form>

          {/* Channels */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-5 flex flex-col gap-4"
          >
            <div
              className="p-8 rounded-[32px] border"
              style={{
                background:
                  "linear-gradient(180deg, rgba(244,185,66,0.10), rgba(7,18,14,0.6))",
                borderColor: "rgba(244,185,66,0.25)",
              }}
            >
              <div
                className="flex items-center gap-3 mb-3"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.4em",
                  color: "#F4B942",
                }}
              >
                PREFER TO TALK?
              </div>
              <div
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 28,
                  lineHeight: 1.15,
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                Three ways to reach a designer directly.
              </div>
            </div>

            {CHANNELS.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <motion.a
                  href="#"
                  key={ch.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
                  className="group flex items-center gap-5 p-6 rounded-[24px] border transition-colors hover:bg-white/5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.10)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${ch.accent}1f`,
                      border: `1px solid ${ch.accent}55`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: ch.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.3em",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {ch.label.toUpperCase()}
                    </div>
                    <div
                      className="mt-1 truncate"
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 19,
                        color: "white",
                      }}
                    >
                      {ch.value}
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {ch.note}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 45 }}
                    transition={{ duration: 0.35 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center border shrink-0"
                    style={{
                      borderColor: "rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Offices */}
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
              <div
                style={{
                  width: 40,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, #89F3FF)",
                }}
              />
              WHERE WE WORK
            </div>
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(40px, 5vw, 64px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Three studios,{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, #F4B942, #ffffff, #89F3FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                one team.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {OFFICES.map((office, i) => (
            <motion.div
              key={office.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group rounded-[24px] overflow-hidden border"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={office.image}
                  alt={office.city}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(7,18,14,0.85) 100%)",
                  }}
                />
                <div
                  className="absolute top-4 left-4"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 12,
                    letterSpacing: "0.3em",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  0{i + 1}
                </div>
                <div className="absolute bottom-5 left-5">
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.3em",
                      color: "#89F3FF",
                    }}
                  >
                    {office.country.toUpperCase()}
                  </div>
                  <div
                    className="mt-1"
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 30,
                      lineHeight: 1,
                      color: "white",
                    }}
                  >
                    {office.city}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div
                  className="flex items-start gap-3 mb-4"
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}
                >
                  <MapPin
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: "#F4B942" }}
                  />
                  {office.address}
                </div>
                <div
                  className="flex items-center gap-3"
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}
                >
                  <Clock
                    className="w-4 h-4 shrink-0"
                    style={{ color: "#F4B942" }}
                  />
                  {office.hours}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1400px] mx-auto px-8 pb-32">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 md:sticky md:top-32 self-start">
            <div
              className="flex items-center gap-3 mb-5"
              style={{
                fontSize: 11,
                letterSpacing: "0.4em",
                color: "#F4B942",
              }}
            >
              QUESTIONS, ANSWERED
            </div>
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(36px, 4.5vw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Before you{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, #F4B942, #ffffff, #89F3FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                send the form.
              </span>
            </h2>
          </div>
          <div className="md:col-span-8">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="border-t last:border-b py-6"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-6 text-left"
                  >
                    <div
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 22,
                        lineHeight: 1.25,
                        color: "white",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {faq.q}
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border shrink-0"
                      style={{
                        borderColor: "rgba(244,185,66,0.4)",
                        color: "#F4B942",
                      }}
                    >
                      {open ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p
                          className="mt-5 max-w-2xl"
                          style={{
                            fontSize: 15,
                            lineHeight: 1.7,
                            color: "rgba(255,255,255,0.65)",
                          }}
                        >
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block mb-2"
      style={{
        fontSize: 10,
        letterSpacing: "0.3em",
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: any;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div
        className="flex items-center gap-3 px-5 py-3.5 rounded-[18px] border"
        style={{
          background: "rgba(7,18,14,0.5)",
          borderColor: "rgba(255,255,255,0.14)",
        }}
      >
        {Icon && (
          <Icon
            className="w-4 h-4 shrink-0"
            style={{ color: "rgba(255,255,255,0.5)" }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent outline-none flex-1 placeholder:text-white/35 text-white [color-scheme:dark]"
          style={{ fontSize: 14 }}
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
        className="flex items-center gap-3 px-5 py-3.5 rounded-[18px] border"
        style={{
          background: "rgba(7,18,14,0.5)",
          borderColor: "rgba(255,255,255,0.14)",
        }}
      >
        {Icon && (
          <Icon
            className="w-4 h-4 shrink-0"
            style={{ color: "rgba(255,255,255,0.5)" }}
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none flex-1 text-white appearance-none cursor-pointer"
          style={{ fontSize: 14 }}
        >
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val} style={{ background: "#07120E" }}>
                {lbl}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
