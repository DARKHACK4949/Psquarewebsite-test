import { LegalPage, legalMetadata } from "@/components/pages/LegalPage";

export const metadata = legalMetadata("terms", "global");

export default function GlobalTerms() {
  return <LegalPage kind="terms" region="global" />;
}
