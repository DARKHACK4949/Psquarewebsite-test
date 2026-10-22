/**
 * The site ships two regional editions, like apple.com and apple.com/ca:
 * the global site at the root and the Canadian site under /ca. Everything
 * that differs between them hangs off this config.
 */
export type Region = "global" | "ca";

export const REGIONS: Region[] = ["global", "ca"];

type RegionConfig = {
  /** URL prefix ("" for the root edition). */
  base: "" | "/ca";
  lang: string;
  ogLocale: string;
  /** Edition name, used in titles and the region switcher. */
  name: string;
  /** Suffix for page titles ("" for global). */
  titleSuffix: string;
  /** sessionStorage key for the once-per-session homepage intro. */
  introKey: string;
  /** Primary call to action label. */
  cta: string;
  /** Default country for the phone code picker (ISO 3166-1 alpha-2). */
  defaultCountry: string;
  areaServed?: string;
};

export const regions: Record<Region, RegionConfig> = {
  global: {
    base: "",
    lang: "en",
    ogLocale: "en_US",
    name: "Global",
    titleSuffix: "",
    introKey: "psq-intro",
    cta: "Start a project",
    defaultCountry: "US",
  },
  ca: {
    base: "/ca",
    lang: "en-CA",
    ogLocale: "en_CA",
    name: "Canada",
    titleSuffix: " Canada",
    introKey: "psq-intro-ca",
    cta: "Book a demo",
    defaultCountry: "CA",
    areaServed: "CA",
  },
};

/** Prefix a site path with a region's base ("/" + "/ca" → "/ca"). */
export function regionPath(region: Region, path: string) {
  const base = regions[region].base;
  if (!base || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return path === "/" ? base : `${base}${path}`;
}
