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
