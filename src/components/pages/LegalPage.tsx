import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { InnerHero } from "@/components/sections/InnerHero";
import { LegalDoc } from "@/components/sections/legal/LegalDoc";
import { legalMeta, privacy, terms } from "@/content/legal";
import type { Region } from "@/lib/region";
import { globalPageMetadata } from "@/lib/seo";
import { routesFor } from "@/lib/site";
import styles from "./LegalPage.module.css";

type Kind = keyof typeof legalMeta;
const DOCS = { privacy, terms };

export function legalMetadata(kind: Kind, region: Region) {
  const m = legalMeta[kind];
  return globalPageMetadata(region, m.path, m.title, m.description);
}

/** Privacy policy and Terms of service share one template. */
export function LegalPage({ kind, region }: { kind: Kind; region: Region }) {
  const doc = DOCS[kind];
  const routes = routesFor(region);
  return (
    <>
      <SiteNav region={region} current="none" />
      <main id="main" tabIndex={-1}>
        <InnerHero eyebrow={doc.eyebrow} title={doc.title} lead={doc.lead}>
          <span className={styles.updated}>Last updated {doc.updated}</span>
        </InnerHero>
        <LegalDoc doc={doc} routes={routes} />
      </main>
      <SiteFooter region={region} path={legalMeta[kind].path} />
      <PageReveal />
    </>
  );
}
