"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import axios from "axios";
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Calendar,
  Users,
  Check,
  X,
  Star,
  Sparkles,
  ChevronRight,
  Heart,
  Share2,
  Compass,
  Award,
  Headphones,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { AnimatePresence } from "motion/react";

const COUNTRIES = [
  { name: 'Afghanistan', code: '+93' }, { name: 'Albania', code: '+355' }, { name: 'Algeria', code: '+213' },
  { name: 'American Samoa', code: '+1-684' }, { name: 'Andorra', code: '+376' }, { name: 'Angola', code: '+244' },
  { name: 'Anguilla', code: '+1-264' }, { name: 'Antigua and Barbuda', code: '+1-268' }, { name: 'Argentina', code: '+54' },
  { name: 'Armenia', code: '+374' }, { name: 'Aruba', code: '+297' }, { name: 'Australia', code: '+61' },
  { name: 'Austria', code: '+43' }, { name: 'Azerbaijan', code: '+994' }, { name: 'Bahamas', code: '+1-242' },
  { name: 'Bahrain', code: '+973' }, { name: 'Bangladesh', code: '+880' }, { name: 'Barbados', code: '+1-246' },
  { name: 'Belarus', code: '+375' }, { name: 'Belgium', code: '+32' }, { name: 'Belize', code: '+501' },
  { name: 'Benin', code: '+229' }, { name: 'Bermuda', code: '+1-441' }, { name: 'Bhutan', code: '+975' },
  { name: 'Bolivia', code: '+591' }, { name: 'Bosnia and Herzegovina', code: '+387' }, { name: 'Botswana', code: '+267' },
  { name: 'Brazil', code: '+55' }, { name: 'British Indian Ocean Territory', code: '+246' }, { name: 'British Virgin Islands', code: '+1-284' },
  { name: 'Brunei', code: '+673' }, { name: 'Bulgaria', code: '+359' }, { name: 'Burkina Faso', code: '+226' },
  { name: 'Burundi', code: '+257' }, { name: 'Cambodia', code: '+855' }, { name: 'Cameroon', code: '+237' },
  { name: 'Canada', code: '+1' }, { name: 'Cape Verde', code: '+238' }, { name: 'Cayman Islands', code: '+1-345' },
  { name: 'Central African Republic', code: '+236' }, { name: 'Chad', code: '+235' }, { name: 'Chile', code: '+56' },
  { name: 'China', code: '+86' }, { name: 'Christmas Island', code: '+61' }, { name: 'Cocos Islands', code: '+61' },
  { name: 'Colombia', code: '+57' }, { name: 'Comoros', code: '+269' }, { name: 'Cook Islands', code: '+682' },
  { name: 'Costa Rica', code: '+506' }, { name: 'Croatia', code: '+385' }, { name: 'Cuba', code: '+53' },
  { name: 'Curacao', code: '+599' }, { name: 'Cyprus', code: '+357' }, { name: 'Czech Republic', code: '+420' },
  { name: 'Democratic Republic of the Congo', code: '+243' }, { name: 'Denmark', code: '+45' }, { name: 'Djibouti', code: '+253' },
  { name: 'Dominica', code: '+1-767' }, { name: 'Dominican Republic', code: '+1-809' }, { name: 'East Timor', code: '+670' },
  { name: 'Ecuador', code: '+593' }, { name: 'Egypt', code: '+20' }, { name: 'El Salvador', code: '+503' },
  { name: 'Equatorial Guinea', code: '+240' }, { name: 'Eritrea', code: '+291' }, { name: 'Estonia', code: '+372' },
  { name: 'Ethiopia', code: '+251' }, { name: 'Falkland Islands', code: '+500' }, { name: 'Faroe Islands', code: '+298' },
  { name: 'Fiji', code: '+679' }, { name: 'Finland', code: '+358' }, { name: 'France', code: '+33' },
  { name: 'French Polynesia', code: '+689' }, { name: 'Gabon', code: '+241' }, { name: 'Gambia', code: '+220' },
  { name: 'Georgia', code: '+995' }, { name: 'Germany', code: '+49' }, { name: 'Ghana', code: '+233' },
  { name: 'Gibraltar', code: '+350' }, { name: 'Greece', code: '+30' }, { name: 'Greenland', code: '+299' },
  { name: 'Grenada', code: '+1-473' }, { name: 'Guam', code: '+1-671' }, { name: 'Guatemala', code: '+502' },
  { name: 'Guernsey', code: '+44-1481' }, { name: 'Guinea', code: '+224' }, { name: 'Guinea-Bissau', code: '+245' },
  { name: 'Guyana', code: '+592' }, { name: 'Haiti', code: '+509' }, { name: 'Honduras', code: '+504' },
  { name: 'Hong Kong', code: '+852' }, { name: 'Hungary', code: '+36' }, { name: 'Iceland', code: '+354' },
  { name: 'India', code: '+91' }, { name: 'Indonesia', code: '+62' }, { name: 'Iran', code: '+98' },
  { name: 'Iraq', code: '+964' }, { name: 'Ireland', code: '+353' }, { name: 'Isle of Man', code: '+44-1624' },
  { name: 'Israel', code: '+972' }, { name: 'Italy', code: '+39' }, { name: 'Ivory Coast', code: '+225' },
  { name: 'Jamaica', code: '+1-876' }, { name: 'Japan', code: '+81' }, { name: 'Jersey', code: '+44-1534' },
  { name: 'Jordan', code: '+962' }, { name: 'Kazakhstan', code: '+7' }, { name: 'Kenya', code: '+254' },
  { name: 'Kiribati', code: '+686' }, { name: 'Kosovo', code: '+383' }, { name: 'Kuwait', code: '+965' },
  { name: 'Kyrgyzstan', code: '+996' }, { name: 'Laos', code: '+856' }, { name: 'Latvia', code: '+371' },
  { name: 'Lebanon', code: '+961' }, { name: 'Lesotho', code: '+266' }, { name: 'Liberia', code: '+231' },
  { name: 'Libya', code: '+218' }, { name: 'Liechtenstein', code: '+423' }, { name: 'Lithuania', code: '+370' },
  { name: 'Luxembourg', code: '+352' }, { name: 'Macao', code: '+853' }, { name: 'Macedonia', code: '+389' },
  { name: 'Madagascar', code: '+261' }, { name: 'Malawi', code: '+265' }, { name: 'Malaysia', code: '+60' },
  { name: 'Maldives', code: '+960' }, { name: 'Mali', code: '+223' }, { name: 'Malta', code: '+356' },
  { name: 'Marshall Islands', code: '+692' }, { name: 'Mauritania', code: '+222' }, { name: 'Mauritius', code: '+230' },
  { name: 'Mayotte', code: '+262' }, { name: 'Mexico', code: '+52' }, { name: 'Micronesia', code: '+691' },
  { name: 'Moldova', code: '+373' }, { name: 'Monaco', code: '+377' }, { name: 'Mongolia', code: '+976' },
  { name: 'Montenegro', code: '+382' }, { name: 'Montserrat', code: '+1-664' }, { name: 'Morocco', code: '+212' },
  { name: 'Mozambique', code: '+258' }, { name: 'Myanmar', code: '+95' }, { name: 'Namibia', code: '+264' },
  { name: 'Nauru', code: '+674' }, { name: 'Nepal', code: '+977' }, { name: 'Netherlands', code: '+31' },
  { name: 'Netherlands Antilles', code: '+599' }, { name: 'New Caledonia', code: '+687' }, { name: 'New Zealand', code: '+64' },
  { name: 'Nicaragua', code: '+505' }, { name: 'Niger', code: '+227' }, { name: 'Nigeria', code: '+234' },
  { name: 'Niue', code: '+683' }, { name: 'North Korea', code: '+850' }, { name: 'Northern Mariana Islands', code: '+1-670' },
  { name: 'Norway', code: '+47' }, { name: 'Oman', code: '+968' }, { name: 'Pakistan', code: '+92' },
  { name: 'Palau', code: '+680' }, { name: 'Palestine', code: '+970' }, { name: 'Panama', code: '+507' },
  { name: 'Papua New Guinea', code: '+675' }, { name: 'Paraguay', code: '+595' }, { name: 'Peru', code: '+51' },
  { name: 'Philippines', code: '+63' }, { name: 'Pitcairn', code: '+870' }, { name: 'Poland', code: '+48' },
  { name: 'Portugal', code: '+351' }, { name: 'Puerto Rico', code: '+1-787' }, { name: 'Qatar', code: '+974' },
  { name: 'Republic of the Congo', code: '+242' }, { name: 'Reunion', code: '+262' }, { name: 'Romania', code: '+40' },
  { name: 'Russia', code: '+7' }, { name: 'Rwanda', code: '+250' }, { name: 'Saint Barthelemy', code: '+590' },
  { name: 'Saint Helena', code: '+290' }, { name: 'Saint Kitts and Nevis', code: '+1-869' }, { name: 'Saint Lucia', code: '+1-758' },
  { name: 'Saint Martin', code: '+590' }, { name: 'Saint Pierre and Miquelon', code: '+508' }, { name: 'Saint Vincent and the Grenadines', code: '+1-784' },
  { name: 'Samoa', code: '+685' }, { name: 'San Marino', code: '+378' }, { name: 'Sao Tome and Principe', code: '+239' },
  { name: 'Saudi Arabia', code: '+966' }, { name: 'Senegal', code: '+221' }, { name: 'Serbia', code: '+381' },
  { name: 'Seychelles', code: '+248' }, { name: 'Sierra Leone', code: '+232' }, { name: 'Singapore', code: '+65' },
  { name: 'Sint Maarten', code: '+1-721' }, { name: 'Slovakia', code: '+421' }, { name: 'Slovenia', code: '+386' },
  { name: 'Solomon Islands', code: '+677' }, { name: 'Somalia', code: '+252' }, { name: 'South Africa', code: '+27' },
  { name: 'South Korea', code: '+82' }, { name: 'South Sudan', code: '+211' }, { name: 'Spain', code: '+34' },
  { name: 'Sri Lanka', code: '+94' }, { name: 'Sudan', code: '+249' }, { name: 'Suriname', code: '+597' },
  { name: 'Svalbard and Jan Mayen', code: '+47' }, { name: 'Swaziland', code: '+268' }, { name: 'Sweden', code: '+46' },
  { name: 'Switzerland', code: '+41' }, { name: 'Syria', code: '+963' }, { name: 'Taiwan', code: '+886' },
  { name: 'Tajikistan', code: '+992' }, { name: 'Tanzania', code: '+255' }, { name: 'Thailand', code: '+66' },
  { name: 'Togo', code: '+228' }, { name: 'Tokelau', code: '+690' }, { name: 'Tonga', code: '+676' },
  { name: 'Trinidad and Tobago', code: '+1-868' }, { name: 'Tunisia', code: '+216' }, { name: 'Turkey', code: '+90' },
  { name: 'Turkmenistan', code: '+993' }, { name: 'Turks and Caicos Islands', code: '+1-649' }, { name: 'Tuvalu', code: '+688' },
  { name: 'U.S. Virgin Islands', code: '+1-340' }, { name: 'Uganda', code: '+256' }, { name: 'Ukraine', code: '+380' },
  { name: 'United Arab Emirates', code: '+971' }, { name: 'United Kingdom', code: '+44' }, { name: 'United States', code: '+1' },
  { name: 'Uruguay', code: '+598' }, { name: 'Uzbekistan', code: '+998' }, { name: 'Vanuatu', code: '+678' },
  { name: 'Vatican', code: '+379' }, { name: 'Venezuela', code: '+58' }, { name: 'Vietnam', code: '+84' },
  { name: 'Wallis and Futuna', code: '+681' }, { name: 'Western Sahara', code: '+212' }, { name: 'Yemen', code: '+967' },
  { name: 'Zambia', code: '+260' }, { name: 'Zimbabwe', code: '+263' }, { name: 'Other', code: '' }
];

