import { CareersPage, careersMetadata } from "@/components/pages/CareersPage";

export const metadata = careersMetadata("global");

export default function GlobalCareers() {
  return <CareersPage region="global" />;
}
