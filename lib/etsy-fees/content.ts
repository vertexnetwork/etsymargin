// Pillar content + freshness signals for `/etsy-fees`.
//
// The pillar is the topical-authority hub Brian Dean's playbook requires:
// it owns the "does etsy take a cut" / "how much does etsy take" cluster
// and links DOWN to PSEO spokes. Spokes link UP via the hero CTA in
// app/(site)/etsy-profit-margin/[slug]/page.tsx.
//
// `PILLAR_LAST_UPDATED` is surfaced as a visible "Updated" stamp AND as
// `dateModified` on the Article JSON-LD. Bump when fee rates, the FAQ
// answers, or the table data change in a way buyers would notice.

import type { PseoFaq } from "@/lib/pseo/data";

export const PILLAR_LAST_UPDATED = "2026-05-14";
export const PILLAR_DATE_PUBLISHED = "2026-05-14";

export type FeeRow = {
  name: string;
  rate: string;
  when: string;
  on30: string;
  on100: string;
  on200: string;
  anchor: string;
};

export const FEE_ROWS: FeeRow[] = [
  {
    name: "Listing fee",
    rate: "$0.20 flat",
    when: "Per item, per sale (and every 4 months on renewal)",
    on30: "$0.20",
    on100: "$0.20",
    on200: "$0.20",
    anchor: "#listing-fee",
  },
  {
    name: "Transaction fee",
    rate: "6.5%",
    when: "On item price + shipping + gift wrap",
    on30: "$1.95",
    on100: "$6.50",
    on200: "$13.00",
    anchor: "#transaction-fee",
  },
  {
    name: "Payment processing (US)",
    rate: "3% + $0.25",
    when: "Every sale processed via Etsy Payments",
    on30: "$1.15",
    on100: "$3.25",
    on200: "$6.25",
    anchor: "#payment-processing",
  },
  {
    name: "Off-Site Ads (under $10k revenue)",
    rate: "15%",
    when: "If an off-site ad attributes the sale (opt-out)",
    on30: "$4.50",
    on100: "$15.00",
    on200: "$30.00",
    anchor: "#offsite-ads",
  },
  {
    name: "Off-Site Ads (over $10k revenue)",
    rate: "12%",
    when: "Mandatory — capped at $100 per order",
    on30: "$3.60",
    on100: "$12.00",
    on200: "$24.00",
    anchor: "#offsite-ads",
  },
  {
    name: "Currency conversion",
    rate: "2.5%",
    when: "When listing currency ≠ payout currency",
    on30: "$0.75",
    on100: "$2.50",
    on200: "$5.00",
    anchor: "#currency-conversion",
  },
  {
    name: "Regulatory operating fee",
    rate: "0.25%–1.1%",
    when: "UK / Canada DST pass-through",
    on30: "$0.08",
    on100: "$0.25",
    on200: "$0.50",
    anchor: "#regulatory",
  },
];

