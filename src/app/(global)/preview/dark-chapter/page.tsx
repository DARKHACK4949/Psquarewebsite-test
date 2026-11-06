import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";

/** Review-only page for the proposed homepage redesign. Not linked, not indexed. */
export const metadata: Metadata = {
  title: { absolute: "Preview: homepage redesign | PSQUARE COMPANY" },
  robots: { index: false, follow: false },
};

export default function DarkChapterPreview() {
  return <HomePage region="global" preview="redesign" />;
}
