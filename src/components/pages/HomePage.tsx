import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { IntroLoader } from "@/components/sections/home/IntroLoader";
import { Hero } from "@/components/sections/home/Hero";
import { DeviceWall } from "@/components/sections/home/DeviceWall";
import { WhatWeDo } from "@/components/sections/home/WhatWeDo";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { HeroCinema } from "@/components/sections/home/HeroCinema";
import { WorkShowcase } from "@/components/sections/home/WorkShowcase";
import { Capabilities } from "@/components/sections/home/Capabilities";
import { CloseCinema } from "@/components/sections/home/CloseCinema";
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

/**
 * `preview="redesign"` renders the proposed homepage for review at
 * /preview/dark-chapter: a dark cinematic hero, a light logo strip, the device
 * wall, a calm light chapter (work, capabilities), then a dark close with the
 * footer inside it. The live homepage is unchanged.
 */
export function HomePage({ region, preview }: { region: Region; preview?: "redesign" }) {
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

  const jsonLd = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
    />
  );

  if (preview === "redesign")
    return (
      <>
        {jsonLd}
        <div id="psq-page" className="page">
          <SiteNav region={region} current="home" />
          <main id="main" tabIndex={-1}>
            <HeroCinema hero={c.hero} />
            <TrustedBy trusted={c.trusted} variant="strip" />
            <DeviceWall wall={c.wall} enter="dark" />
            <WorkShowcase work={c.work} />
            <Capabilities what={c.what} />
            <CloseCinema nextStep={c.nextStep} />
          </main>
          <SiteFooter region={region} path="/" tone="night" />
        </div>
        <PageReveal />
      </>
    );

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: introBootScript(introKey) }} />
      {jsonLd}
      <IntroLoader introKey={introKey} />
      <div id="psq-page" className="page">
        <SiteNav region={region} current="home" />
        <main id="main" tabIndex={-1}>
          <Hero hero={c.hero} />
          <DeviceWall wall={c.wall} />
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
