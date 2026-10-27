import { LegalPage, legalMetadata } from "@/components/pages/LegalPage";

export const metadata = legalMetadata("privacy", "ca");

export default function CanadaPrivacy() {
  return <LegalPage kind="privacy" region="ca" />;
}
