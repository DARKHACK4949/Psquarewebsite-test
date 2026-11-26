import { WorkPage, workMetadata } from "@/components/pages/WorkPage";

export const metadata = workMetadata("global");

export default function GlobalWork() {
  return <WorkPage region="global" />;
}
