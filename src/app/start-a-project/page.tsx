import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InnerHero } from "@/components/sections/InnerHero";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { contactHero } from "@/content/contact";
import styles from "./page.module.css";

const title = "Get in touch | PSQUARE COMPANY Canada";
const description =
  "Book a product demo, start a bespoke build or get software consultancy from PSQUARE COMPANY.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/start-a-project" },
  openGraph: { title, description, url: "/start-a-project" },
  twitter: { title, description },
};

export default function StartAProjectPage() {
  return (
    <>
      <SiteNav current="none" />
      <main id="main" tabIndex={-1}>
        <InnerHero
          eyebrow={contactHero.eyebrow}
          title={contactHero.title}
          lead={contactHero.lead}
        />
        <section data-screen-label="02 Form" className={styles.body} aria-label="Enquiry form">
          <ContactForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
