import { ContactPage, contactMetadata } from "@/components/pages/ContactPage";

export const metadata = contactMetadata("ca");

export default function CanadaStartAProject() {
  return <ContactPage region="ca" />;
}
