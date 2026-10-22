import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { IntroLoader } from "@/components/sections/home/IntroLoader";
import { Hero } from "@/components/sections/home/Hero";
import { ChangeSection } from "@/components/sections/home/ChangeSection";
import { WhatWeDo } from "@/components/sections/home/WhatWeDo";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { HowWeWork } from "@/components/sections/home/HowWeWork";
import { Industries } from "@/components/sections/home/Industries";
import { TrustedBy } from "@/components/sections/home/TrustedBy";
import { Faq } from "@/components/sections/home/Faq";
import { NextStep } from "@/components/sections/home/NextStep";
import { homeContent } from "@/content/home";
import { introBootScript } from "@/lib/intro-boot";
import { regions, type Region } from "@/lib/region";
import { alternates } from "@/lib/seo";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, social } from "@/lib/site";

export function homeMetadata(region: Region): Metadata {
  const { title, description } = homeContent(region).meta;
  const alt = alternates(region, "/");
  return {
    title: { absolute: title },
    description,
    alternates: alt,
    openGraph: { title, description, url: alt.canonical },
    twitter: { title, description },
  };
}

export function HomePage({ region }: { region: Region }) {
  const c = homeContent(region);
  const { introKey, areaServed } = regions[region];
  const home = alternates(region, "/").canonical;
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}${home === "/" ? "" : home}`,
    logo: `${SITE_URL}/images/psquare-mark.svg`,
    email: CONTACT_EMAIL,
    ...(areaServed && { areaServed }),
    sameAs: social.map((s) => s.href),
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: introBootScript(introKey) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
      />
      <IntroLoader introKey={introKey} />
      <div id="psq-page" className="page">
        <SiteNav region={region} current="home" />
        <main id="main" tabIndex={-1}>
          <Hero hero={c.hero} />
          <ChangeSection change={c.change} />
          <WhatWeDo what={c.what} />
          <SelectedWork work={c.work} />
          {c.howWeWork && <HowWeWork how={c.howWeWork} />}
          <Industries industries={c.industries} />
          <TrustedBy trusted={c.trusted} />
          <Faq faq={c.faq} />
          <NextStep nextStep={c.nextStep} />
        </main>
        <SiteFooter region={region} path="/" />
      </div>
      <PageReveal />
    </>
  );
}
