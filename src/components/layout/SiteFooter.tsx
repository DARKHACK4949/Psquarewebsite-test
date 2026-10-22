import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import {
  FacebookLogo,
  GlobeSimple,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { CONTACT_EMAIL, PRIVACY_URL, routesFor, social } from "@/lib/site";
import { REGIONS, regionPath, regions, type Region } from "@/lib/region";
import styles from "./SiteFooter.module.css";

const SOCIAL_ICONS = {
  linkedin: LinkedinLogo,
  instagram: InstagramLogo,
  youtube: YoutubeLogo,
  facebook: FacebookLogo,
} as const;

function footerLinks(region: Region) {
  const routes = routesFor(region);
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
  return { routes, explore, company };
}

/** `path` is the region-neutral path of this page, so the switcher lands on its twin. */
export function SiteFooter({ region, path = "/" }: { region: Region; path?: string }) {
  const { routes, explore, company } = footerLinks(region);
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
            <div className={`${styles.col} ${styles.follow}`}>
              <span className={styles.colTitle}>Follow</span>
              <div className={styles.socials}>
                {social.map((s) => {
                  const Icon = SOCIAL_ICONS[s.icon];
                  return (
                    <a
                      key={s.href}
                      href={s.href}
                      aria-label={s.label}
                      className={styles.social}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Icon aria-hidden="true" size={20} className={styles.socialIcon} />
                      <span className={styles.socialLabel}>{s.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 PSQUARE COMPANY. All rights reserved.</span>
          <nav aria-label="Region" className={styles.regions}>
            <GlobeSimple aria-hidden="true" size={16} />
            {REGIONS.map((r) =>
              r === region ? (
                <span key={r} aria-current="true" className={styles.regionOn}>
                  {regions[r].name}
                </span>
              ) : (
                <a
                  key={r}
                  href={regionPath(r, path)}
                  hrefLang={regions[r].lang}
                  lang={regions[r].lang}
                >
                  {regions[r].name}
                </a>
              ),
            )}
          </nav>
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
