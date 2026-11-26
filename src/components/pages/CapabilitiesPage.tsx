import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { WorkHero } from "@/components/sections/work/WorkHero";
import { ScrollStatement } from "@/components/sections/home/ScrollStatement";
import { CapabilityIndex } from "@/components/sections/home/CapabilityIndex";
import { IndustryRow } from "@/components/sections/home/IndustryRow";
import { Faq } from "@/components/sections/home/Faq";
import { CloseCinema } from "@/components/sections/home/CloseCinema";
import { capabilitiesHero, capabilitiesMeta } from "@/content/capabilities";
import { homeContent } from "@/content/home";
import { whatWeDo } from "@/content/home/preview";
import { regions, type Region } from "@/lib/region";

/** In review: reachable by URL, not indexed and not yet linked from the live site. */
export function capabilitiesMetadata(region: Region): Metadata {
  return {
    title: {
      absolute: capabilitiesMeta.title.replace(
        "PSQUARE COMPANY",
        `PSQUARE COMPANY${regions[region].titleSuffix}`,
      ),
    },
    description: capabilitiesMeta.description,
    robots: { index: false, follow: false },
  };
}

/**
 * Capabilities, in the landing's night chapter: a film under a very large title,
 * the statement, the three disciplines with their points, the industries we
 * build for, the questions people ask first, then the close.
 */
export function CapabilitiesPage({ region }: { region: Region }) {
  const c = homeContent(region);
  return (
    <div id="psq-page" className="page">
      <SiteNav region={region} current="cap" startDark />
      <main id="main" tabIndex={-1}>
        <WorkHero hero={capabilitiesHero} label="01 Capabilities hero" />
        <ScrollStatement text={whatWeDo.statement} label="02 Statement" />
        <CapabilityIndex what={whatWeDo} />
        <IndustryRow industries={whatWeDo.industries} />
        <Faq faq={c.faq} tone="night" />
        <CloseCinema nextStep={c.nextStep} join="night" />
      </main>
      <SiteFooter region={region} path="/capabilities" tone="night" />
      <PageReveal />
    </div>
  );
}
