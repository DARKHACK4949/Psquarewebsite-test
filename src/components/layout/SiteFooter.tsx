import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { CONTACT_EMAIL, PRIVACY_URL, routes, social } from "@/lib/site";
import styles from "./SiteFooter.module.css";

const explore = [
  { label: "Work", href: routes.work },
  { label: "Solutions", href: routes.solutions },
  { label: "Industries", href: routes.industries },
  { label: "Capabilities", href: routes.capabilities },
];

const company = [
  { label: "About", href: routes.about },
  { label: "Careers", href: routes.careers },
  { label: "Start a project", href: routes.contact },
  { label: "Partner with us", href: `${routes.contact}#partner` },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.card}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <Link href={routes.home} aria-label="PSQUARE COMPANY home" className={styles.brand}>
              <Image src="/images/psquare-mark.svg" alt="" width={34} height={34} />
              PSQUARE COMPANY
            </Link>
            <p className={styles.tag}>
              Software, designed around how your business actually works.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.email}>
              {CONTACT_EMAIL}
            </a>
          </div>
          <nav aria-label="Footer" className={styles.nav}>
            <Column title="Explore" links={explore} />
            <Column title="Company" links={company} />
            <div className={styles.col}>
              <span className={styles.colTitle}>Follow</span>
              {social.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className={styles.link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 PSQUARE COMPANY. All rights reserved.</span>
          <div className={styles.legal}>
            <a href={PRIVACY_URL}>Privacy policy</a>
            <Link href={routes.terms}>Terms of service</Link>
            <a href={routes.sitemap}>Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className={styles.col}>
      <span className={styles.colTitle}>{title}</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={styles.link}>
          {l.label}
        </Link>
      ))}
    </div>
  );
}
