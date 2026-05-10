// IAB ads.txt — declares authorized digital sellers for this domain.
// Etsy Margin runs no display ads (see lib/site-config.ts:features.ads),
// so this file lists no authorized sellers. Crawlers see an empty
// declaration rather than a 404, which is the IAB-recommended posture
// for ad-free sites.

export const dynamic = "force-static";

export function GET() {
  const body = "# This site serves no third-party display ads.\n";
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
