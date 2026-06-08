import type { MetadataRoute } from "next";
import { getAllWorkSlugs } from "@/lib/projects";
import { SITE_URL } from "@/lib/site-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const projectPages = getAllWorkSlugs().map((slug) => ({
    url: `${SITE_URL}/work/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...projectPages,
    { url: `${SITE_URL}/intake`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
