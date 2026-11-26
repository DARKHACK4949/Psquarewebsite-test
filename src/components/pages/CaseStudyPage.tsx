import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import { Words } from "@/components/ui/Words";
import { CaseShot } from "@/components/sections/case/CaseShot";
import { CaseFeatures } from "@/components/sections/case/CaseFeatures";
import { CloseCinema } from "@/components/sections/home/CloseCinema";
import { caseStudies } from "@/content/case-studies";
import { homeContent } from "@/content/home";
import { workThemes } from "@/content/home/preview";
import { regions, type Region } from "@/lib/region";
import { routesFor } from "@/lib/site";
import styles from "@/components/sections/case/CaseStudy.module.css";

/** Held text reads quieter, so it is never mistaken for finished copy. */
const held = (s: string) => (s.startsWith("Placeholder") ? styles.held : undefined);

/** Projects that have a case study in this region, in the order of the work index. */
export function caseSlugs(region: Region) {
  return homeContent(region)
    .work.items.map((w) => w.key)
    .filter((k) => k in caseStudies);
}

/** In review: reachable by URL, not indexed and not yet linked from the live site. */
export function caseMetadata(region: Region, slug: string): Metadata {
  const item = homeContent(region).work.items.find((w) => w.key === slug);
  const cs = caseStudies[slug];
  if (!item || !cs) return {};
  return {
    title: { absolute: `${item.name}, case study | PSQUARE COMPANY${regions[region].titleSuffix}` },
    description: cs.statement,
    robots: { index: false, follow: false },
  };
}

/**
 * One project, told in the project's own colour: the product film under a very
 * large name, what we did in one sentence with the facts beside it, the product
 * wide, the story, two views at different sizes, the objectives, three features
 * held on scroll, the client's words, the results, then the next project.
 */
export function CaseStudyPage({ region, slug }: { region: Region; slug: string }) {
  const c = homeContent(region);
  const r = routesFor(region);
  const items = c.work.items.filter((w) => w.key in caseStudies);
  const at = items.findIndex((w) => w.key === slug);
  const item = items[at];
  const cs = caseStudies[slug];
  const next = items[(at + 1) % items.length];
  const theme = workThemes[slug] ?? "var(--night)";

  return (
    <div id="psq-page" className="page">
      <SiteNav region={region} current="work" startDark />
      <main id="main" tabIndex={-1} className={styles.page} style={{ background: theme }}>
        {/* Hero */}
        <section
          data-screen-label="01 Case hero"
          data-noband=""
          data-nav-dark=""
          className={styles.hero}
        >
          <div aria-hidden="true" className={styles.heroFilm}>
            <LoopVideo src={item.video} className={styles.heroVideo} eager />
          </div>
          <div className={styles.heroInner}>
            <Link href={r.work} className={styles.crumb}>
              Work /
            </Link>
            <h1 className={styles.heroTitle} data-split="" aria-label={item.name}>
              <Words text={item.name} />
            </h1>
          </div>
        </section>

        {/* What we did, with the facts beside it */}
        <section data-screen-label="02 Case intro" data-nav-dark="" className={styles.intro}>
          <p className={styles.statement} data-reveal="">
            {cs.statement}
          </p>
          <dl className={styles.facts} data-reveal="">
            <div>
              <dt>Industry</dt>
              <dd>{item.sector}</dd>
            </div>
            <div>
              <dt>Platforms</dt>
              <dd>{cs.platforms}</dd>
            </div>
            <div>
              <dt>What we did</dt>
              <dd>{cs.services}</dd>
            </div>
          </dl>
        </section>

        <figure className={styles.wide} data-reveal="">
          <CaseShot img={cs.wide} sizes="(min-width: 900px) 90vw, 100vw" />
        </figure>

        {/* The story */}
        <section data-screen-label="03 Overview" data-nav-dark="" className={styles.overview}>
          <h2 className={styles.h2} data-reveal="">
            {cs.overview.heading}
          </h2>
          <div className={styles.body} data-reveal="">
            {cs.overview.body.map((p) => (
              <p key={p} className={held(p)}>
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Two views at different sizes */}
        <section data-screen-label="04 Views" data-nav-dark="" className={styles.pair}>
          <figure className={styles.pairSmall} data-reveal="">
            <CaseShot img={cs.pair[0]} sizes="(min-width: 900px) 34vw, 92vw" />
          </figure>
          <figure className={styles.pairLarge} data-reveal="">
            <CaseShot img={cs.pair[1]} sizes="(min-width: 900px) 56vw, 92vw" />
          </figure>
        </section>

        {/* Objectives */}
        <section data-screen-label="05 Objectives" data-nav-dark="" className={styles.objectives}>
          <h2 className={styles.h3} data-reveal="">
            Objectives
          </h2>
          <ol className={styles.oList}>
            {cs.objectives.map((o, i) => (
              <li key={i} data-reveal="">
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <p className={held(o)}>{o}</p>
              </li>
            ))}
          </ol>
        </section>

        <CaseFeatures features={cs.features} />

        {/* The client's words */}
        <section data-screen-label="08 Quote" data-nav-dark="" className={styles.quote}>
          <blockquote data-reveal="">
            <p className={held(cs.quote.text)}>{cs.quote.text}</p>
            <footer>
              {cs.quote.name}, {cs.quote.role}
            </footer>
          </blockquote>
        </section>

        {/* Results */}
        <section data-screen-label="09 Results" data-nav-dark="" className={styles.results}>
          <h2 className={styles.h3} data-reveal="">
            Results
          </h2>
          <ul className={styles.rList}>
            {cs.results.map((x, i) => (
              <li key={i} data-reveal="">
                <span className={styles.rValue}>{x.value}</span>
                <span className={styles.rLabel}>{x.label}</span>
                <p className={held(x.body)}>{x.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Next project */}
        {next && next.key !== slug && (
          <section data-screen-label="10 Next" data-nav-dark="" className={styles.next}>
            <Link href={next.href} className={styles.nextLink}>
              <span className={styles.nextLabel}>Next project</span>
              <span className={styles.nextName}>{next.name}</span>
            </Link>
          </section>
        )}
        <CloseCinema nextStep={c.nextStep} join="night" />
      </main>
      <SiteFooter region={region} path={`/work/${slug}`} tone="night" />
      <PageReveal />
    </div>
  );
}
