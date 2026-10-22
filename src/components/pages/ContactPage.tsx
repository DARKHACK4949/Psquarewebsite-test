import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InnerHero } from "@/components/sections/InnerHero";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { contactHero } from "@/content/contact";
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

export function ContactPage({ region }: { region: Region }) {
  return (
    <>
      <SiteNav region={region} current="none" />
      <main id="main" tabIndex={-1}>
        <InnerHero
          eyebrow={contactHero.eyebrow}
          title={contactHero.title}
          lead={contactHero.lead}
        />
        <section data-screen-label="02 Form" className={styles.body} aria-label="Enquiry form">
          <ContactForm region={region} />
        </section>
      </main>
      <SiteFooter region={region} path={PATH} />
    </>
  );
}
