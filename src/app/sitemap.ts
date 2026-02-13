import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://audit.jetnoir.systems",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}