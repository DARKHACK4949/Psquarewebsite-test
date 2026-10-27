import { LegalPage, legalMetadata } from "@/components/pages/LegalPage";

export const metadata = legalMetadata("privacy", "global");

export default function GlobalPrivacy() {
  return <LegalPage kind="privacy" region="global" />;
}
