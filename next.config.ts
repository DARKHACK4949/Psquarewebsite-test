import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Two root layouts (global at /, Canada at /ca), so unmatched URLs need a global 404.
  experimental: { globalNotFound: true },
  images: {
    formats: ["image/avif", "image/webp"],
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
