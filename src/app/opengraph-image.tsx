import { ImageResponse } from "next/og";

export const alt = "PSQUARE COMPANY Canada: software built around the way your business works";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        <span>Software built around</span>
        <span>the way your business</span>
        <span style={{ color: "#330152" }}>works.</span>
      </div>
      <div style={{ fontSize: 26, color: "#4b4a52" }}>
        Field service · Architecture · Real estate · Canada
      </div>
    </div>,
    size,
  );
}