// PAA-mined FAQ. Goes on the pillar page exclusively as `FAQPage` schema —
// the per-spoke `baseFaq` already covers the high-volume PAA variants on
// every category page, but the pillar gets the comprehensive list so it
// captures the entire question cluster in one place.
export const PILLAR_FAQ: PseoFaq[] = [
  {
    q: "Does Etsy take a cut of every sale?",
    a: "Yes — Etsy charges every seller a layered set of fees on each sale. The minimum on a US sale is around 10% (listing + transaction + payment processing). Off-Site Ads attribution can push that to 25–28%. There is no free path: even a $5 digital download pays the full fee stack.",
  },
  {
    q: "How much does Etsy take from a $100 sale?",
    a: "On a $100 sale to a US buyer with US shipping included in the item price: Listing $0.20 + Transaction $6.50 + Payment processing $3.25 = $9.95 (about 10%). If Off-Site Ads attribute the order at 15%, add $15.00 — total $24.95, about 25% of revenue.",
  },
  {
    q: "What percentage of sales does Etsy take overall?",
    a: "Between 10% and 28%, depending on Off-Site Ads attribution. Standard fees alone are roughly 10% of a typical order. Off-Site Ads — which Etsy enrolls every shop into automatically — adds 12–15% on top of that. Currency conversion and regulatory operating fees can add another 1–3% in specific scenarios.",
  },
  {
    q: "Does Etsy take 30% of every sale?",
    a: "Not on a standard sale. Standard fees total roughly 10%, and Off-Site Ads attribution adds at most 15% (12% above $10k in trailing revenue), capped at $100 per order. 30%+ is only seen in edge cases: currency conversion plus Off-Site Ads on a low-priced order, or sales-tax pass-through scenarios where the seller didn't account for it.",
  },
  {
    q: "Does Etsy take 40%?",
    a: "No. The realistic ceiling is around 28% (10% standard fees + 15% Off-Site Ads + 2.5% currency conversion). The Off-Site Ads fee is capped at $100 per order, which actually pulls the percentage down on high-ticket items above ~$667.",
  },
  {
    q: "Does Etsy really take 15% for Off-Site Ads?",
    a: "Yes — for shops under $10,000 in trailing 12-month revenue, the Off-Site Ads fee is 15% of the order total when Etsy's external ad attributed the sale. Above $10,000 the rate drops to 12% but becomes mandatory (no opt-out). The fee is capped at $100 per single order, which matters for high-ticket sellers.",
  },
  {
    q: "Does Etsy charge $0.20 per listing?",
    a: "Yes. The $0.20 listing fee is charged each time a listing sells. It also renews automatically every 4 months whether the item sells or not, so inactive listings cost money over time. Multi-quantity listings are charged $0.20 per unit sold, not per order.",
  },
  {
    q: "What's the cheapest way to lower my Etsy fees?",
    a: "Two levers matter. First, opt out of Off-Site Ads while you're still under the $10k trailing-revenue threshold — that single change drops your effective fee rate by 12–15 percentage points on attributed orders. Second, fold shipping into the item price instead of charging it separately, so the 6.5% transaction fee applies to a single combined gross rather than item + shipping line items.",
  },
  {
    q: "Are Etsy fees tax-deductible?",
    a: "In most jurisdictions yes — Etsy fees are a cost of doing business and deduct against your shop's gross revenue on Schedule C (US) or the equivalent self-employment return elsewhere. The 1099-K Etsy issues reports gross revenue including the buyer-paid fees, so deducting the fees back out is what gets you to the actual taxable amount. Confirm with a CPA for your specific situation.",
  },
  {
    q: "Is selling on Etsy still worth it in 2026?",
    a: "It depends on the category. Digital downloads, high-ticket handmade, and specialty crafts where buyers seek the maker-platform context still clear comfortable margins. Low-priced physical goods (single $4 stickers, $6 greeting cards), POD apparel, and anything in a hyper-competitive niche struggle once Off-Site Ads attribute the sale. Run your specific numbers in the calculator before committing.",
  },
];

// Dollar-amount programmatic targets. Each renders at
// /etsy-fees/{amount}-dollar-sale and pre-fills the calculator at that
// item price. These capture the specific PAA query "how much does Etsy
// take from a $N sale" that competitors only answer with one FAQ entry.
export const DOLLAR_AMOUNTS = [5, 10, 15, 20, 25, 30, 50, 75, 100, 150, 200] as const;
export type DollarAmount = (typeof DOLLAR_AMOUNTS)[number];

export function dollarSlug(amount: number) {
  return `${amount}-dollar-sale`;
}

export function parseDollarSlug(slug: string): number | null {
  const match = slug.match(/^(\d+)-dollar-sale$/);
  if (!match) return null;
  const n = Number(match[1]);
  return DOLLAR_AMOUNTS.includes(n as DollarAmount) ? n : null;
}

// Zero-volume / long-tail PAA answer pages. Each renders as a single
// Question/Answer surface optimised for a specific PAA query the pillar
// only touches at FAQ depth. Strategy: own the entire question cluster by
// surface area, not by word count — competitors leave most of these
// queries to thin FAQ answers we can outrank with dedicated routes.
export type AnswerPage = {
  slug: string;
  // Title is the canonical phrasing of the PAA question (sentence-cased).
  title: string;
  metaTitle: string;
  metaDescription: string;
  // The direct answer that opens the page in <50 words. This is what wins
  // the "direct answer" slot in PAA expansions and AI Overview citations.
  shortAnswer: string;
  // The full structured response. Headings + body alternating; the page
  // template iterates these and emits H2 + paragraph(s).
  sections: { heading: string; body: string[] }[];
  // Internal-link recommendations specific to this page. Spokes the
  // answer naturally references.
  relatedSpokes?: { slug: string; label: string }[];
};

