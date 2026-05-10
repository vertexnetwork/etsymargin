// IAB app-ads.txt — companion to /ads.txt for in-app inventory.
// Required by the IAB even when the site has no app, and even when no
// authorized sellers exist. Mirrors the empty declaration in /ads.txt.

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
