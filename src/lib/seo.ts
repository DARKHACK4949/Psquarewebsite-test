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
