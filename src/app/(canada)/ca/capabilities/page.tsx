import { CapabilitiesPage, capabilitiesMetadata } from "@/components/pages/CapabilitiesPage";

export const metadata = capabilitiesMetadata("ca");

export default function CanadaCapabilities() {
  return <CapabilitiesPage region="ca" />;
}
