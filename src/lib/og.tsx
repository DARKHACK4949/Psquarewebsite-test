import { ImageResponse } from "next/og";
import type { Region } from "@/lib/region";

export const ogSize = { width: 1200, height: 630 };

const OG = {
  global: {
    alt: "PSQUARE COMPANY: software designed around how your business actually works",
    lines: ["Software, designed", "around how your business", "actually works."],
    footer: "ERP · Field service · AI · Custom software",
  },
  ca: {
    alt: "PSQUARE COMPANY Canada: software built around the way your business works",
    lines: ["Software built around", "the way your business", "works."],
    footer: "Field service · Architecture · Real estate · Canada",
  },
} satisfies Record<Region, { alt: string; lines: string[]; footer: string }>;

export const ogAlt = (region: Region) => OG[region].alt;

/** Social card for an edition's pages (Open Graph and Twitter share it). */
export function ogImage(region: Region) {
  const og = OG[region];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #fafaf8 0%, #fafaf8 55%, #f1eaf5 100%)",
        color: "#0f0e13",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#330152" }} />
        PSQUARE COMPANY
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 76,
          lineHeight: 1.04,
          letterSpacing: -3,
        }}
      >
        {og.lines.map((l, i) => (
          <span key={l} style={i === og.lines.length - 1 ? { color: "#330152" } : undefined}>
            {l}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 26, color: "#4b4a52" }}>{og.footer}</div>
    </div>,
    ogSize,
  );
}
