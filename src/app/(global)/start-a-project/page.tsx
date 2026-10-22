import { ContactPage, contactMetadata } from "@/components/pages/ContactPage";

export const metadata = contactMetadata("global");

export default function GlobalStartAProject() {
  return <ContactPage region="global" />;
}
