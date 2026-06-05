// IndexNow submitter — pushes every URL in the live sitemap to the IndexNow
// API so Bing/Yandex/Seznam recrawl on publish instead of waiting for an
// organic crawl. Run after a production deploy:
//
//   npm run indexnow            # uses https://etsymargin.tools
//   SITE_URL=https://staging... npm run indexnow
//
// The key is a public verification token, served at /{key}.txt (see
// public/8e2d4f7a1c9b6e3052f8a1d4c7b09e63.txt). IndexNow is idempotent —
// resubmitting unchanged URLs is harmless, so a blanket post-deploy ping is
// safe. Exits non-zero only on a hard transport/HTTP failure so it can gate
// a deploy step if wired into CI.

const KEY = "8e2d4f7a1c9b6e3052f8a1d4c7b09e63";
const SITE_URL = (process.env.SITE_URL || "https://etsymargin.tools").replace(/\/$/, "");
const host = new URL(SITE_URL).host;
const keyLocation = `${SITE_URL}/${KEY}.txt`;

async function getSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, {
    headers: { "user-agent": "etsymargin-indexnow/1.0" },
  });
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status} ${res.statusText}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) throw new Error("no <loc> entries found in sitemap.xml");
  return [...new Set(urls)];
}

async function main() {
  const urlList = await getSitemapUrls();
  console.log(`Submitting ${urlList.length} URLs to IndexNow for ${host}…`);

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation, urlList }),
  });

  // 200 = accepted, 202 = accepted/validating. Anything else is a real error.
  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow accepted (HTTP ${res.status}).`);
    return;
  }
  const body = await res.text().catch(() => "");
  throw new Error(`IndexNow rejected: HTTP ${res.status} ${res.statusText} ${body}`);
}

main().catch((err) => {
  console.error(`indexnow-ping failed: ${err.message}`);
  process.exit(1);
});
