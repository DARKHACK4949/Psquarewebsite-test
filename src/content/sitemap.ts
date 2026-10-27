import type { Region } from "@/lib/region";
import { routesFor } from "@/lib/site";
import { megaMenus } from "./nav";

export const sitemapPage = {
  path: "/sitemap",
  title: "Sitemap — PSQUARE COMPANY",
  description: "Every page on psquarecompany.com, grouped by section.",
  eyebrow: "Sitemap",
  heading: ["Every page,", "in order."],
  lead: "Looking for something specific? Everything on psquarecompany.com, grouped the way the site is built.",
};

export type SitemapGroup = {
  title: string;
  href: string;
  links: { label: string; href: string }[];
};

/** Built from the same route config and menus as the nav and footer, so it never drifts. */
export function sitemapGroups(region: Region): SitemapGroup[] {
  const r = routesFor(region);
  const menu = Object.fromEntries(megaMenus(region).map((m) => [m.key, m]));
  const fromMenu = (key: "sol" | "ind" | "cap", title: string, href: string) => ({
    title,
    href,
    links: menu[key].items.map((i) => ({ label: i.label, href: i.href })),
  });
  return [
    { title: "Home", href: r.home, links: [] },
    {
      title: "Work",
      href: r.work,
      links: [
        { label: "All work", href: r.work },
        { label: "Case study", href: r.caseStudy },
      ],
    },
    fromMenu("sol", "Solutions", r.solutions),
    fromMenu("ind", "Industries", r.industries),
    fromMenu("cap", "Capabilities", r.capabilities),
    {
      title: "Company",
      href: r.about,
      links: [
        { label: "About", href: r.about },
        { label: "Careers", href: r.careers },
      ],
    },
    { title: "Start a project", href: r.contact, links: [] },
    {
      title: "Legal",
      href: r.terms,
      links: [
        { label: "Privacy policy", href: r.privacy },
        { label: "Terms of service", href: r.terms },
        { label: "Sitemap", href: r.sitemap },
      ],
    },
  ];
}
