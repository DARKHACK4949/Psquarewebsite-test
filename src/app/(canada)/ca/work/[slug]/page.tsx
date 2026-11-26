import { CaseStudyPage, caseMetadata, caseSlugs } from "@/components/pages/CaseStudyPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseSlugs("ca").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return caseMetadata("ca", slug);
}

export default async function CanadaCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CaseStudyPage region="ca" slug={slug} />;
}
