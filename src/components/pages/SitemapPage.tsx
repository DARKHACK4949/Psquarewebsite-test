import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageReveal } from "@/components/providers/PageReveal";
import { InnerHero } from "@/components/sections/InnerHero";
import { AppLink as Link } from "@/components/ui/AppLink";
import { sitemapGroups, sitemapPage as page } from "@/content/sitemap";
import type { Region } from "@/lib/region";
import { globalPageMetadata } from "@/lib/seo";
import styles from "./SitemapPage.module.css";

export function sitemapMetadata(region: Region) {
  return globalPageMetadata(region, page.path, page.title, page.description);
}

/** HTML sitemap: one row per section, its pages in a two-column grid. */
export function SitemapPage({ region }: { region: Region }) {
  return (
    <>
      <SiteNav region={region} current="none" />
      <main id="main" tabIndex={-1}>
        <InnerHero eyebrow={page.eyebrow} title={page.heading} lead={page.lead} />
        <section data-screen-label="02 Pages" aria-label="All pages" className={styles.list}>
          {sitemapGroups(region).map((g, i) => (
            <div key={g.title} className={styles.row} data-reveal="">
              <h2 className={styles.head}>
                <span className={styles.n}>{String(i + 1).padStart(2, "0")}</span>
                <Link href={g.href} className={styles.title}>
                  {g.title}
                </Link>
              </h2>
              {g.links.length > 0 && (
                <ul className={styles.links}>
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className={styles.link}>
                        <span className={styles.label}>{l.label}</span>
                        <span aria-hidden="true" className={styles.arrow}>
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      </main>
      <SiteFooter region={region} path={page.path} />
      <PageReveal />
    </>
  );
}
