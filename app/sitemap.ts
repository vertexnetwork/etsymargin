import type { MetadataRoute } from "next";
import { PSEO_ENTRIES, CATEGORY_META } from "@/lib/pseo/data";
import { ANSWER_PAGES, DOLLAR_AMOUNTS, dollarSlug } from "@/lib/etsy-fees/content";
import { siteConfig } from "@/lib/site-config";

const BASE_URL = siteConfig.url;

// Surface the brand OG image to Google Images via the sitemap `images`
// extension. Home + the fee pillar are the two entry points worth indexing
// imagery for; per-page dynamic OG images live at hashed metadata routes that
// aren't stable sitemap URLs, so we point at the canonical static asset.
const OG_IMAGE = `${BASE_URL}/og-default.png`;

// `lastmod` from the build's commit author date (Vercel injects this) so
// search engines see stable diffs across deploys instead of "everything
// changed because the build ran today" (Vertex spec §6).
const lastModified = process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE
  ? new Date(process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE)
  : new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      images: [OG_IMAGE],
    },
    // The fee pillar sits at priority 0.9 — second only to the home page.
    // It's the topical-authority hub that every spoke links UP into; we
    // want crawlers visiting it on every pass.
    {
      url: `${BASE_URL}/etsy-fees`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      images: [OG_IMAGE],
    },
    { url: `${BASE_URL}/methodology`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${BASE_URL}/about/mara-whitlock`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/embed`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/recommendations`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/changelog`, lastModified, changeFrequency: "weekly", priority: 0.4 },
    { url: `${BASE_URL}/network`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Public landing pages for the gated audit tool — indexable SEO/GEO surface.
  // The gated /audit and /audit/unlock routes stay OUT of the sitemap (noindex).
  if (siteConfig.features.audit.enabled) {
    staticRoutes.push(
      {
        url: `${BASE_URL}/bulk-etsy-profit-calculator`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/etsy-shop-audit`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    );
  }

  return [
    ...staticRoutes,
    ...DOLLAR_AMOUNTS.map((amount) => ({
      url: `${BASE_URL}/etsy-fees/${dollarSlug(amount)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // PAA answer pages — slightly higher priority than dollar pages because
    // each targets a distinct head-query phrase rather than a numeric
    // variant of the same query template.
    ...ANSWER_PAGES.map((p) => ({
      url: `${BASE_URL}/etsy-fees/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...PSEO_ENTRIES.map((entry) => ({
      url: `${BASE_URL}/etsy-profit-margin/${entry.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      // Tiered by category breadth/volume (see CATEGORY_META): broad evergreen
      // staples 0.8, narrower niches 0.75, seasonal one-offs 0.7. Differentiates
      // the previously-uniform 0.8 without de-prioritising the core spokes —
      // priority is only a crawl hint, so nothing drops out of the index.
      priority: CATEGORY_META[entry.category]?.sitemapPriority ?? 0.8,
    })),
  ];
}