export const ANSWER_PAGES: AnswerPage[] = [
  {
    slug: "does-etsy-take-a-cut",
    title: "Does Etsy Take a Cut of Every Sale?",
    metaTitle: "Does Etsy Take a Cut? Yes — 10% to 28% in 2026 (Full Math)",
    metaDescription:
      "Yes, Etsy takes a cut of every sale. Baseline US fees total ~10%. Off-Site Ads can push it to 25–28%. Real 2026 numbers, fee-by-fee, no fluff.",
    shortAnswer:
      "Yes — Etsy takes a cut of every sale. The minimum is around 10% on a standard US transaction (listing fee + 6.5% transaction fee + 3% + $0.25 payment processing). If an Off-Site Ad attributed the order, add 12% or 15% on top, pushing total fees to 22–28% of revenue.",
    sections: [
      {
        heading: "The baseline cut: ~10% on every order",
        body: [
          "Three fees apply to every sale Etsy processes, with no way to opt out: the $0.20 listing fee (charged when the listing sells), the 6.5% transaction fee on item + shipping + gift wrap, and payment processing at country-specific rates (3% + $0.25 for US sellers using Etsy Payments).",
          "On a $50 order with shipping rolled into the price, that's $0.20 + $3.25 + $1.75 = $5.20, or 10.4% of revenue. That's the floor — you can't get below it without changing platforms.",
        ],
      },
      {
        heading: "The Off-Site Ads cut: the one that turns 10% into 28%",
        body: [
          "Etsy runs paid ads for your listings on external networks (Google, Facebook, Pinterest, Instagram). When a buyer clicks one of those ads and purchases within 30 days, Etsy charges 12% (shops over $10k trailing revenue, mandatory) or 15% (shops under $10k, opt-out available) of the entire order including shipping.",
          "This is the single biggest cut Etsy takes — and it's the one most new sellers don't model into their pricing. The fee is capped at $100 per order, which is why high-ticket sellers see an effective Off-Site Ads rate below 15% once orders cross ~$667.",
        ],
      },
      {
        heading: "Edge cases that push the cut higher",
        body: [
          "Currency conversion adds 2.5% if your listing currency differs from your payout currency. The regulatory operating fee (0.25%–1.1%) applies to sellers in the UK, France, Italy, Spain, and Turkey, among others. EU sellers pay higher payment processing (4% + €0.30) than US sellers.",
          "Stack all of these and a UK seller's effective fee rate on an Off-Site Ads-attributed order can reach 30%+. Most US sellers land in the 10–25% range depending on Off-Site Ads exposure.",
        ],
      },
    ],
    relatedSpokes: [
      { slug: "greeting-cards", label: "Greeting card margin math" },
      { slug: "digital-downloads-profitability", label: "Digital download profit" },
      { slug: "custom-t-shirts-shipping-costs", label: "POD t-shirt margin" },
    ],
  },
  {
    slug: "does-etsy-take-30-percent",
    title: "Does Etsy Take 30% of Every Sale?",
    metaTitle: "Does Etsy Take 30%? No — Realistic Ceiling is ~28% (2026)",
    metaDescription:
      "Etsy doesn't take 30% on a standard sale. Baseline fees are ~10%. Off-Site Ads adds 12–15%. 30% only appears in edge cases. Full 2026 math.",
    shortAnswer:
      "No. Etsy does not take 30% on a standard sale. Baseline fees (listing + transaction + payment processing) total ~10%. Off-Site Ads attribution adds 12–15%, capped at $100 per order — pushing the realistic ceiling to ~25–28%. 30% only appears in edge cases involving currency conversion, regulatory fees, or sales-tax pass-through confusion.",
    sections: [
      {
        heading: "Where the 30% number comes from",
        body: [
          "The 30% figure tends to circulate in seller forums when someone has stacked every possible fee on a small order. The $0.20 listing fee plus the $0.25 payment processing flat fee disproportionately punish sub-$10 orders — on a $4 sticker, the flat fees alone are 11.25% of revenue. Add the percentage-based fees and Off-Site Ads, and you can get to 30%+ on the smallest end of the price spectrum.",
          "But it isn't a flat rate. A $4 sticker that gets attributed to Off-Site Ads pays a total of $1.20 in fees (30%), while a $50 order pays $5.20 + $7.50 = $12.70 (25.4%). The math is regressive — flat fees consume a larger percentage of small orders.",
        ],
      },
      {
        heading: "The actual ceiling",
        body: [
          "On a real-world basis, the upper bound for Etsy's cut on a standard US sale is approximately 28%: 10% baseline + 15% Off-Site Ads + the occasional 2.5% currency conversion. The Off-Site Ads cap of $100 per order means luxury items effectively pay below 15% on the Off-Site Ads line above ~$667.",
          "30%+ scenarios exist but they're not the rule: a UK seller with regulatory operating fees, currency conversion, and Off-Site Ads on a sub-$20 order can cross 30%. A US seller on a typical $30 order rarely will.",
        ],
      },
      {
        heading: "The sales-tax confusion",
        body: [
          "Many sellers report a 30% number that's actually inflated by sales tax. Etsy collects sales tax in most US states on behalf of the seller and remits it directly to the tax authority — it appears on the seller dashboard as part of the order total, but the seller doesn't keep it. If you compare 'order total' to 'amount deposited' without backing out sales tax, you'll see an inflated 'Etsy cut' that includes tax pass-through. Etsy isn't keeping that money.",
        ],
      },
    ],
    relatedSpokes: [
      { slug: "stickers", label: "Where the 30% number actually applies (stickers)" },
      { slug: "svg-files", label: "Low-priced digital: same regressive math" },
    ],
  },
  {
    slug: "does-etsy-take-a-cut-of-shipping",
    title: "Does Etsy Take a Cut of Shipping Charges?",
    metaTitle: "Does Etsy Charge Fees on Shipping? Yes — Here's the Math (2026)",
    metaDescription:
      "Yes — Etsy's 6.5% transaction fee applies to shipping you charge the buyer, not just the item price. Plus payment processing on the combined gross. Full 2026 breakdown.",
    shortAnswer:
      "Yes. Etsy's 6.5% transaction fee applies to the buyer-facing total, which includes shipping. Payment processing also applies to the gross. The only fees that don't touch shipping are the flat listing fee ($0.20) and the flat per-transaction component of payment processing ($0.25 in the US).",
    sections: [
      {
        heading: "The transaction fee on shipping",
        body: [
          'When Etsy says "6.5% transaction fee," the base for that 6.5% is the entire order total — item price, shipping charged to the buyer, and any gift-wrap charge. A $30 item with $5 shipping is a $35 transaction, and the fee is 6.5% × $35 = $2.28, not 6.5% × $30 = $1.95.',
          "This is the single most common surprise for new sellers who price their item competitively and add 'real cost' shipping on top. You're charged on the full gross.",
        ],
      },
      {
        heading: "Off-Site Ads on shipping",
        body: [
          "If an Off-Site Ad attributed the sale, the 12% or 15% Off-Site Ads fee also applies to the gross (item + shipping). On a $30 + $5 order with 15% Off-Site Ads, that's $5.25 in Off-Site Ads alone — and $0.75 of that is the cut Etsy takes on the shipping line.",
        ],
      },
      {
        heading: "The fold-shipping-into-price strategy",
        body: [
          'Many sellers reduce their effective fee exposure by setting item prices that include shipping and offering "free" shipping. Same total to the buyer, but cleaner fee math: only one line is exposed to the percentage fees, and Etsy\'s algorithm weights free-shipping listings more favorably in search.',
          "Note that the savings aren't on the percentage fees (the gross is the same either way) but on the flat fees: a single $35 order gets one $0.25 processing flat fee, while a $30 + $5 order also gets one $0.25 processing flat fee — so the math is identical here. The strategy mainly helps with multi-quantity orders and Etsy's free-shipping discoverability boost.",
        ],
      },
    ],
    relatedSpokes: [
      { slug: "custom-t-shirts-shipping-costs", label: "POD shipping math (the hardest case)" },
      { slug: "wood-signs", label: "Heavy/oversize shipping margin math" },
    ],
  },
  {
    slug: "why-are-etsy-fees-so-high",
    title: "Why Are Etsy Fees So High?",
    metaTitle: "Why Are Etsy Fees So High? The 2026 Stack, Explained",
    metaDescription:
      "Etsy fees are high because they're layered: listing + transaction + payment processing + Off-Site Ads. Each fee individually looks small. Stacked they reach 25–28%.",
    shortAnswer:
      "Etsy fees feel high because they stack: the $0.20 listing fee, the 6.5% transaction fee, payment processing (3% + $0.25 in the US), and 12–15% Off-Site Ads are all charged on the same sale. Each individually looks reasonable. Stacked, they reach 25–28% on Off-Site Ads-attributed orders — comparable to or higher than Amazon FBA's combined fees.",
    sections: [
      {
        heading: "The stacking effect",
        body: [
          "Most Etsy fee comparisons quote the 6.5% transaction fee as if it were the headline rate. It isn't — it's one of four layers. Payment processing adds 3% + $0.25 (US). The listing fee is $0.20 every time the item sells. Off-Site Ads adds 12% or 15% on attributed orders. On a $30 sale attributed to Off-Site Ads, the layered total is 6.5% + 3.83% (processing as a percentage) + 0.67% (listing as a percentage) + 15% = 25.6%.",
          'The reason this feels deceptive is that Etsy\'s marketing emphasizes only the 6.5% transaction fee. Sellers comparing platforms see "6.5%" and assume the rest is roughly equivalent to other marketplaces. The Off-Site Ads program, in particular, is the line item that changes the comparison.',
        ],
      },
      {
        heading: "Why Off-Site Ads is the lever Etsy uses",
        body: [
          "Etsy's revenue model has shifted progressively toward advertising fees. The 6.5% transaction fee covers the basic marketplace service. Off-Site Ads (12–15%) covers the cost of paid acquisition Etsy is doing on the seller's behalf — Google Shopping ads, Pinterest ads, Facebook ads, Instagram ads. Etsy spends real money on those impressions and charges the seller when one converts.",
          "The economics are reasonable when an Off-Site Ad genuinely drove the sale. They're not reasonable when the buyer would have purchased anyway and Etsy attributes the order to the ad just because the buyer clicked it before buying. Etsy uses a 30-day attribution window, which is generous and captures organic purchases that happened to follow an ad click.",
        ],
      },
      {
        heading: "How to lower your effective fee rate",
        body: [
          "Five levers actually move the needle. Opt out of Off-Site Ads while you're under $10k trailing revenue — the single biggest one. Bundle low-priced items to outrun flat-fee drag. Fold shipping into the item price. Prune dead listings that renew every 4 months without selling. Build off-Etsy channels (Instagram, wholesale, your own Shopify) for repeat buyers so subsequent orders avoid the fee stack entirely.",
        ],
      },
    ],
    relatedSpokes: [
      { slug: "digital-downloads-profitability", label: "The highest-margin Etsy category" },
      { slug: "stickers", label: "Where stacking hurts most" },
    ],
  },
  {
    slug: "does-etsy-charge-monthly-fees",
    title: "Does Etsy Charge a Monthly Fee to Sell?",
    metaTitle: "Does Etsy Have a Monthly Fee? No — But Etsy Plus is $10/mo (2026)",
    metaDescription:
      "Standard Etsy shops have no monthly fee — fees are per-sale only. Etsy Plus is a $10/month optional upgrade. Full 2026 fee structure explained.",
    shortAnswer:
      "No, standard Etsy shops have no monthly subscription fee. All Etsy fees are charged per-sale: $0.20 listing fee, 6.5% transaction fee, payment processing, and Off-Site Ads (when applicable). Etsy Plus is a $10/month optional upgrade that adds discounts on listings and credits for advanced shop tools — most small shops do not need it.",
    sections: [
      {
        heading: "Why this question comes up so often",
        body: [
          "Shopify charges $39/month, BigCommerce charges $39/month, Squarespace Commerce starts at $23/month. New sellers comparing platforms often assume Etsy follows the same model. It doesn't — Etsy is a pure marketplace-fee model. You can open a shop, list items, and pay nothing until your first sale.",
          'The trade-off is that Etsy\'s per-sale fees are higher than the per-sale costs on a self-hosted store. The $0.20 listing fee that recurs every 4 months is the only "subscription-like" cost, and it only applies to listings you actively keep up.',
        ],
      },
      {
        heading: "Etsy Plus: the optional $10/month",
        body: [
          "Etsy Plus is an optional upgrade for $10/month that includes: 15 listing credits per month (saving up to $3 vs. paying $0.20 each), $5 in Etsy Ads credit per month, custom shop URL options, restock request features for sold-out items, and access to discounted custom packaging/business card vendors.",
          "Whether it's worth it: if your shop produces enough new listings or restocks each month that the included credits cover the $10 cost, sure. Most small shops don't reach that bar and shouldn't subscribe. The credits don't roll over, so the math has to work each month.",
        ],
      },
      {
        heading: "Pattern by Etsy: the actual subscription product",
        body: [
          "Pattern (etsy.com/pattern) is Etsy's separate Shopify-like store builder — $15/month flat, no transaction fees on Pattern's side, but you still pay Etsy listing and processing fees if you sync from your Etsy shop. Most sellers don't use Pattern; it's a niche product Etsy has deprioritized.",
        ],
      },
    ],
  },
  {
    slug: "how-much-does-etsy-pay-sellers",
    title: "How Much Does Etsy Pay Sellers Per Sale?",
    metaTitle: "How Much Does Etsy Pay Sellers? 72%–90% of the Order (2026)",
    metaDescription:
      "Etsy doesn't pay sellers — sellers receive the buyer's payment minus fees. Sellers keep 72–90% of the order total depending on Off-Site Ads. Full 2026 math.",
    shortAnswer:
      "Etsy doesn't pay sellers directly — buyers pay Etsy via Etsy Payments, and Etsy deposits the order minus all fees to the seller. Sellers typically receive 72–90% of the gross order total: roughly 90% on standard sales, 72–78% on orders attributed to Off-Site Ads.",
    sections: [
      {
        heading: "The seller deposit math",
        body: [
          "On a $50 order with item-only pricing (no separate shipping line), a US seller with standard fees deposits: $50 − $0.20 listing − $3.25 transaction − $1.75 payment processing = $44.80. That's 89.6% of the gross.",
          "If Off-Site Ads attributed the sale at 15%, deduct another $7.50 — final deposit is $37.30, or 74.6%. Same order, same buyer, same product — the Off-Site Ads attribution alone changes the seller's take by $7.50.",
        ],
      },
      {
        heading: "Payout timing",
        body: [
          "Etsy Payments deposits to your bank on a configurable schedule (daily, weekly, biweekly, or monthly) once funds clear the platform's reserve period. New shops face a 3–10 day reserve hold on initial sales; established shops settle within 1–3 business days of the order being processed.",
          "The deposit is the order total minus all fees minus sales tax (sales tax is remitted directly by Etsy, never passed to the seller). What you see in your bank is the actual net cash you keep — fee deductions happen on Etsy's side before the deposit posts.",
        ],
      },
      {
        heading: "Why the 'percentage paid' varies so much",
        body: [
          "The seller's take-home percentage depends almost entirely on Off-Site Ads exposure. Three identical sales can yield 90%, 78%, and 72% to the seller depending on whether each sale was attributed to an Off-Site Ad and at what tier (under or over $10k revenue threshold).",
          "Shops under $10k can opt out of Off-Site Ads and lock in the higher take-home rate. Shops over $10k cannot opt out but get the 12% rate instead of 15%. This is the single most important policy decision a new Etsy shop makes.",
        ],
      },
    ],
    relatedSpokes: [
      { slug: "digital-downloads-profitability", label: "Highest take-home percentage" },
      { slug: "custom-t-shirts-shipping-costs", label: "Lowest take-home (POD apparel)" },
    ],
  },
  {
    slug: "does-etsy-take-a-cut-of-tips",
    title: "Does Etsy Take a Cut of Buyer Tips?",
    metaTitle: "Does Etsy Take Fees on Tips? Yes — 6.5% + Processing (2026)",
    metaDescription:
      "Yes — Etsy charges the 6.5% transaction fee and 3% + $0.25 payment processing on buyer tips at checkout. Off-Site Ads also applies to tips on attributed orders.",
    shortAnswer:
      "Yes. Etsy applies the 6.5% transaction fee and payment processing fee (3% + $0.25 in the US) to any buyer tip added at checkout. If the order was attributed to an Off-Site Ad, the 12% or 15% Off-Site Ads fee also applies to the tip portion.",
    sections: [
      {
        heading: "How tips work on Etsy",
        body: [
          "Etsy added a buyer-side tipping option in late 2023 — at checkout, buyers can optionally add a tip on top of the item price and shipping. The tip is added to the order total before fees are calculated, which means Etsy's standard fee stack applies to the tipped amount.",
          "A buyer who adds a $5 tip on a $30 order isn't sending you $5 extra. They're sending Etsy a $35 transaction, and you receive the $5 minus the 6.5% transaction fee ($0.33), the 3% payment processing ($0.15), and Off-Site Ads if attributed ($0.75 at 15%). Net to you: $3.77, not $5.",
        ],
      },
      {
        heading: "Why this matters for pricing",
        body: [
          "Sellers who promote 'tip jar' messaging in their listings should know that tips aren't fee-free pass-throughs. The seller economics on a tip are slightly worse than on item revenue because the flat per-transaction fees ($0.20 listing, $0.25 processing) are already amortized across the order — but the percentage fees do apply.",
          "On Off-Site Ads-attributed orders, the math gets worse: a buyer adding a $20 tip thinking they're being generous is sending you $14.20 net after the 6.5% + 3% + 15% deductions apply. The gesture survives; the dollars don't fully.",
        ],
      },
    ],
  },
  {
    slug: "how-much-does-etsy-take-from-digital-downloads",
    title: "How Much Does Etsy Take From Digital Downloads?",
    metaTitle: "Etsy Digital Download Fees: How Much Etsy Takes in 2026",
    metaDescription:
      "Etsy takes the same 6.5% transaction fee + payment processing on digital downloads as physical products. No shipping fee exposure. Net ~89% on a $5 digital sale.",
    shortAnswer:
      "Etsy takes the same fee stack on digital downloads as on physical products: $0.20 listing + 6.5% transaction + 3% + $0.25 payment processing (US). On a $5 digital download, that's $0.78 in fees — about 15.6% of revenue. Off-Site Ads attribution adds 12–15% on top, reaching 27–30% on small digital sales.",
    sections: [
      {
        heading: "Why digital downloads aren't fee-exempt",
        body: [
          "A common misconception is that Etsy waives or reduces fees for digital products because there's no shipping. It doesn't. The transaction fee is 6.5% of whatever the buyer pays, regardless of whether the product is a physical good, a downloadable PDF, or an SVG cut file. Payment processing applies identically.",
          "The advantage of digital is purely on the cost side: no manufacturing, no shipping, no packaging. The fee structure is identical, but with $0 cost of goods, the seller's margin after fees is the highest in any Etsy category — typically 84–89% on a $5 sale.",
        ],
      },
      {
        heading: "The flat-fee problem at low price points",
        body: [
          "Digital downloads tend to be priced low — $3–8 is typical for printable wall art, $4–10 for SVG cut files, $5–15 for Canva templates. The $0.20 listing fee plus the $0.25 payment processing flat fee is $0.45 — already 9% of a $5 sale before any percentage-based fee.",
          "This is the regressive part of Etsy's fee structure. A $5 digital download faces an effective fee rate of ~15.6%, while a $50 digital bundle faces ~10.6%. Bundling low-priced digitals is the most direct lever on this drag.",
        ],
      },
      {
        heading: "Off-Site Ads on digital",
        body: [
          "Digital downloads are heavily promoted via Off-Site Ads — Etsy's algorithm aggressively pushes high-margin digital products into Pinterest and Google Shopping campaigns. If you're a digital seller under $10k, opting out of Off-Site Ads is almost certainly worth it: the external traffic Etsy generates for digital products is rarely the difference between a viable shop and a failing one, but the 15% mandatory haircut on every attributed sale absolutely is.",
        ],
      },
    ],
    relatedSpokes: [
      { slug: "digital-downloads-profitability", label: "Full digital download profit math" },
      { slug: "svg-files", label: "SVG-specific margin math" },
      { slug: "printable-art-margins", label: "Printable wall art math" },
    ],
  },
];

export function getAnswerPage(slug: string): AnswerPage | undefined {
  return ANSWER_PAGES.find((p) => p.slug === slug);
}
