import { regionPath, type Region } from "@/lib/region";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://psquarecompany.com").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "PSQUARE COMPANY";
export const CONTACT_EMAIL = "info@psquarecompany.com";
export const PRIVACY_URL = "https://psquarecompany.com/privacy-policy-2";

/**
 * Every internal URL lives here so later phases (About, Work, Capabilities,
 * Case Study, 404) slot in without touching components. These are the
 * region-neutral paths; use `routesFor(region)` for links.
 */
const paths = {
  home: "/",
  contact: "/start-a-project",
  work: "/work",
  solutions: "/solutions",
  industries: "/industries",
  capabilities: "/capabilities",
  about: "/about",
  approach: "/approach",
  careers: "/careers",
  startups: "/startups",
  caseStudy: "/case-study",
  terms: "/terms",
  sitemap: "/sitemap.xml",
} as const;

export type Routes = { [K in keyof typeof paths]: string };

export function routesFor(region: Region): Routes {
  return Object.fromEntries(
    Object.entries(paths).map(([k, v]) => [k, k === "sitemap" ? v : regionPath(region, v)]),
  ) as Routes;
}

export const social = [
  {
    label: "LinkedIn",
    icon: "linkedin",
    href: "https://www.linkedin.com/company/psquare-company/",
  },
  { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/psquarecompany/" },
  { label: "YouTube", icon: "youtube", href: "https://youtube.com/@psquarecompany" },
  { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/Psquarecompanyy/" },
] as const;

/** Routes that exist in the current phase. Add each new page here as it ships. */
const BUILT = new Set<string>([
  "/",
  "/start-a-project",
  "/about",
  "/ca",
  "/ca/start-a-project",
  "/ca/about",
]);

export function isBuilt(href: string) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return true;
  return BUILT.has(href.split(/[?#]/)[0] || "/");
}
