import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { Numbers } from "@/components/sections/about/Numbers";
import { Journey } from "@/components/sections/about/Journey";
import { Mindset } from "@/components/sections/about/Mindset";
import { NightBand } from "@/components/sections/about/NightBand";
import { Team } from "@/components/sections/about/Team";
import { Culture } from "@/components/sections/about/Culture";
import { CareersCta } from "@/components/sections/about/CareersCta";
import { aboutMeta } from "@/content/about";
import { regions, type Region } from "@/lib/region";
import { alternates } from "@/lib/seo";
import { routesFor } from "@/lib/site";

const PATH = "/about";

export function aboutMetadata(region: Region): Metadata {
  const title = aboutMeta.title.replace(
    "PSQUARE COMPANY",
    `PSQUARE COMPANY${regions[region].titleSuffix}`,
  );
  const { description } = aboutMeta;
  const alt = alternates(region, PATH);
  return {
    title: { absolute: title },
    description,
    alternates: alt,
    openGraph: { title, description, url: alt.canonical },
    twitter: { title, description },
  };
}

export function AboutPage({ region }: { region: Region }) {
  return (
    <>
      <SiteNav region={region} current="co" alwaysSolid />
      <main id="main" tabIndex={-1}>
        <AboutHero />
        <Numbers />
        <Journey />
        <Mindset />
        <NightBand>
          <Team />
          <Culture />
        </NightBand>
        <CareersCta href={routesFor(region).careers} />
      </main>
      <SiteFooter region={region} path={PATH} />
      <PageReveal />
    </>
  );
}
