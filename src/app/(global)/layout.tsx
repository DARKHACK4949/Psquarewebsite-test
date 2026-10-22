import type { ReactNode } from "react";
import { RootDocument, rootMetadata } from "@/components/pages/RootDocument";

export const metadata = rootMetadata("global");
export { viewport } from "@/components/pages/RootDocument";

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument region="global">{children}</RootDocument>;
}
