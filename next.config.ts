import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Two root layouts (global at /, Canada at /ca), so unmatched URLs need a global 404.
  experimental: { globalNotFound: true },
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 is used for the Company page photo gallery, where detail matters.
    qualities: [75, 90],
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
