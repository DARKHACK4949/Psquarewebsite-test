import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { contactHero } from "@/content/contact";
import { CONTACT_EMAIL } from "@/lib/site";
import { regions, type Region } from "@/lib/region";
import { alternates } from "@/lib/seo";
import styles from "./ContactPage.module.css";

const PATH = "/start-a-project";

export function contactMetadata(region: Region): Metadata {
  const title = `Get in touch | PSQUARE COMPANY${regions[region].titleSuffix}`;
  const description =
    "Book a product demo, start a bespoke build or get software consultancy from PSQUARE COMPANY.";
  const alt = alternates(region, PATH);
  return {
    title: { absolute: title },
    description,
    alternates: alt,
    openGraph: { title, description, url: alt.canonical },
    twitter: { title, description },
  };
}

/**
 * Start a project: one night section. The intro sits on the left (sticky on
 * desktop); the enquiry form sits on the right in a frosted glass card.
 */
export function ContactPage({ region }: { region: Region }) {
  let w = 0;
  return (
    <>
      <SiteNav region={region} current="none" />
      <main id="main" tabIndex={-1}>
        <section data-screen-label="01 Contact" data-nav-dark="" className={styles.section}>
          <div aria-hidden="true" className={styles.glow} />
          <div className={styles.grid}>
            <div className={styles.intro}>
              <span className={styles.eyebrow}>{contactHero.eyebrow}</span>
              <h1 className={styles.h1} aria-label={contactHero.title.join(" ")}>
                {contactHero.title.map((part, p) => (
                  <span key={part} aria-hidden="true" className={p > 0 ? styles.accent : undefined}>
                    {part.split(" ").map((word, j, arr) => (
                      <span key={j}>
                        <span className={styles.word} style={{ "--i": w++ } as CSSProperties}>
                          {word}
                        </span>
                        {j < arr.length - 1 ? " " : null}
                      </span>
                    ))}
                    {p < contactHero.title.length - 1 ? " " : null}
                  </span>
                ))}
              </h1>
              <p className={styles.lead}>{contactHero.lead}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.email}>
                {CONTACT_EMAIL} <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className={styles.formCol} aria-label="Enquiry form">
              <ContactForm region={region} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter region={region} path={PATH} />
    </>
  );
}
