import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { IntroLoader } from "@/components/sections/home/IntroLoader";
import { Hero } from "@/components/sections/home/Hero";
import { DeviceWall } from "@/components/sections/home/DeviceWall";
import { WhatWeDo } from "@/components/sections/home/WhatWeDo";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { SelectedWorkDark } from "@/components/sections/home/SelectedWorkDark";
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
 * `preview="dark-chapter"` renders the proposed order for review at
 * /preview/dark-chapter: the device wall dissolves into a dark Selected work
 * (one dark chapter), followed by What we do. The live homepage is unchanged.
 */
export function HomePage({ region, preview }: { region: Region; preview?: "dark-chapter" }) {
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
          {preview === "dark-chapter" ? (
            <>
              <DeviceWall wall={c.wall} exit="dark" />
              <SelectedWorkDark work={c.work} />
              <WhatWeDo what={c.what} />
            </>
          ) : (
            <>
              <DeviceWall wall={c.wall} />
              <WhatWeDo what={c.what} />
              <SelectedWork work={c.work} />
            </>
          )}
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
