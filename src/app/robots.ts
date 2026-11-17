import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Review-only pages under /preview stay out of search.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/preview/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
