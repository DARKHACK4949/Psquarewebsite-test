import { AboutPage, aboutMetadata } from "@/components/pages/AboutPage";

export const metadata = aboutMetadata("global");

export default function GlobalAbout() {
  return <AboutPage region="global" />;
}
