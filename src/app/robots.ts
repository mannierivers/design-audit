import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/api/"], // Don't crawl API routes
    },
    sitemap: "https://audit.jetnoir.systems/sitemap.xml",
  };
}