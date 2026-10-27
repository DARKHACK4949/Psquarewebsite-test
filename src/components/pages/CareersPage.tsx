import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { InnerHero } from "@/components/sections/InnerHero";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import { OpenRoles } from "@/components/sections/careers/OpenRoles";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import { careersCta } from "@/content/about";
import {
  careersEnd,
  careersHero,
  careersMeta,
  hiring,
  life,
  roleHref,
  roles,
} from "@/content/careers";
import type { Region } from "@/lib/region";
import { globalPageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL, routesFor } from "@/lib/site";
import styles from "./CareersPage.module.css";

export function careersMetadata(region: Region) {
  return globalPageMetadata(region, careersMeta.path, careersMeta.title, careersMeta.description);
}

/** A heading revealed word by word; parts after the first render in plum. */
function SplitTitle({ parts, className }: { parts: readonly string[]; className: string }) {
  return (
    <h2 className={className} data-split="" aria-label={parts.join(" ")}>
      {parts.map((p, i) =>
        i === 0 ? (
          <Words key={p} text={p} />
        ) : (
          <span key={p} className={styles.accent}>
            {" "}
            <Words text={p} />
          </span>
        ),
      )}
    </h2>
  );
}

/** JobPosting structured data, only while roles are open. */
function jobPostings() {
  return roles.map((r) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: r.t,
    description: `${r.t} (${r.team}) at ${SITE_NAME}. ${r.type}.`,
    ...(r.posted && { datePosted: r.posted }),
    employmentType: /part-time/i.test(r.type)
      ? "PART_TIME"
      : /contract/i.test(r.type)
        ? "CONTRACTOR"
        : /intern/i.test(r.type)
          ? "INTERN"
          : "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mohali",
        addressRegion: "Punjab",
        addressCountry: "IN",
      },
    },
    url: roleHref(r).startsWith("http") ? roleHref(r) : `${SITE_URL}${careersMeta.path}#roles`,
  }));
}

export function CareersPage({ region }: { region: Region }) {
  const routes = routesFor(region);
  const hasRoles = roles.length > 0;
  return (
    <>
      {hasRoles && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostings()).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <SiteNav region={region} current="co" />
      <main id="main" tabIndex={-1}>
        <InnerHero
          tone="night"
          eyebrow={careersHero.eyebrow}
          title={careersHero.title}
          lead={careersHero.lead}
        >
          <a
            href="#roles"
            className={styles.heroLink}
            data-track={hasRoles ? undefined : "careers_introduce_click"}
          >
            {hasRoles ? careersHero.linkRoles : careersHero.linkIntro}
            <span aria-hidden="true">↓</span>
          </a>
        </InnerHero>

        <section data-screen-label="02 Life at PSQUARE" className={styles.section}>
          <div className={styles.split}>
            <SplitTitle parts={life.title} className={styles.h2} />
            <div className={styles.aside} data-reveal="">
              <p className={styles.lead}>{life.lead}</p>
              <TextLink href={routes.about}>{life.link}</TextLink>
            </div>
          </div>
          <div className={styles.media} data-reveal="">
            <LoopVideo src={careersCta.video} label={life.videoLabel} className={styles.video} />
          </div>
          <ul className={styles.grid}>
            {life.why.map((w) => (
              <li key={w.t} className={styles.cell} data-reveal="">
                <h3 className={styles.h3}>{w.t}</h3>
                <p className={styles.p}>{w.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <OpenRoles />

        <section data-screen-label="04 Hiring process" className={styles.section}>
          <div className={styles.split}>
            <SplitTitle parts={hiring.title} className={styles.h2} />
            <p className={styles.lead} data-reveal="">
              {hiring.lead}
            </p>
          </div>
          <ol className={styles.grid}>
            {hiring.steps.map((s, i) => (
              <li key={s.t} className={styles.cell} data-reveal="">
                <span className={styles.n}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.h3}>{s.t}</h3>
                <p className={styles.p}>{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {hasRoles ? (
          <section data-screen-label="05 CTA" className={`${styles.section} ${styles.end}`}>
            <div className={`${styles.split} ${styles.endRow}`}>
              <SplitTitle parts={careersEnd.title} className={styles.h2} />
              <div className={styles.aside} data-reveal="">
                <p className={styles.lead}>{careersEnd.lead}</p>
                <ButtonLink href={careersEnd.href} arrow>
                  {careersEnd.cta}
                </ButtonLink>
              </div>
            </div>
          </section>
        ) : (
          <div aria-hidden="true" className={styles.spacer} />
        )}
      </main>
      <SiteFooter region={region} path={careersMeta.path} />
      <PageReveal />
    </>
  );
}
