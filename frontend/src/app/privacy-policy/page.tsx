import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const LAST_UPDATED = "10 August 2026";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Introduction",
    body: (
      <>
        Nomadic Ventures ("we," "us," "our") designs private travel journeys
        across Sri Lanka and the Maldives. This policy explains what
        information we collect when you use this website, why we collect it,
        and how we handle it. By submitting an inquiry through this site, you
        agree to the practices described here.
      </>
    ),
  },
  {
    title: "2. Information We Collect",
    body: (
      <>
        We only collect information you choose to give us — primarily when
        you submit a trip inquiry through our Resort, Tour, or Plan My Trip
        forms. This can include:
        <ul className="list-disc pl-5 mt-3 space-y-1.5">
          <li>Your first and last name</li>
          <li>Email address and mobile number</li>
          <li>Country of residence</li>
          <li>Number of adults, children, and infants traveling</li>
          <li>Preferred travel dates and length of stay</li>
          <li>The resort, tour, or destination you're interested in</li>
          <li>Any notes or preferences you choose to share with us</li>
        </ul>
        We do not require you to create an account, and we do not collect
        payment details through this website.
      </>
    ),
  },
  {
    title: "3. How We Use Your Information",
    body: (
      <>
        The details you submit are used for one purpose: so a member of our
        travel design team can read your inquiry and reply to you personally
        — usually by email or WhatsApp — to help plan your trip. We do not
        use your information for automated marketing, and we do not send
        unsolicited emails.
      </>
    ),
  },
  {
    title: "4. Data Storage & Security",
    body: (
      <>
        Inquiry details are delivered securely to our team and stored on
        infrastructure protected with industry-standard security practices.
        We limit access to customer information to the people who need it to
        respond to your inquiry.
      </>
    ),
  },
  {
    title: "5. Cookies & Tracking",
    body: (
      <>
        This site does not use advertising or analytics cookies. The only
        cookie in use is a strictly necessary authentication cookie for our
        internal admin dashboard, which is only relevant to our staff and is
        never set for regular visitors browsing the public site.
      </>
    ),
  },
  {
    title: "6. Third-Party Sharing",
    body: (
      <>
        We do not sell, rent, or share your personal information with third
        parties for marketing purposes. Your details are used solely by
        Nomadic Ventures to respond to your inquiry, as stated on our
        inquiry forms.
      </>
    ),
  },
  {
    title: "7. Your Rights",
    body: (
      <>
        You can ask us to access, correct, or delete the information you've
        submitted to us at any time. To make a request, contact us at{" "}
        <a href="mailto:info@nomadicsrilanka.com" className="text-[#F4B942] hover:underline">
          info@nomadicsrilanka.com
        </a>{" "}
        and we'll action it promptly.
      </>
    ),
  },
  {
    title: "8. Data Retention",
    body: (
      <>
        We keep inquiry details only as long as needed to respond to you and
        to maintain a reasonable record of past conversations for customer
        service purposes. You may request earlier deletion at any time using
        the contact details above.
      </>
    ),
  },
  {
    title: "9. Children's Privacy",
    body: (
      <>
        This website is intended for adults planning travel. We do not
        knowingly collect personal information directly from children.
      </>
    ),
  },
  {
    title: "10. Changes to This Policy",
    body: (
      <>
        We may update this policy from time to time as our practices evolve.
        The "last updated" date at the top of this page will always reflect
        the most recent revision.
      </>
    ),
  },
  {
    title: "11. Contact Us",
    body: (
      <>
        If you have any questions about this policy or how your information
        is handled, reach out to us at{" "}
        <a href="mailto:info@nomadicsrilanka.com" className="text-[#F4B942] hover:underline">
          info@nomadicsrilanka.com
        </a>{" "}
        or +94 112 474 472.
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#07120E", color: "white", fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar accent="#F4B942" glow="rgba(244,185,66,0.35)" />

      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(900px 500px at 80% 20%, rgba(244,185,66,0.14), transparent 60%)",
          }}
        />
        <div className="relative max-w-[900px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-44 md:pb-20">
          <div
            className="flex items-center gap-2 mb-6"
            style={{ fontSize: 11, letterSpacing: "0.35em", color: "rgba(255,255,255,0.55)" }}
          >
            <span>HOME</span>
            <span style={{ color: "#F4B942" }}>›</span>
            <span>PRIVACY POLICY</span>
          </div>
          <h1
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Privacy Policy
          </h1>
          <p className="mt-5" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-6 md:px-8 pb-32">
        <div className="flex flex-col gap-12">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2
                className="mb-4"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(20px, 2.5vw, 26px)",
                  letterSpacing: "-0.01em",
                  color: "#F4B942",
                }}
              >
                {s.title}
              </h2>
              <div style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.68)" }}>
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
