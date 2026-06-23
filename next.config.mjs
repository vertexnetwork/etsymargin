// CSP is computed once at startup from siteConfig + env, then served as
// a per-route header. The embed widget gets a relaxed `frame-ancestors *`
// because that's the whole point of the embed; every other route gets
// `frame-ancestors 'none'`.
//
// CSP-relevant providers are inferred from env so a deploy that flips
// NEXT_PUBLIC_AD_PROVIDER doesn't need a code change.

const inferProviders = () => ({
  vercelAnalytics: true,
  speedInsights: true,
  ga4: Boolean(process.env.NEXT_PUBLIC_GA_ID),
  clarity: Boolean(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID),
  plausible: Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN),
  adsense: process.env.NEXT_PUBLIC_AD_PROVIDER === "adsense",
  mediavine: process.env.NEXT_PUBLIC_AD_PROVIDER === "mediavine",
  carbon: process.env.NEXT_PUBLIC_AD_PROVIDER === "carbon",
  gumroad: process.env.NEXT_PUBLIC_GUMROAD_ENABLED === "1",
  gumroadOrigin: (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL).origin;
    } catch {
      return "";
    }
  })(),
});

// Re-implement buildCSP / buildEmbedCSP inline here so next.config.mjs
// stays plain ESM (it can't import .ts modules without transpilation).
// Mirror lib/csp.ts; keep the two in sync — there's a unit test that
// asserts equivalence (tests/unit/csp.test.ts).
const composeCsp = (providers, embed = false) => {
  const dir = {};
  const add = (k, ...v) => {
    dir[k] = dir[k] || new Set();
    v.forEach((x) => dir[k].add(x));
  };
  add("default-src", "'self'");
  add("base-uri", "'self'");
  add("form-action", "'self'");
  add("frame-ancestors", embed ? "*" : "'none'");
  add("img-src", "'self'", "data:", "blob:");
  add("font-src", "'self'", "data:");
  add("manifest-src", "'self'");
  add("media-src", "'self'");
  add("object-src", "'none'");
  add("style-src", "'self'", "'unsafe-inline'");
  add("script-src", "'self'", "'unsafe-inline'");
  add("connect-src", "'self'");
  if (providers.vercelAnalytics || providers.speedInsights) {
    add("script-src", "https://*.vercel-insights.com", "https://va.vercel-scripts.com");
    add("connect-src", "https://*.vercel-insights.com", "https://va.vercel-scripts.com");
  }
  if (providers.ga4) {
    add("script-src", "https://www.googletagmanager.com", "https://www.google-analytics.com");
    add("img-src", "https://www.google-analytics.com");
    add("connect-src", "https://www.google-analytics.com", "https://*.analytics.google.com");
  }
  if (providers.clarity) {
    add("script-src", "https://www.clarity.ms");
    add("img-src", "https://www.clarity.ms");
    add("connect-src", "https://www.clarity.ms", "https://*.clarity.ms");
  }
  if (providers.plausible) {
    add("script-src", "https://plausible.io");
    add("connect-src", "https://plausible.io");
  }
  if (providers.adsense) {
    add("script-src", "https://pagead2.googlesyndication.com");
    add("img-src", "https://pagead2.googlesyndication.com");
    add("connect-src", "https://pagead2.googlesyndication.com");
    // `frame-src` is its own directive and does NOT inherit from
    // default-src once specified, so 'self' must be explicit or the
    // /embed page can no longer iframe /embed/widget (same origin).
    add("frame-src", "'self'", "https://googleads.g.doubleclick.net");
  }
  if (providers.mediavine) {
    add("script-src", "https://scripts.mediavine.com", "https://faves.grow.me");
    add("connect-src", "https://scripts.mediavine.com", "https://faves.grow.me");
    add("img-src", "https://*.mediavine.com");
  }
  if (providers.carbon) {
    add("script-src", "https://srv.carbonads.net", "https://cdn.carbonads.com");
    add("img-src", "https://srv.carbonads.net", "https://cdn.carbonads.com");
  }
  if (providers.gumroad) {
    // Mirror lib/csp.ts. gumroad.js is a loader that pulls the real overlay
    // bundle + CSS from assets.gumroad.com, so both hosts must be allowed or
    // the overlay fails and the button hard-redirects to checkout. The checkout
    // iframes the product URL's origin (may be a custom domain). 'self' must be
    // explicit on frame-src so same-origin framing survives.
    add("script-src", "https://gumroad.com", "https://assets.gumroad.com");
    add("style-src", "https://assets.gumroad.com");
    add("img-src", "https://gumroad.com", "https://assets.gumroad.com");
    add("connect-src", "https://gumroad.com", "https://assets.gumroad.com");
    add("frame-src", "'self'", "https://gumroad.com");
    if (providers.gumroadOrigin) {
      add("frame-src", providers.gumroadOrigin);
      add("connect-src", providers.gumroadOrigin);
    }
  }
  return Object.entries(dir)
    .map(([k, s]) => `${k} ${[...s].join(" ")}`)
    .join("; ");
};

const providers = inferProviders();
const csp = composeCsp(providers, false);
const embedCsp = composeCsp(providers, true);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: import.meta.dirname,
  async headers() {
    return [
      {
        source: "/embed/widget",
        headers: [
          { key: "Content-Security-Policy", value: embedCsp },
          { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
      {
        source: "/((?!embed/).*)",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

export default nextConfig;
