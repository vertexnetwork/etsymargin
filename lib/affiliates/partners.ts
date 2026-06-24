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
// only Printify + CustomCat are active today. Gelato is approved but awaiting
// its tracking link — `affiliateUrl: null` keeps it inactive (its slugs fall
// back to the owned product) until the link is pasted in. The remaining mapped
// partners from research (Looka, Gamma, Spocket, Sellfy, ActiveCampaign) are
// held until the cap lifts; add them here as new entries when unlocked.

export type AffiliatePartner = {
  id: string;
  /** Tracking URL. `null` = approved but no link yet → treated as inactive. */
  affiliateUrl: string | null;
  /** Eyebrow label above the headline (carries the "Recommended · …" framing). */
  eyebrow: string;
  headline: string;
  body: string;
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
    body: "If digitizing fees and stitch-count pricing are what's eating the margin in the waterfall above, CustomCat fulfills embroidered hats, sweatshirts, and apparel on demand — no order minimums, per-unit pricing visible up front, so you're not buying a 24-piece run to fill a single order.",
    cta: "See CustomCat pricing",
    slugs: ["embroidered-hats", "embroidered-sweatshirts", "embroidery"],
  },
  {
    id: "gelato",
    affiliateUrl: null, // pending — paste the PartnerStack tracking link to activate
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
