import { SitemapPage, sitemapMetadata } from "@/components/pages/SitemapPage";

export const metadata = sitemapMetadata("ca");

export default function CanadaSitemap() {
  return <SitemapPage region="ca" />;
}
