import type { MetadataRoute } from "next";
import { isResolveEnabled } from "@/lib/features";
import { getAllWorkSlugs } from "@/lib/projects";
import { SITE_URL } from "@/lib/site-seo";

/** Fixed at build time, so lastmod only moves when the site is actually redeployed. */
const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
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
    ...(isResolveEnabled()
      ? [{ url: `${SITE_URL}/resolve`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }]
      : []),
    { url: `${SITE_URL}/intake`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
