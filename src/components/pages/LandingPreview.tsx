import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { HeroAurora } from "@/components/sections/home/HeroAurora";
import { ReelReveal } from "@/components/sections/home/ReelReveal";
import { DeviceWall } from "@/components/sections/home/DeviceWall";
import { WorkFolds } from "@/components/sections/home/WorkFolds";
import { CapabilityIndex } from "@/components/sections/home/CapabilityIndex";
import { ScrollStatement } from "@/components/sections/home/ScrollStatement";
import { LogoMoment } from "@/components/sections/home/LogoMoment";
import { CloseCinema } from "@/components/sections/home/CloseCinema";
import { homeContent } from "@/content/home";
import {
  previewHero,
  showreel,
  studioWall,
  whatWeDo,
  workIntro,
  workThemes,
} from "@/content/home/preview";
import type { Region } from "@/lib/region";

/**
 * Temporary review page for the new landing design (/preview/landing): dark
 * aurora hero, the showreel opening to full screen, the device wall running straight into the dark work chapter
 * (one screen per project, each in its own colour), then What we do, Trusted
 * by, FAQ and the dark close. The live homepage is unchanged.
 */
export function LandingPreview({ region }: { region: Region }) {
  const c = homeContent(region);
  return (
    <div id="psq-page" className="page">
      <SiteNav region={region} current="home" startDark />
      <main id="main" tabIndex={-1}>
        <HeroAurora
          hero={c.hero}
          lead={previewHero.lead}
          look={previewHero.look}
          film={previewHero.film}
        />
        <ReelReveal reel={showreel} />
        <DeviceWall wall={studioWall} enter="dark" exit="dark" studio />
        <WorkFolds work={c.work} intro={workIntro} themes={workThemes} exit="dark" />
        <ScrollStatement text={whatWeDo.statement} label="05a What we do" />
        <CapabilityIndex what={whatWeDo} work={c.work.items} all={c.what.all} />
        <ScrollStatement text={c.trusted.title} label="06 Trusted by">
          <LogoMoment logos={c.trusted.logos} />
        </ScrollStatement>
        <CloseCinema nextStep={c.nextStep} join="night" />
      </main>
      <SiteFooter region={region} path="/" tone="night" />
      <PageReveal />
    </div>
  );
}
