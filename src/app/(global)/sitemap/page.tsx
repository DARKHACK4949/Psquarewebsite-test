import { SitemapPage, sitemapMetadata } from "@/components/pages/SitemapPage";

export const metadata = sitemapMetadata("global");

export default function GlobalSitemap() {
  return <SitemapPage region="global" />;
}
