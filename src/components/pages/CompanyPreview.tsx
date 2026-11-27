import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { CultureFold } from "@/components/sections/company/CultureFold";
import { CompanyHero } from "@/components/sections/company/CompanyHero";
import { CountStage } from "@/components/sections/company/CountStage";
import { JourneyPan } from "@/components/sections/company/JourneyPan";
import { MindsetSteps } from "@/components/sections/company/MindsetSteps";
import { Founders } from "@/components/sections/company/Founders";
import { Leaders } from "@/components/sections/company/Leaders";
import { CareersClose } from "@/components/sections/company/CareersClose";
import { routesFor } from "@/lib/site";
import type { Region } from "@/lib/region";

/**
 * Temporary review page for the new Company page (/preview/company), in the
 * preview landing's language: all night, words that resolve out of a blur,
 * held screens. Hero over a wall of the team, the numbers one at a time, the
 * journey panning sideways, the mindset as a rise of light, the founders and
 * the people who lead, culture, and the invitation to join. The live Company
 * page is unchanged.
 */
export function CompanyPreview({ region }: { region: Region }) {
  return (
    <div id="psq-page" className="page">
      <SiteNav region={region} current="co" startDark />
      <main id="main" tabIndex={-1}>
        <CompanyHero />
        <CountStage />
        <JourneyPan />
        <MindsetSteps />
        <Founders />
        <Leaders />
        <CultureFold />
        <CareersClose href={routesFor(region).careers} />
      </main>
      <SiteFooter region={region} path="/about" tone="night" />
      <PageReveal />
    </div>
  );
}
