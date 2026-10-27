import type { MetadataRoute } from "next";
import { REGIONS, regionPath, regions } from "@/lib/region";
import { SITE_URL } from "@/lib/site";

const abs = (p: string) => `${SITE_URL}${p === "/" ? "" : p}`;

/** Pages that exist once; their Canada copies point canonical at these. */
const globalOnly = [
  { path: "/careers", priority: 0.6 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/sitemap", priority: 0.2 },
];

/** Every page in both editions, each listing its regional twins as hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/start-a-project", priority: 0.8 },
    { path: "/about", priority: 0.7 },
  ];
  const single: MetadataRoute.Sitemap = globalOnly.map((p) => ({
    url: abs(p.path),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.priority,
  }));
  const both: MetadataRoute.Sitemap = pages.flatMap((p) => {
    const languages = Object.fromEntries([
      ...REGIONS.map((r) => [regions[r].lang, abs(regionPath(r, p.path))]),
      ["x-default", abs(p.path)],
    ]);
    return REGIONS.map((r) => ({
      url: abs(regionPath(r, p.path)),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: r === "global" ? p.priority : p.priority * 0.9,
      alternates: { languages },
    }));
  });
  return [...both, ...single];
}
