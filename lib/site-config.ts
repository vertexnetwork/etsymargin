// The keystone. Every brand string, domain, color, nav link, JSON-LD type
// in the rest of the codebase reads from this object — env or hub feeds it,
// nothing else hardcodes the values it owns.
//
// Spec: Vertex Network scaffold §4. Mutating the shape is a network-wide
// change; mutating the values is per-spoke.

const env = (key: string, fallback = "") =>
  (typeof process !== "undefined" && process.env[key]) || fallback;

export const siteConfig = {
  // identity
  name: env("NEXT_PUBLIC_SITE_NAME", "Etsy Margin"),
  shortName: env("NEXT_PUBLIC_SITE_SHORT_NAME", "EtsyMargin"),
  domain: env("NEXT_PUBLIC_SITE_DOMAIN", "etsymargin.tools"),
  url: env("NEXT_PUBLIC_SITE_URL", "https://etsymargin.tools"),
  tagline: "Find your true profit before you price.",
  description: env(
    "NEXT_PUBLIC_SITE_DESCRIPTION",
    "Free Etsy profit calculator. See your true net profit and margin after every layered platform fee, including the 12–15% Off-Site Ads cut.",
  ),
  keywords: [
    "etsy fee calculator",
    "etsy profit calculator",
    "off-site ads fee",
    "etsy 2026 fees",
    "true etsy margin",
  ],

  // contact / legal
  supportEmail: env("NEXT_PUBLIC_SITE_CONTACT_EMAIL", "hello@etsymargin.tools"),
  trademarkDisclaimer:
    "Etsy is a registered trademark of Etsy, Inc. Etsy Margin is an independent tool and is not endorsed by, affiliated with, or sponsored by Etsy.",

  // theme — token *values*; canonical token *names* live in app/globals.css.
  theme: {
    colors: {
      bg: "#fbfaf3",
      surface: "#ffffff",
      accent: "#28565b",
      onBg: "#1a2326",
      onAccent: "#fbfaf3",
      muted: "#4a6f73",
      border: "#d9ebec",
      success: "#3d8389",
      danger: "#b94a4a",
    },
    fontDisplay: "Urbanist",
    fontBody: "Poppins",
    radiusCard: "0.75rem",
  },

  // brand mark
  brand: {
    markColor: "#28565b",
    markBgColor: "#fbfaf3",
  },

  // navigation
  nav: {
    primary: [
      { href: "/#categories", label: "Categories" },
      { href: "/embed", label: "Embed" },
      { href: "/about", label: "About" },
    ] as ReadonlyArray<{ href: string; label: string }>,
    footer: {
      product: [
        { href: "/", label: "Calculator" },
        { href: "/embed", label: "Embed on your site" },
        { href: "/#categories", label: "Profit by category" },
        { href: "/recommendations", label: "Recommendations" },
      ],
      company: [
        { href: "/about", label: "About" },
        { href: "/changelog", label: "Changelog" },
      ],
      legal: [
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
        { href: "/contact", label: "Contact" },
      ],
    },
    disclaimer: "Independent tool, not affiliated with Etsy.",
  },

  // JSON-LD
  jsonLd: {
    type: "SoftwareApplication" as const,
    operatingSystem: "Web",
    applicationCategory: "FinanceApplication",
    price: 0,
  },

  // GitHub
  repoUrl: "https://github.com/vertexnetwork/etsymargin",

  // feature flags — drive opt-in template surfaces
  features: {
    embed: {
      enabled: env("NEXT_PUBLIC_EMBED_ENABLED", "1") === "1",
      route: "/embed/widget",
      params: ["p", "s", "m", "as", "c", "ads", "t10"] as const,
    },
    extension: {
      enabled: true,
      chromeWebStoreUrl: "",
    },
    proEnabled: env("NEXT_PUBLIC_PRO_ENABLED", "0") === "1",
    email: {
      enabled: false,
      leadMagnetName: "",
    },
    ads: {
      // Etsy Margin runs zero on-site display ads — primary revenue is the
      // Gumroad PDF, and ads on a "fee transparency" tool would undercut trust.
      provider: env("NEXT_PUBLIC_AD_PROVIDER", "none") as
        | "none"
        | "adsense"
        | "mediavine"
        | "carbon",
    },
    affiliate: {
      enabled: env("NEXT_PUBLIC_AFFILIATE_ENABLED", "1") === "1",
      url: env("NEXT_PUBLIC_AFFILIATE_URL", "https://try.printify.com/j8xm11chwojf"),
      label: env("NEXT_PUBLIC_AFFILIATE_LABEL", "Lower your fees"),
      provider: env("NEXT_PUBLIC_AFFILIATE_PROVIDER", "printify"),
    },
    consent: { required: true },
    themeToggle: false,
  },

  // monetization
  monetization: {
    stripe: { priceIds: { monthly: "", yearly: "" } },
    lemonSqueezy: { storeId: "", productSlug: "" },
    gumroad: {
      productUrl: env("NEXT_PUBLIC_GUMROAD_PRODUCT_URL", ""),
      price: Number(env("NEXT_PUBLIC_GUMROAD_PRICE", "9")),
      enabled: env("NEXT_PUBLIC_GUMROAD_ENABLED", "0") === "1",
    },
  },

  // SEO verification
  verification: {
    google: env("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),
    bing: env("NEXT_PUBLIC_BING_SITE_VERIFICATION"),
  },

  // RFC 9116
  security: {
    contact: env("NEXT_PUBLIC_SECURITY_CONTACT", "mailto:security@etsymargin.tools"),
    expires: "2027-05-10T00:00:00Z",
  },
} as const;

export type SiteConfig = typeof siteConfig;
