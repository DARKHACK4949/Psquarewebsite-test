import type { Metadata } from "next";
import { LandingPreview } from "@/components/pages/LandingPreview";

/** Review-only page for the new landing design. Not linked, not indexed. */
export const metadata: Metadata = {
  title: { absolute: "Preview: landing | PSQUARE COMPANY" },
  robots: { index: false, follow: false },
};

export default function LandingPreviewPage() {
  return <LandingPreview region="global" />;
}
