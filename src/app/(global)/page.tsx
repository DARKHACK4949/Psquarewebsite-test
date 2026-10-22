import { HomePage, homeMetadata } from "@/components/pages/HomePage";

export const metadata = homeMetadata("global");

export default function GlobalHome() {
  return <HomePage region="global" />;
}
