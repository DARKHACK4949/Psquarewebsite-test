import { LegalPage, legalMetadata } from "@/components/pages/LegalPage";

export const metadata = legalMetadata("terms", "ca");

export default function CanadaTerms() {
  return <LegalPage kind="terms" region="ca" />;
}
