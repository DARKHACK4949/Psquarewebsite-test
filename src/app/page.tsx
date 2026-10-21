import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { IntroLoader } from "@/components/sections/home/IntroLoader";
import { Hero } from "@/components/sections/home/Hero";
import { ChangeSection } from "@/components/sections/home/ChangeSection";
import { WhatWeDo } from "@/components/sections/home/WhatWeDo";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { Industries } from "@/components/sections/home/Industries";
import { TrustedBy } from "@/components/sections/home/TrustedBy";
import { Faq } from "@/components/sections/home/Faq";
import { NextStep } from "@/components/sections/home/NextStep";
import { introBootScript } from "@/lib/intro";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, social } from "@/lib/site";

const title = "PSQUARE COMPANY Canada | Software built around the way your business works";
const description =
  "Focused platforms and custom systems for field service, architecture and real estate teams in Canada. Book a demo with PSQUARE COMPANY.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/" },
  twitter: { title, description },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/psquare-mark.svg`,
  email: CONTACT_EMAIL,
  areaServed: "CA",
  sameAs: social.map((s) => s.href),
};

export default function HomePage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
      />
      <IntroLoader />
      <div id="psq-page" className="page">
        <SiteNav current="home" />
        <main id="main" tabIndex={-1}>
          <Hero />
          <ChangeSection />
          <WhatWeDo />
          <SelectedWork />
          <Industries />
          <TrustedBy />
          <Faq />
          <NextStep />
        </main>
        <SiteFooter />
      </div>
      <PageReveal />
    </>
  );
}
