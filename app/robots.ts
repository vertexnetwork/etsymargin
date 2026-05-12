import type { MetadataRoute } from "next";
import { promises as fs } from "node:fs";
import path from "node:path";
import { siteConfig } from "@/lib/site-config";

// AI bot allowlist is sourced from public/ai-bots.json (hub-synced —
// see .github/workflows/sync-from-hub.yml). Loading the JSON at build
// time keeps the spoke in sync with the network's canonical list
// without coupling render-time to disk I/O.

type AiBots = { allow: string[]; disallow: string[] };

async function loadAiBots(): Promise<AiBots> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "public", "ai-bots.json"), "utf8");
    const parsed = JSON.parse(raw) as Partial<AiBots>;
    return {
      allow: Array.isArray(parsed.allow) ? parsed.allow : [],
      disallow: Array.isArray(parsed.disallow) ? parsed.disallow : [],
    };
  } catch {
    // Fail soft — never block the build over a missing/corrupt allowlist.
    return { allow: [], disallow: [] };
  }
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const bots = await loadAiBots();
  const rules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/", disallow: ["/embed/widget"] },
  ];
  for (const ua of bots.allow) {
    rules.push({ userAgent: ua, allow: "/" });
  }
  for (const ua of bots.disallow) {
    rules.push({ userAgent: ua, disallow: "/" });
  }
  return {
    rules,
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
