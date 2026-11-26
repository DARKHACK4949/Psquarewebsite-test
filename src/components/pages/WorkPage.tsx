import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { WorkHero } from "@/components/sections/work/WorkHero";
import { WorkFolds } from "@/components/sections/home/WorkFolds";
import { CloseCinema } from "@/components/sections/home/CloseCinema";
import { homeContent } from "@/content/home";
import { workThemes } from "@/content/home/preview";
import { workHero, workIntroLine, workMeta, workPlaceholders } from "@/content/work";
import { regions, type Region } from "@/lib/region";

/** In review: reachable by URL, not indexed and not yet linked from the live site. */
export function workMetadata(region: Region): Metadata {
  const title = workMeta.title.replace(
    "PSQUARE COMPANY",
    `PSQUARE COMPANY${regions[region].titleSuffix}`,
  );
  return {
    title: { absolute: title },
    description: workMeta.description,
    robots: { index: false, follow: false },
  };
}

/**
 * Work, in the same night chapter as the landing preview: the showreel under a
 * very large title, then every project as its own full-screen chapter in its
 * colour (held places for case studies still in production), then the close.
 */
export function WorkPage({ region }: { region: Region }) {
  const c = homeContent(region);
  const work = { ...c.work, items: [...c.work.items, ...workPlaceholders] };
  return (
    <div id="psq-page" className="page">
      <SiteNav region={region} current="work" startDark />
      <main id="main" tabIndex={-1}>
        <WorkHero hero={workHero} />
        <WorkFolds work={work} intro={workIntroLine} themes={workThemes} exit="dark" />
        <CloseCinema nextStep={c.nextStep} join="night" />
      </main>
      <SiteFooter region={region} path="/work" tone="night" />
      <PageReveal />
    </div>
  );
}
