import type { Metadata } from "next";
import { REGIONS, regionPath, regions, type Region } from "@/lib/region";

/**
 * Canonical plus hreflang alternates for a page that exists in every edition.
 * The global site doubles as x-default.
 */
export function alternates(region: Region, path: string) {
  const languages: Record<string, string> = {};
  for (const r of REGIONS) languages[regions[r].lang] = regionPath(r, path);
  languages["x-default"] = regionPath("global", path);
  return { canonical: regionPath(region, path), languages };
}

/**
 * Metadata for pages that exist once, globally (legal, sitemap, careers).
 * The Canada edition renders them too, but every copy points canonical at the global URL.
 */
export function globalPageMetadata(
  region: Region,
  path: string,
  title: string,
  description: string,
): Metadata {
  const t = title.replace("PSQUARE COMPANY", `PSQUARE COMPANY${regions[region].titleSuffix}`);
  return {
    title: { absolute: t },
    description,
    alternates: { canonical: path },
    openGraph: { title: t, description, url: path },
    twitter: { title: t, description },
  };
}
