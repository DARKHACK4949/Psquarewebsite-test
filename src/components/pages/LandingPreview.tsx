import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { HeroAurora } from "@/components/sections/home/HeroAurora";
import { DeviceWall } from "@/components/sections/home/DeviceWall";
import { WorkFolds } from "@/components/sections/home/WorkFolds";
import { WhatWeDoCards } from "@/components/sections/home/WhatWeDoCards";
import { TrustedBy } from "@/components/sections/home/TrustedBy";
import { Faq } from "@/components/sections/home/Faq";
import { CloseCinema } from "@/components/sections/home/CloseCinema";
import { homeContent } from "@/content/home";
import { previewHero, whatWeDo, workIntro, workThemes } from "@/content/home/preview";
import type { Region } from "@/lib/region";

/**
 * Temporary review page for the new landing design (/preview/landing): dark
 * aurora hero, the device wall running straight into the dark work chapter
 * (one screen per project, each in its own colour), then What we do, Trusted
 * by, FAQ and the dark close. The live homepage is unchanged.
 */
export function LandingPreview({ region }: { region: Region }) {
  const c = homeContent(region);
  return (
    <div id="psq-page" className="page">
      <SiteNav region={region} current="home" />
      <main id="main" tabIndex={-1}>
        <HeroAurora hero={c.hero} lead={previewHero.lead} look={previewHero.look} />
        <DeviceWall wall={c.wall} enter="dark" exit="dark" />
        <WorkFolds work={c.work} intro={workIntro} themes={workThemes} />
        <WhatWeDoCards what={whatWeDo} />
        <TrustedBy trusted={c.trusted} />
        <Faq faq={c.faq} />
        <CloseCinema nextStep={c.nextStep} />
      </main>
      <SiteFooter region={region} path="/" tone="night" />
      <PageReveal />
    </div>
  );
}
