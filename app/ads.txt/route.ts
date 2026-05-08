// IAB ads.txt — authorizes ad networks to sell inventory on this domain.
// AdSense flags this file as required even on approved sites; missing it
// shows as "ads.txt not found" in the AdSense dashboard.
//
// Publisher ID is hardcoded by design: it's a public identifier (appears
// in page source for verification) and hardcoding makes the file robust
// to env-var propagation issues. Once Mediavine activates, replace this
// line with Mediavine's hosted ads.txt (they manage authorizations across
// the full advertiser pool).

export const dynamic = "force-static";

export function GET() {
  const body =
    "google.com, pub-6985819972152617, DIRECT, f08c47fec0942fa0\n";
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
