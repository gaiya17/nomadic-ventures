"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import axios from "axios";
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
  Utensils,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PageLoader } from "@/components/PageLoader";
import { computeDiscountedPrice, computePackageSavings, getOfferBadgeLabel } from "@/lib/offers";

const numberToWords = (num: number) => {
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];
  return words[num] || num.toString();
};

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

export function ResortClientContent({ resort, relatedResorts }: { resort: any; relatedResorts: any[] }) {
  const router = useRouter();
  const [activeExp, setActiveExp] = useState(0);
  const [activeVilla, setActiveVilla] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
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
    villaType: "",
    travelDate: "",
    noOfNights: "7",
    description: "",
  });

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
            href="/maldives-resort"
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

  const fillRelated = relatedResorts;
  const discountedPrice = computeDiscountedPrice(resort.price, resort.offer);
  const packageSavings = computePackageSavings(resort.price, resort.offer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formEl = e.currentTarget as HTMLFormElement;
    if (formEl.checkValidity()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setFormSuccess(true);
        setTimeout(() => setFormSuccess(false), 5000);
      }, 1500);
    } else {
      formEl.reportValidity();
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

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-8 pt-32 md:pt-44 pb-16">
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
              href="/maldives-resort"
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
                  {resort.stars || 5} STAR RESORT
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
                className="hidden md:block w-full pr-4 xl:pr-12"
                style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.68)",
                }}
              >
                {resort.dek}
              </motion.p>
            </div>

            {/* Booking card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="md:col-span-4 p-5 md:p-7 rounded-[28px] border"
              style={{
                background:
                  "linear-gradient(180deg, rgba(137,243,255,0.10), rgba(2,24,48,0.7))",
                borderColor: "rgba(137,243,255,0.25)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 30px 80px rgba(0,15,40,0.5)",
              }}
            >
              <div className="mb-6">
                {resort.offer && (
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full mb-3"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      background: "rgba(244,185,66,0.15)",
                      border: "1px solid rgba(244,185,66,0.4)",
                      color: "#F4B942",
                    }}
                  >
                    {getOfferBadgeLabel(resort.offer)}
                  </span>
                )}

                {resort.offer?.type === "FIXED_PACKAGE" ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span
                        style={{
                          fontFamily: "'Clash Display', sans-serif",
                          fontSize: 44,
                          lineHeight: 1,
                          color: "white",
                        }}
                      >
                        ${resort.offer.packagePrice?.toLocaleString()}
                      </span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                        for {resort.offer.packageNights} Nights
                      </span>
                    </div>
                    {packageSavings && (
                      <p style={{ fontSize: 12, color: "#89F3FF", marginTop: 6 }}>
                        You save ${packageSavings.savings.toLocaleString()} vs. the regular nightly rate
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.55)",
                        letterSpacing: "0.2em",
                      }}
                    >
                      FROM
                    </span>
                    {discountedPrice !== null && (
                      <span
                        style={{
                          fontSize: 20,
                          color: "rgba(255,255,255,0.4)",
                          textDecoration: "line-through",
                        }}
                      >
                        ${resort.price}
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: "'Clash Display', sans-serif",
                        fontSize: 44,
                        lineHeight: 1,
                        color: "white",
                      }}
                    >
                      ${discountedPrice !== null ? discountedPrice : resort.price}
                    </span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                      / night
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Resort Name"
                />

                <SelectField
                  label="Villa Type"
                  value={form.villaType}
                  onChange={(v) => setForm({ ...form, villaType: v })}
                  options={[
                    { label: "Any Villa Type", value: "Any Villa Type" },
                    ...(resort.villaTypes?.map((v: any) => ({
                      label: v.name,
                      value: v.name,
                    })) || []),
                  ]}
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
                      background: "rgba(2,24,48,0.5)",
                      borderColor: "rgba(137,243,255,0.14)",
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
                    background: formSuccess ? "#22c55e" : "linear-gradient(135deg, #89F3FF, #5BD4E5)",
                    color: formSuccess ? "#fff" : "#021830",
                    fontSize: 13,
                    letterSpacing: "0.18em",
                    boxShadow: formSuccess ? "0 18px 50px rgba(34,197,94,0.35)" : "0 18px 50px rgba(137,243,255,0.35)",
                  }}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#021830]/30 border-t-[#021830] rounded-full animate-spin" />
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
          className="grid md:grid-cols-3 gap-8 p-8 rounded-[32px] border"
          style={{
            background:
              "linear-gradient(135deg, rgba(137,243,255,0.10) 0%, rgba(2,24,48,0.85) 50%, rgba(244,185,66,0.06) 100%)",
            borderColor: "rgba(137,243,255,0.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          {[
            { label: "Location", value: resort.atoll },
            { label: "Transfer Method", value: resort.transfer || "Seaplane / Speedboat" },
            { label: "Duration", value: resort.duration?.toString().toLowerCase().includes("min") ? resort.duration : `${resort.duration} Mins` }
          ].map((item, i) => (
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
              <div className="flex flex-col pt-0.5">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#F4B942] mb-1 font-bold">
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "rgba(255,255,255,0.95)",
                    fontWeight: 500
                  }}
                >
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
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
              {numberToWords(resort.villaTypes?.length || 0)} villa{" "}
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

        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 flex flex-col">
            {resort.villaTypes.map((v: any, i: number) => {
              const active = activeVilla === i;
              return (
                <button
                  key={v.name}
                  onMouseEnter={() => setActiveVilla(i)}
                  onClick={() => setActiveVilla(i)}
                  className="group grid grid-cols-12 gap-4 py-6 text-left border-t last:border-b items-center"
                  style={{ borderColor: "rgba(244,185,66,0.12)" }}
                >
                  <div
                    className="col-span-1"
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: 16,
                      letterSpacing: "0.2em",
                      color: active ? "#F4B942" : "rgba(255,255,255,0.35)",
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
                      {v.name}
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
                          ? "#F4B942"
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
            key={activeVilla}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 relative overflow-hidden rounded-[32px] border"
            style={{ minHeight: 520, borderColor: "rgba(255,255,255,0.1)" }}
          >
            <ImageWithFallback
              src={resort.villaTypes[activeVilla].image || resort.image}
              alt={resort.villaTypes[activeVilla].name}
              className="absolute inset-0 w-full h-[60%] object-cover"
            />
            <div
              className="absolute inset-0 h-[65%]"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(3,36,64,1) 100%)",
              }}
            />
            
            <div className="absolute bottom-0 left-0 right-0 h-[45%] p-8 flex flex-col justify-end" style={{ background: "rgba(3,36,64,1)" }}>
              <div
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: 28,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  color: "white",
                  marginBottom: 12
                }}
              >
                {resort.villaTypes[activeVilla].name}
              </div>
              <p
                className="mb-6"
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {resort.villaTypes[activeVilla].description}
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div>
                  <div className="text-[10px] tracking-widest text-[#F4B942] uppercase font-bold mb-1">Room Size</div>
                  <div className="text-white text-sm font-medium">{resort.villaTypes[activeVilla].size?.toString().toLowerCase().includes("m") || resort.villaTypes[activeVilla].size?.toString().toLowerCase().includes("sq") ? resort.villaTypes[activeVilla].size : `${resort.villaTypes[activeVilla].size} m²`}</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-widest text-[#F4B942] uppercase font-bold mb-1">Capacity</div>
                  <div className="text-white text-sm font-medium">{resort.villaTypes[activeVilla].capacity}</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-widest text-[#F4B942] uppercase font-bold mb-1">Bed Type</div>
                  <div className="text-white text-sm font-medium">{resort.villaTypes[activeVilla].bedType}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RESTAURANTS */}
      <section className="max-w-[1400px] mx-auto px-8 pb-32">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
          <div>
            <div
              className="flex items-center gap-3 mb-5"
              style={{
                fontSize: 11,
                letterSpacing: "0.4em",
                color: "#89F3FF",
              }}
            >
              <Utensils className="w-3.5 h-3.5" />
              DINING & CULINARY
            </div>
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(40px, 4.5vw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Exceptional{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, #89F3FF, #ffffff, #F4B942)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                restaurants.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {resort.restaurants?.map((rest, i) => (
            <motion.div
              key={rest.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="rounded-[28px] overflow-hidden border flex flex-col"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(137,243,255,0.12)",
              }}
            >
              <div className="relative h-60 w-full overflow-hidden">
                <ImageWithFallback
                  src={rest.image}
                  alt={rest.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div 
                  className="absolute inset-0" 
                  style={{ background: "linear-gradient(180deg, transparent 50%, rgba(2,24,48,1) 100%)" }}
                />
              </div>
              <div className="p-7 flex flex-col flex-1" style={{ background: "rgba(2,24,48,0.5)" }}>
                <h3 
                  className="mb-3"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: 24,
                    color: "white",
                    lineHeight: 1.2
                  }}
                >
                  {rest.name}
                </h3>
                <p 
                  className="mb-6 flex-1"
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {rest.description}
                </p>
                {rest.timing && rest.timing !== "Flexible" && (
                  <div className="pt-4 border-t flex flex-col gap-2.5" style={{ borderColor: "rgba(137,243,255,0.15)" }}>
                    {rest.timing.split(" | ").map((t: string, idx: number) => {
                      const colonIdx = t.indexOf(':');
                      let type = t;
                      let timeStr = "";
                      if (colonIdx !== -1) {
                        type = t.substring(0, colonIdx).trim();
                        timeStr = t.substring(colonIdx + 1).trim();
                      }
                      return (
                        <div 
                          key={idx}
                          className="flex items-center justify-between"
                          style={{
                            fontSize: 12,
                            letterSpacing: "0.05em",
                            fontWeight: 500
                          }}
                        >
                          <div className="flex items-center gap-2" style={{ color: "#89F3FF" }}>
                            <span className="w-1 h-1 rounded-full bg-[#89F3FF]" />
                            <span>{type.toUpperCase()}</span>
                          </div>
                          <span style={{ color: "rgba(255,255,255,0.7)" }}>{timeStr}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FACILITIES */}
      <section className="max-w-[1400px] mx-auto px-8 pb-32">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <div
              className="p-8 rounded-[28px] border h-full flex flex-col justify-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(137,243,255,0.12)",
              }}
            >
              <div
                className="flex items-center gap-3 mb-8"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.35em",
                  color: "#89F3FF",
                }}
              >
                RESORT FACILITIES
              </div>
              <div className="grid sm:grid-cols-2 gap-y-5 gap-x-8">
                {resort.facilities?.map((facility, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: "rgba(137,243,255,0.1)",
                        border: "1px solid rgba(137,243,255,0.25)",
                        color: "#89F3FF",
                      }}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {facility}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
                href="/plan-trip"
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
          {fillRelated.map((r) => {
            const rDiscounted = computeDiscountedPrice(r.price, r.offer);
            return (
            <Link
              href={`/maldives-resort/${r.slug}`}
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
                {r.offer && (
                  <div className="absolute top-4 right-4">
                    <span
                      className="px-2.5 py-1 rounded-full"
                      style={{ fontSize: 10, fontWeight: 700, background: "#F4B942", color: "#07120E" }}
                    >
                      {getOfferBadgeLabel(r.offer)}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-5 left-5 right-5">
                  <div
                    className="mb-1 flex items-baseline gap-1.5"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.3em",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {r.offer?.type === "FIXED_PACKAGE" ? (
                      <span>{r.offer.packageNights}N · ${r.offer.packagePrice?.toLocaleString()}</span>
                    ) : rDiscounted !== null ? (
                      <>
                        <span style={{ textDecoration: "line-through", opacity: 0.6 }}>${r.price}</span>
                        <span>FROM ${rDiscounted}/NIGHT</span>
                      </>
                    ) : (
                      <span>FROM ${r.price}/NIGHT</span>
                    )}
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
            );
          })}
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
          required={required}
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
