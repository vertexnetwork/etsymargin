// IAB ads.txt — authorizes ad networks to sell inventory on this domain.
// AdSense flags this file as required even on approved sites; missing it
// shows as "ads.txt not found" in the AdSense dashboard. Once Mediavine
// activates, replace the AdSense line with Mediavine's hosted ads.txt
// (they manage authorizations across the full advertiser pool).

export const dynamic = "force-static";

export function GET() {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const lines: string[] = [];

  if (adsenseClientId) {
    // AdSense uses the publisher ID without the leading "ca-".
    // f08c47fec0942fa0 is Google's well-known TAG-ID (constant for AdSense).
    const publisherId = adsenseClientId.replace(/^ca-/, "");
    lines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
