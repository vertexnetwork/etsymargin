// Build a Content-Security-Policy header value parameterized by the
// providers actually loaded on this spoke. Avoids shipping every site
// with the union allowlist.
//
// Spec: Vertex Network scaffold §11. Consumed by next.config.mjs.

export type CspProviders = {
  vercelAnalytics?: boolean;
  speedInsights?: boolean;
  ga4?: boolean;
  clarity?: boolean;
  plausible?: boolean;
  adsense?: boolean;
  mediavine?: boolean;
  carbon?: boolean;
  reddit?: boolean;
};

type DirectiveMap = Record<string, Set<string>>;

function add(map: DirectiveMap, key: string, ...values: string[]) {
  if (!map[key]) map[key] = new Set();
  for (const v of values) map[key].add(v);
}

export function buildCSP(providers: CspProviders = {}): string {
  const d: DirectiveMap = {};

  add(d, "default-src", "'self'");
  add(d, "base-uri", "'self'");
  add(d, "form-action", "'self'");
  add(d, "frame-ancestors", "'none'");
  add(d, "img-src", "'self'", "data:", "blob:");
  add(d, "font-src", "'self'", "data:");
  add(d, "manifest-src", "'self'");
  add(d, "media-src", "'self'");
  add(d, "object-src", "'none'");
  add(d, "style-src", "'self'", "'unsafe-inline'");
  add(d, "script-src", "'self'", "'unsafe-inline'");
  add(d, "connect-src", "'self'");

  if (providers.vercelAnalytics || providers.speedInsights) {
    add(d, "script-src", "https://*.vercel-insights.com", "https://va.vercel-scripts.com");
    add(d, "connect-src", "https://*.vercel-insights.com", "https://va.vercel-scripts.com");
  }
  if (providers.ga4) {
    add(d, "script-src", "https://www.googletagmanager.com", "https://www.google-analytics.com");
    add(d, "img-src", "https://www.google-analytics.com");
    add(d, "connect-src", "https://www.google-analytics.com", "https://*.analytics.google.com");
  }
  if (providers.clarity) {
    add(d, "script-src", "https://www.clarity.ms");
    add(d, "img-src", "https://www.clarity.ms");
    add(d, "connect-src", "https://www.clarity.ms", "https://*.clarity.ms");
  }
  if (providers.plausible) {
    add(d, "script-src", "https://plausible.io");
    add(d, "connect-src", "https://plausible.io");
  }
  if (providers.adsense) {
    add(d, "script-src", "https://pagead2.googlesyndication.com");
    add(d, "img-src", "https://pagead2.googlesyndication.com");
    add(d, "connect-src", "https://pagead2.googlesyndication.com");
    // `frame-src` is its own directive and does NOT inherit from
    // default-src once specified, so we must include 'self' explicitly
    // or the /embed page can no longer iframe /embed/widget (same
    // origin). Forgetting this broke the live preview on the embed
    // page once adsense flipped on in production.
    add(d, "frame-src", "'self'", "https://googleads.g.doubleclick.net");
  }
  if (providers.mediavine) {
    add(d, "script-src", "https://scripts.mediavine.com", "https://faves.grow.me");
    add(d, "connect-src", "https://scripts.mediavine.com", "https://faves.grow.me");
    add(d, "img-src", "https://*.mediavine.com");
  }
  if (providers.carbon) {
    add(d, "script-src", "https://srv.carbonads.net", "https://cdn.carbonads.com");
    add(d, "img-src", "https://srv.carbonads.net", "https://cdn.carbonads.com");
  }
  if (providers.reddit) {
    // pixel.js is served from redditstatic; the pixel beacons events and
    // pulls its config from *.reddit.com (alb.reddit.com / pixel-config).
    add(d, "script-src", "https://www.redditstatic.com");
    add(d, "img-src", "https://*.reddit.com");
    add(d, "connect-src", "https://*.reddit.com");
  }

  return Object.entries(d)
    .map(([key, vals]) => `${key} ${[...vals].join(" ")}`)
    .join("; ");
}

// Spec §10: /embed must allow framing from anywhere; the rest of the
// site refuses framing. Build the embed CSP separately because it
// needs frame-ancestors *.
export function buildEmbedCSP(providers: CspProviders = {}): string {
  const main = buildCSP(providers);
  return main.replace(/frame-ancestors '?none'?/, "frame-ancestors *");
}
