import { ogAlt, ogImage, ogSize } from "@/lib/og";

export const alt = ogAlt("global");
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("global");
}
