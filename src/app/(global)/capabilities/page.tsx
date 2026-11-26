import { CapabilitiesPage, capabilitiesMetadata } from "@/components/pages/CapabilitiesPage";

export const metadata = capabilitiesMetadata("global");

export default function GlobalCapabilities() {
  return <CapabilitiesPage region="global" />;
}
