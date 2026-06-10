import type { MetadataRoute } from "next";

const BASE = "https://www.markcheverton.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the admin dashboard and API routes out of search results.
      disallow: ["/admin", "/api"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
