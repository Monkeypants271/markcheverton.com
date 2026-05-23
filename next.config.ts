import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "markcheverton.com" },
      { protocol: "https", hostname: "www.markcheverton.com" },
    ],
  },
};

export default nextConfig;
