import changelogData from "@/content/changelog.json";
import { siteConfig } from "@/lib/site-config";

// RSS 2.0 feed of the changelog (date + title per commit landed on main).
// Built from the same content/changelog.json the /changelog page renders, so
// feed and page never drift. Linked from the changelog page via
// `alternates.types` and discoverable by feed readers + syndication crawlers.

export const dynamic = "force-static";

type Entry = { hash: string; date: string; title: string };

const BASE_URL = siteConfig.url;

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Midday UTC avoids the date sliding to the prior day in negative offsets.
const rfc822 = (iso: string) => new Date(`${iso}T12:00:00Z`).toUTCString();

export async function GET() {
  const entries = (changelogData as Entry[]).filter((e) => e.date && e.title);
  const latest = entries[0]?.date;

  const items = entries
    .map((e) => {
      const link = `${siteConfig.repoUrl}/commit/${e.hash}`;
      return [
        "    <item>",
        `      <title>${escapeXml(e.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="false">${e.hash}</guid>`,
        `      <pubDate>${rfc822(e.date)}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(siteConfig.name)} — Changelog</title>`,
    `    <link>${BASE_URL}/changelog</link>`,
    `    <description>Every commit landed on main for ${escapeXml(siteConfig.name)}, in order.</description>`,
    "    <language>en</language>",
    `    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    latest ? `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>` : "",
    items,
    "  </channel>",
    "</rss>",
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=10800",
    },
  });
}
