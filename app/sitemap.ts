import type { MetadataRoute } from "next";
import { PSEO_ENTRIES } from "@/lib/pseo/data";
import { siteConfig } from "@/lib/site-config";

const BASE_URL = siteConfig.url;

// `lastmod` from the build's commit author date (Vercel injects this) so
// search engines see stable diffs across deploys instead of "everything
// changed because the build ran today" (Vertex spec §6).
const lastModified =
  process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE
    ? new Date(process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE)
    : new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/embed`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/recommendations`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/changelog`, lastModified, changeFrequency: "weekly", priority: 0.4 },
    { url: `${BASE_URL}/network`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...PSEO_ENTRIES.map((entry) => ({
      url: `${BASE_URL}/etsy-profit-margin/${entry.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
