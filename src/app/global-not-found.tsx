import type { Metadata } from "next";
import { RootDocument, viewport } from "@/components/pages/RootDocument";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InnerHero } from "@/components/sections/InnerHero";
import { ButtonLink } from "@/components/ui/Button";
import styles from "@/components/pages/ContactPage.module.css";

export const metadata: Metadata = {
  title: "Page not found | PSQUARE COMPANY",
  description: "The page you are looking for does not exist.",
};
export { viewport };

/** Unmatched URLs in either edition (the site has two root layouts). */
export default function GlobalNotFound() {
  return (
    <RootDocument region="global">
      <SiteNav region="global" current="none" />
      <main id="main" tabIndex={-1}>
        <InnerHero
          eyebrow="404"
          title={["This page took", "a different route."]}
          lead="The link may be old, or the page may have moved."
        />
        <section className={styles.body} aria-label="Next steps">
          <ButtonLink href="/">Back to home</ButtonLink>
        </section>
      </main>
      <SiteFooter region="global" />
    </RootDocument>
  );
}
