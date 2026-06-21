"use client";
import { LuxuryHero } from "@/components/LuxuryHero";
import { SriLankaExperiences } from "@/components/SriLankaExperiences";
import { SriLankaPackages } from "@/components/SriLankaPackages";
import { JourneyCTA } from "@/components/JourneyCTA";
import { MaldivesSection } from "@/components/MaldivesSection";
import { TransportService } from "@/components/TransportService";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Page() {
  return (
    <>
      <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" />
      <LuxuryHero />
      <SriLankaExperiences />
      <SriLankaPackages />
      <JourneyCTA />
      <MaldivesSection />
      <TransportService />
      <Testimonials />
      <Footer />
    </>
  );
}
