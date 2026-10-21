import type { MetadataRoute } from "next";
import { SITE_URL, routes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: routes.home, priority: 1 },
    { path: routes.contact, priority: 0.8 },
  ];
  return pages.map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: p.priority,
  }));
}
