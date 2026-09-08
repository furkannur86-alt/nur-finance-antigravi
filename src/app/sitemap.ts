import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nurfinans.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/impressum`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/agb`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/widerruf`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
