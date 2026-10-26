import { AboutPage, aboutMetadata } from "@/components/pages/AboutPage";

export const metadata = aboutMetadata("ca");

export default function CanadaAbout() {
  return <AboutPage region="ca" />;
}
