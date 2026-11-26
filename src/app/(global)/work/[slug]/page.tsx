import { CaseStudyPage, caseMetadata, caseSlugs } from "@/components/pages/CaseStudyPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseSlugs("global").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return caseMetadata("global", slug);
}

export default async function GlobalCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CaseStudyPage region="global" slug={slug} />;
}
