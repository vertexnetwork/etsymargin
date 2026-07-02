// Generic PartnerStack affiliate registry for the pSEO spoke pages.
//
// Printify is intentionally NOT in here. It predates this registry, has a
// bespoke multi-variant card (PrintifyCard) reused on the calculator and
// recommendations pages, and its slug list lives in PRINTIFY_FIT on the spoke
// page. Leaving it on its own proven path keeps this change purely additive.
//
// Render contract: each partner lands in exactly ONE affiliate slot per page —
// the bottom slot, below the owned-product (Gumroad) CTA. The affiliate is the
// secondary lever, never the primary pitch, and never more than one per page.
// See app/(site)/etsy-profit-margin/[slug]/page.tsx for the hierarchy.
//
// PartnerStack caps us at 4 live partners until our first commission posts, so
// Printify + CustomCat + Gelato are active today (3 of 4). The remaining mapped
// partners from research (Looka, Gamma, Spocket, Sellfy, ActiveCampaign) are
// held until the cap lifts; add them here as new entries when unlocked. When a
// partner is approved but its tracking link hasn't landed yet, set
// `affiliateUrl: null` to keep it inactive (its slugs fall back to the owned
// product) until the link is pasted in.

export type AffiliatePartner = {
  id: string;
  /** Tracking URL. `null` = approved but no link yet → treated as inactive. */
  affiliateUrl: string | null;
  /** Eyebrow label above the headline (carries the "Recommended · …" framing). */
  eyebrow: string;
  headline: string;
  body: string;
  /**
   * Optional promotional hook rendered as a highlighted callout above the CTA —
   * a time-limited sign-up perk the partner extends to our referrals. Keep it
   * short and verify it's still live before relying on it (partner promos rotate).
   */
  offer?: string;
  /** Button label. */
  cta: string;
  /** pSEO slugs this partner is the intent match for. */
  slugs: string[];
};

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  {
    id: "customcat",
    affiliateUrl: "https://affiliate.customcat.com/o08hyesj0op2",
    eyebrow: "Recommended · Embroidery print-on-demand",
    headline: "Lower your embroidery cost with CustomCat",
    body: "If digitizing fees and stitch-count pricing are eating the margin in the waterfall above, CustomCat fulfills embroidered hats, sweatshirts, and apparel on demand — no order minimums, per-unit pricing up front.",
    // Partner promo as of 2024 — verify it's still running before leaning on it.
    offer:
      "Sign up through our link and get 90 days of CustomCat PRO free — that's 20–40% off the entire catalog for your first 3 months.",
    cta: "Claim 90 days of PRO free",
    slugs: ["embroidered-hats", "embroidered-sweatshirts", "embroidery"],
  },
  {
    id: "gelato",
    affiliateUrl: "https://try.gelato.com/frye9uxornr8",
    eyebrow: "Recommended · Print-on-demand",
    headline: "Lower your production cost with Gelato",
    body: "If manufacturing is what's eating your margin in the waterfall above, Gelato prints posters, canvas, blankets, pillows, totes, cards, and apparel in local production hubs near the buyer — trimming per-unit cost and shipping at once. Free to start, per-unit pricing up front.",
    cta: "See Gelato pricing",
    slugs: [
      "canvas-prints",
      "nursery-prints",
      "watercolor-paintings",
      "throw-blankets-handmade",
      "pillow-covers",
      "canvas-tote-bags",
      "kids-clothing-handmade",
      "hoodies-pod",
      "tank-tops-pod",
      "aprons-handmade",
      "greeting-cards",
      "thank-you-cards",
      "planners-physical",
      "wedding-invitations",
      "christmas-ornaments-handmade",
    ],
  },
];

// slug -> active partner. A partner with no tracking link yet (affiliateUrl
// null) is skipped, so its slugs fall back to the owned-product CTA until the
// link lands. Built once at module load.
const SLUG_TO_PARTNER = new Map<string, AffiliatePartner>();
for (const partner of AFFILIATE_PARTNERS) {
  if (!partner.affiliateUrl) continue;
  for (const slug of partner.slugs) SLUG_TO_PARTNER.set(slug, partner);
}

/** The active affiliate partner for a slug, or undefined if none is live. */
export function affiliateForSlug(slug: string): AffiliatePartner | undefined {
  return SLUG_TO_PARTNER.get(slug);
}