export function TourClientContent({ tour }: { tour: any }) {
  const [activeDay, setActiveDay] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    mobileNo: "",
    adults: "2",
    children: "0",
    infants: "0",
    package: tour ? tour.name : "",
    travelDate: "",
    noOfNights: "7",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formEl = e.currentTarget as HTMLFormElement;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }
    setFormError("");
    setIsSubmitting(true);
    try {
      await axios.post("/api/inquiries", {
        source: "tour",
        packageName: form.package,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        country: form.country,
        mobileNo: form.mobileNo,
        adults: form.adults,
        children: form.children,
        infants: form.infants,
        travelDate: form.travelDate,
        noOfNights: form.noOfNights,
        description: form.description,
      });
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err: any) {
      setFormError(err?.response?.data?.error || "Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
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

  if (!tour) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center"
        style={{ background: "#07120E", color: "white" }}
      >
        <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" />
        <div className="text-center px-8">
          <div
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 60,
              letterSpacing: "-0.02em",
            }}
          >
            Tour not found
          </div>
          <p
            className="mt-4 mb-8"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}
          >
            That itinerary may have moved. Browse our current Sri Lanka tours.
          </p>
          <Link
            href="/journeys"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: "linear-gradient(135deg, #F4B942, #E8A923)",
              color: "#07120E",
              fontSize: 13,
              letterSpacing: "0.15em",
            }}
          >
            BACK TO JOURNEYS
          </Link>
        </div>
      </div>
    );
  }

  const days = parseInt(tour.duration);
  const fillRelated: any[] = [];

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

      {/* HERO */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "92vh" }}>
        <div className="absolute inset-0">
          <ImageWithFallback
            src={tour.image}
            alt={tour.name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(7,18,14,0.55) 0%, rgba(7,18,14,0.3) 40%, rgba(7,18,14,0.96) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(800px 500px at 80% 20%, rgba(244,185,66,0.18), transparent 60%), radial-gradient(700px 400px at 15% 80%, rgba(137,243,255,0.12), transparent 60%)",
            }}
          />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-8 pt-32 md:pt-44 pb-16">
          {/* breadcrumbs */}
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
            <ChevronRight className="w-3 h-3" style={{ color: "#F4B942" }} />
            <Link
              href="/journeys"
              className="hover:text-white transition-colors"
            >
              JOURNEYS
            </Link>
            <ChevronRight className="w-3 h-3" style={{ color: "#F4B942" }} />
            <span style={{ color: "white" }}>{tour.name.toUpperCase()}</span>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-10 items-end mt-12">
            <div className="md:col-span-8">
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="flex items-center gap-3 mb-6 flex-wrap"
              >
                <span
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(244,185,66,0.95)",
                    color: "#07120E",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                  }}
                >
                  {tour.tag.toUpperCase()}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8 }}
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(36px, 4.5vw, 64px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                }}
              >
                {tour.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="hidden md:block mt-8 max-w-2xl"
                style={{
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                {tour.dek}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="mt-6 md:mt-10 flex items-center gap-4 md:gap-8 flex-wrap"
              >
                {[
                  { icon: Clock, label: tour.duration },
                  { icon: Users, label: tour.guests ? `Up to ${tour.guests} guests` : "Flexible group size" },
                  { icon: MapPin, label: tour.places },
                ].map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3"
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.78)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "#F4B942" }} />
                      {m.label}
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Floating booking card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="md:col-span-4 p-5 md:p-7 rounded-[28px] border"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(7,18,14,0.7))",
                borderColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
              }}
            >
              <div className="mb-6" style={{ color: "white" }}>
                <span
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 32,
                    lineHeight: 1,
                    letterSpacing: "0.04em",
                  }}
                >
                  RATE ON REQUEST
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="First name"
                    value={form.firstName}
                    onChange={(v) => setForm({ ...form, firstName: v })}
                    placeholder="First name"
                    minLength={2}
                  />
                  <Field
                    label="Last name"
                    value={form.lastName}
                    onChange={(v) => setForm({ ...form, lastName: v })}
                    placeholder="Last name"
                    minLength={2}
                  />
                </div>

                <Field
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  placeholder="Email address"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    type="tel"
                    value={form.mobileNo}
                    onChange={(v) => {
                      const numericValue = v.replace(/[^0-9+\s-]/g, "");
                      setForm({ ...form, mobileNo: numericValue });
                    }}
                    placeholder="Mobile number"
                    pattern="^[+0-9 ]+$"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <SelectField
                    label="Adults"
                    value={form.adults}
                    onChange={(v) => setForm({ ...form, adults: v })}
                    options={Array.from({ length: 50 }, (_, i) => ({
                      label: String(i + 1),
                      value: String(i + 1),
                    }))}
                  />
                  <SelectField
                    label="Children"
                    value={form.children}
                    onChange={(v) => setForm({ ...form, children: v })}
                    options={Array.from({ length: 21 }, (_, i) => ({
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
                  placeholder="Tour Name"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Travel date"
                    type="date"
                    icon={Calendar}
                    value={form.travelDate}
                    onChange={(v) => setForm({ ...form, travelDate: v })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <SelectField
                    label="No of nights"
                    value={form.noOfNights}
                    onChange={(v) => setForm({ ...form, noOfNights: v })}
                    options={Array.from({ length: 50 }, (_, i) => ({
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
                      background: "rgba(7,18,14,0.5)",
                      borderColor: "rgba(244,185,66,0.14)",
                    }}
                  />
                </div>

                <motion.button
                  whileHover={!isSubmitting && !formSuccess ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting && !formSuccess ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={isSubmitting || formSuccess}
                  className="mt-6 w-full flex items-center justify-center gap-3 py-3.5 rounded-full disabled:opacity-80"
                  style={{
                    background: formSuccess ? "#22c55e" : "linear-gradient(135deg, #F4B942, #E8A923)",
                    color: formSuccess ? "#fff" : "#07120E",
                    fontSize: 13,
                    letterSpacing: "0.18em",
                    boxShadow: formSuccess ? "0 18px 50px rgba(34,197,94,0.35)" : "0 18px 50px rgba(244,185,66,0.35)",
                  }}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#07120E]/30 border-t-[#07120E] rounded-full animate-spin" />
                  ) : formSuccess ? (
                    <>
                      SENT SUCCESSFULLY
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      INQUIRE NOW
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
                {formError && (
                  <div
                    className="mt-3 text-center"
                    style={{ fontSize: 12, color: "#f87171" }}
                  >
                    {formError}
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS STRIP */}
      {tour.highlights && tour.highlights.length > 0 && (
      <section className="max-w-[1400px] mx-auto px-8 -mt-12 relative z-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap justify-evenly items-center gap-8 p-6 md:p-8 md:px-12 rounded-[32px] border"
          style={{
            background:
              "linear-gradient(135deg, rgba(244,185,66,0.10) 0%, rgba(7,18,14,0.8) 50%, rgba(137,243,255,0.08) 100%)",
            borderColor: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
          }}
        >
          {tour.highlights.slice(0, 4).map((h: string, i: number) => (
            <div key={i} className="flex items-center gap-4 w-full md:max-w-[280px]">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(244,185,66,0.25), rgba(137,243,255,0.15))",
                  border: "1px solid rgba(244,185,66,0.35)",
                  fontFamily: "'Clash Display', sans-serif",
                  color: "#F4B942",
                  fontSize: 14,
                  letterSpacing: "0.05em",
                }}
              >
                0{i + 1}
              </div>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.4,
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 500,
                }}
              >
                {h}
              </div>
            </div>
          ))}
        </motion.div>
      </section>
      )}

      {/* ITINERARY */}
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
              <div
                style={{
                  width: 40,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, #F4B942)",
                }}
              />
              DAY BY DAY
            </div>
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(40px, 4.5vw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {days} considered{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, #F4B942, #ffffff, #89F3FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                days.
              </span>
            </h2>
            <p
              className="mt-5"
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.62)",
              }}
            >
              A draft itinerary — every line below is a starting point we'll
              rewrite around your pace, interests and dates.
            </p>

            {/* Day picker */}
            <div className="mt-8 flex flex-wrap gap-2">
              {tour.itinerary.map((_, i) => {
                const active = activeDay === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    className="w-11 h-11 rounded-full border flex items-center justify-center transition-all"
                    style={{
                      background: active
                        ? "linear-gradient(135deg, #F4B942, #E8A923)"
                        : "rgba(255,255,255,0.04)",
                      borderColor: active
                        ? "transparent"
                        : "rgba(255,255,255,0.15)",
                      color: active ? "#07120E" : "rgba(255,255,255,0.75)",
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 13,
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-8 relative">
            <div
              className="absolute left-4 top-2 bottom-2 w-px"
              style={{
                background:
                  "linear-gradient(180deg, rgba(244,185,66,0.5), rgba(137,243,255,0.3), transparent)",
              }}
            />
            {tour.itinerary.map((d, i) => {
              const active = activeDay === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  onMouseEnter={() => setActiveDay(i)}
                  className="relative pl-14 pb-10 last:pb-0 cursor-pointer"
                >
                  <div
                    className="absolute left-2 top-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: active ? "#F4B942" : "#07120E",
                      border: `2px solid ${active ? "#F4B942" : "rgba(244,185,66,0.5)"}`,
                      boxShadow: active ? "0 0 0 6px rgba(244,185,66,0.18)" : "none",
                    }}
                  >
                    {active && (
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#07120E" }}
                      />
                    )}
                  </div>
                  <div
                    className="flex items-center gap-3 mb-2"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.3em",
                      color: active ? "#F4B942" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {d.day.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 26,
                      lineHeight: 1.2,
                      letterSpacing: "-0.01em",
                      color: "white",
                    }}
                  >
                    {d.title}
                  </div>
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p
                          className="max-w-2xl"
                          style={{
                            fontSize: 15,
                            lineHeight: 1.7,
                            color: "rgba(255,255,255,0.65)",
                          }}
                        >
                          {d.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INCLUDES / EXCLUDES + GALLERY */}
      <section className="max-w-[1400px] mx-auto px-8 pb-32">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7 grid md:grid-cols-2 gap-5">
            <Panel title="What's included" accent="#F4B942" items={tour.includes} positive />
            <Panel title="Not included" accent="#89F3FF" items={tour.excludes} />
          </div>

          <div className="md:col-span-5">
            <div
              className="p-8 rounded-[28px] border h-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(244,185,66,0.10), rgba(7,18,14,0.6))",
                borderColor: "rgba(244,185,66,0.25)",
              }}
            >
              <Sparkles
                className="w-5 h-5 mb-5"
                style={{ color: "#F4B942" }}
              />
              <h3
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 28,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                Want it{" "}
                <span style={{ color: "#F4B942", fontStyle: "italic" }}>
                  longer, slower or wilder?
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
                Every Normadic itinerary is a draft. Add a private island finale,
                stretch the hill country, swap a city for a beach — your
                designer will rewrite it in 24 hours.
              </p>
              <Link
                href="/plan-trip"
                className="mt-7 inline-flex items-center gap-3 pl-6 pr-3 py-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #F4B942, #E8A923)",
                  color: "#07120E",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                }}
              >
                REQUEST A REWRITE
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "#07120E", color: "#F4B942" }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY (optional) */}
      {tour.gallery && tour.gallery.length > 0 && (
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
                FROM THE ROAD
              </div>
              <h2
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(36px, 4vw, 54px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                A few frames from{" "}
                <span style={{ color: "#F4B942", fontStyle: "italic" }}>
                  the trip.
                </span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tour.gallery.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="overflow-hidden rounded-[24px] group"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <ImageWithFallback
                  src={src}
                  alt={`${tour.name} ${i + 1}`}
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
              YOU MIGHT ALSO LIKE
            </div>
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(36px, 4.5vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Other journeys in{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, #F4B942, #ffffff, #89F3FF)",
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
          {fillRelated.map((t) => (
            <Link
              href={`/tours/${t.slug}`}
              key={t.slug}
              className="group"
            >
              <div
                className="relative overflow-hidden rounded-[24px] mb-5"
                style={{
                  height: 340,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <ImageWithFallback
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(7,18,14,0.85) 100%)",
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(7,18,14,0.7)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      fontSize: 10,
                      letterSpacing: "0.25em",
                      color: "#89F3FF",
                    }}
                  >
                    {t.duration.toUpperCase()}
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
                    FROM ${t.price}/PP
                  </div>
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 24,
                      lineHeight: 1.15,
                      color: "white",
                    }}
                  >
                    {t.name}
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
  required = true,
  min,
  minLength,
  pattern,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: any;
  className?: string;
  readOnly?: boolean;
  required?: boolean;
  min?: string;
  minLength?: number;
  pattern?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-[12px] border"
        style={{
          background: "rgba(7,18,14,0.5)",
          borderColor: "rgba(244,185,66,0.14)",
        }}
      >
        {Icon && (
          <Icon
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "rgba(244,185,66,0.5)" }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          min={min}
          minLength={minLength}
          pattern={pattern}
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
  required = true,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { label: string; value: string })[];
  icon?: any;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={className}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-[12px] border"
        style={{
          background: "rgba(7,18,14,0.5)",
          borderColor: "rgba(244,185,66,0.14)",
        }}
      >
        {Icon && (
          <Icon
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "rgba(244,185,66,0.5)" }}
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="bg-transparent outline-none flex-1 text-white appearance-none cursor-pointer min-w-0"
          style={{ fontSize: 13 }}
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
        borderColor: "rgba(255,255,255,0.10)",
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
