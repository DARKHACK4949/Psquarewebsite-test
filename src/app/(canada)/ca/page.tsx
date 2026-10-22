import { HomePage, homeMetadata } from "@/components/pages/HomePage";

export const metadata = homeMetadata("ca");

export default function CanadaHome() {
  return <HomePage region="ca" />;
}
