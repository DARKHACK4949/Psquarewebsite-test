import { WorkPage, workMetadata } from "@/components/pages/WorkPage";

export const metadata = workMetadata("ca");

export default function CanadaWork() {
  return <WorkPage region="ca" />;
}
