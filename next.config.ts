import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Private runtime configuration/state must never enter deployable file traces.
  outputFileTracingExcludes: { "/*": ["./.env*", "./.local/**/*"] },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "markcheverton.com" },
      { protocol: "https", hostname: "www.markcheverton.com" },
    ],
  },
};

export default nextConfig;
