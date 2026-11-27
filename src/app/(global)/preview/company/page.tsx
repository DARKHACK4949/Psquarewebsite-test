import type { Metadata } from "next";
import { CompanyPreview } from "@/components/pages/CompanyPreview";

/** Review-only page for the new Company design. Not linked, not indexed. */
export const metadata: Metadata = {
  title: { absolute: "Preview: company | PSQUARE COMPANY" },
  robots: { index: false, follow: false },
};

export default function CompanyPreviewPage() {
  return <CompanyPreview region="global" />;
}
