import { CareersPage, careersMetadata } from "@/components/pages/CareersPage";

export const metadata = careersMetadata("ca");

export default function CanadaCareers() {
  return <CareersPage region="ca" />;
}
