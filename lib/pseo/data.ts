import type { CalculatorInputs } from "@/lib/fees";

export type PseoFaq = { q: string; a: string };

export type PseoEntry = {
  slug: string;
  category: string;
  title: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubcopy: string;
  prefilledScenario: Pick<
    CalculatorInputs,
    | "itemPrice"
    | "shippingCharged"
    | "manufacturingCost"
    | "actualShippingCost"
  >;
  faq: PseoFaq[];
};

const baseFaq: PseoFaq[] = [
  {
    q: "Does Etsy really take 15% for Off-Site Ads?",
    a: "Yes — for shops under $10,000 in trailing 12-month revenue, the Off-Site Ads fee is 15% of the order total. Above $10,000 it drops to 12% but becomes mandatory. The fee is capped at $100 per order.",
  },
  {
    q: "What's the cheapest way to lower my Etsy fees?",
    a: "Two levers actually move the needle: opting out of Off-Site Ads while you're still under the $10k threshold, and rolling shipping into the item price so you don't pay the 6.5% transaction fee on a separately-charged shipping line.",
  },
];

export const PSEO_ENTRIES: PseoEntry[] = [
  {
    slug: "digital-downloads-profitability",
    category: "Digital",
    title: "Etsy Digital Download Profit Margin: True Math (2026)",
    metaDescription:
      "How much do you actually make on a $5 Etsy digital download after all fees? Real 2026 numbers, fee-by-fee.",
    heroHeadline: "Are Etsy digital downloads still worth it in 2026?",
    heroSubcopy:
      "Zero shipping cost makes digital downloads the highest-margin Etsy category — but the $0.20 listing fee plus payment processing flat fee bites hard at low price points.",
    prefilledScenario: {
      itemPrice: 5,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: [
      {
        q: "Are digital downloads exempt from the transaction fee?",
        a: "No. Etsy charges the same 6.5% transaction fee on digital products as on physical ones. The advantage is purely on the cost side — no manufacturing, no shipping.",
      },
      ...baseFaq,
    ],
  },
  {
    slug: "custom-t-shirts-shipping-costs",
    category: "Apparel",
    title: "Etsy Custom T-Shirt Profit After Fees & Shipping (2026)",
    metaDescription:
      "POD t-shirt sellers: see your real take-home on Etsy after Printify cost, shipping, and the 15% Off-Site Ads fee.",
    heroHeadline: "Why your $24 Etsy t-shirt nets you under $4.",
    heroSubcopy:
      "Print-on-demand sellers eat double overhead: a fulfillment supplier and Etsy's full fee stack. The waterfall below shows where every dollar goes.",
    prefilledScenario: {
      itemPrice: 24,
      shippingCharged: 5.5,
      manufacturingCost: 11,
      actualShippingCost: 5.5,
    },
    faq: baseFaq,
  },
  {
    slug: "handmade-jewelry-fees",
    category: "Jewelry",
    title: "Etsy Handmade Jewelry: Fee Breakdown & Pricing Math (2026)",
    metaDescription:
      "Set your handmade jewelry prices with the real Etsy fee math — from sterling silver studs to statement pieces.",
    heroHeadline: "Pricing handmade jewelry without giving Etsy half your margin.",
    heroSubcopy:
      "Materials cost is volatile and shipping is light, so jewelry sellers tend to over-discount. Run your real numbers below before you set a sale.",
    prefilledScenario: {
      itemPrice: 38,
      shippingCharged: 4,
      manufacturingCost: 9,
      actualShippingCost: 3.25,
    },
    faq: baseFaq,
  },
  {
    slug: "printable-art-margins",
    category: "Digital",
    title: "Etsy Printable Wall Art: True Margin After Fees (2026)",
    metaDescription:
      "Selling printables on Etsy? See your real margin on a $7 PDF art print after every layered fee.",
    heroHeadline: "Printable art looks like 100% margin. It isn't.",
    heroSubcopy:
      "The flat $0.20 listing fee plus the $0.25 payment processing flat fee drag your effective fee rate above 11% on small printables.",
    prefilledScenario: {
      itemPrice: 7,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "wedding-invitations",
    category: "Paper",
    title: "Etsy Wedding Invitation Suite: Profit Math (2026)",
    metaDescription:
      "Custom invitation suite sellers: model your true take-home on Etsy after design time, paper, and platform fees.",
    heroHeadline: "Your $120 invitation suite isn't a $120 paycheck.",
    heroSubcopy:
      "Custom paper goods carry the worst of both worlds — physical shipping plus high design labor — and Etsy fees compound the squeeze.",
    prefilledScenario: {
      itemPrice: 120,
      shippingCharged: 8,
      manufacturingCost: 22,
      actualShippingCost: 7,
    },
    faq: baseFaq,
  },
  {
    slug: "stickers",
    category: "Paper",
    title: "Etsy Sticker Shop Profit Calculator (2026)",
    metaDescription:
      "Cricut and vinyl sticker sellers: see your real margin on Etsy after every fee at typical $4–8 price points.",
    heroHeadline: "Sticker shops live or die on the listing fee.",
    heroSubcopy:
      "At $4 per pack, the $0.20 listing fee + $0.25 payment processing flat fee alone consume 11% of revenue before any percentage fees.",
    prefilledScenario: {
      itemPrice: 6,
      shippingCharged: 1.5,
      manufacturingCost: 0.85,
      actualShippingCost: 1.4,
    },
    faq: baseFaq,
  },
  {
    slug: "soy-candles",
    category: "Home",
    title: "Etsy Soy Candle Profit Margin: Real Numbers (2026)",
    metaDescription:
      "Candle makers: see your real margin on Etsy after wax, fragrance, jar, shipping, and the 15% Off-Site Ads fee.",
    heroHeadline: "Why most Etsy candle shops underprice by $4–6.",
    heroSubcopy:
      "Heavy shipping and high COGS mean soy candle margins are tighter than they look — especially when Off-Site Ads kick in.",
    prefilledScenario: {
      itemPrice: 28,
      shippingCharged: 8,
      manufacturingCost: 7.5,
      actualShippingCost: 9,
    },
    faq: baseFaq,
  },
  {
    slug: "wood-signs",
    category: "Home",
    title: "Etsy Wood Sign Profit After Shipping & Fees (2026)",
    metaDescription:
      "Custom wood sign makers: model your real take-home after lumber, finish, oversized shipping, and Etsy fees.",
    heroHeadline: "Oversized shipping is the silent killer for wood signs.",
    heroSubcopy:
      "A $48 sign that ships at $14 looks profitable until you trace every fee — payment processing alone runs above $2 on the gross.",
    prefilledScenario: {
      itemPrice: 48,
      shippingCharged: 14,
      manufacturingCost: 11,
      actualShippingCost: 13.5,
    },
    faq: baseFaq,
  },
  {
    slug: "svg-files",
    category: "Digital",
    title: "Etsy SVG Cut Files: True Profit Per Sale (2026)",
    metaDescription:
      "Selling SVG files on Etsy? See your real margin at $3–5 price points after the platform fee stack.",
    heroHeadline: "SVG sellers, your effective fee rate is north of 12%.",
    heroSubcopy:
      "Low-priced digital products get hit hardest by flat fees. The math is unforgiving below the $5 mark.",
    prefilledScenario: {
      itemPrice: 4,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "pet-portraits",
    category: "Art",
    title: "Etsy Custom Pet Portrait: Profit Math (2026)",
    metaDescription:
      "Pet portrait artists: model your real take-home on Etsy at $35–80 price points after labor and fees.",
    heroHeadline: "Custom pet portraits: where labor is the hidden cost.",
    heroSubcopy:
      "Pet portraits are usually digital delivery (low fee impact) but the sale prices vary wildly — run your number below.",
    prefilledScenario: {
      itemPrice: 45,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "crochet-items",
    category: "Apparel",
    title: "Etsy Crochet & Knit Item Profit Calculator (2026)",
    metaDescription:
      "Crochet and knitwear sellers: model your real margin on Etsy after yarn, hours, and the 15% Off-Site Ads fee.",
    heroHeadline: "Crochet sells, but is your hourly rate even minimum wage?",
    heroSubcopy:
      "Yarn cost looks small until you add Etsy fees and the labor reality. The waterfall shows what's left for your time.",
    prefilledScenario: {
      itemPrice: 42,
      shippingCharged: 6,
      manufacturingCost: 14,
      actualShippingCost: 5.5,
    },
    faq: baseFaq,
  },
  {
    slug: "mugs-and-drinkware",
    category: "Home",
    title: "Etsy Mug & Drinkware Profit Per Sale (2026)",
    metaDescription:
      "Sublimation and POD mug sellers: see your real take-home after fulfillment cost, shipping, and Etsy fees.",
    heroHeadline: "POD mugs: 20% of buyers, single-digit margins.",
    heroSubcopy:
      "Fulfillment cost plus the full Etsy fee stack means POD mug shops often net $2–4 on a $20 sale. Confirm yours below.",
    prefilledScenario: {
      itemPrice: 20,
      shippingCharged: 5,
      manufacturingCost: 8.5,
      actualShippingCost: 5,
    },
    faq: baseFaq,
  },
  {
    slug: "handmade-soap",
    category: "Beauty",
    title: "Etsy Handmade Soap Profit Margin (2026)",
    metaDescription:
      "Soap makers: see your real margin on Etsy after lye, oils, packaging, shipping, and the platform fee stack.",
    heroHeadline: "Cottage soap math: where the margin actually lives.",
    heroSubcopy:
      "Soap is heavy and hazmat-flagged for some carriers — shipping eats into a tighter category than most makers realize.",
    prefilledScenario: {
      itemPrice: 9,
      shippingCharged: 5,
      manufacturingCost: 2.25,
      actualShippingCost: 5.25,
    },
    faq: baseFaq,
  },
  {
    slug: "greeting-cards",
    category: "Paper",
    title: "Etsy Greeting Card Shop Profit Calculator (2026)",
    metaDescription:
      "Greeting card makers: see your real margin on Etsy at $5–8 price points after every fee.",
    heroHeadline: "Greeting cards: tiny price tags, outsized fee drag.",
    heroSubcopy:
      "At $6 a card, the $0.20 listing + $0.25 processing flat fees alone are over 7% of revenue before any percentage fee.",
    prefilledScenario: {
      itemPrice: 6,
      shippingCharged: 2,
      manufacturingCost: 1,
      actualShippingCost: 1.6,
    },
    faq: baseFaq,
  },
  {
    slug: "embroidery",
    category: "Apparel",
    title: "Etsy Embroidery & Custom Hat Profit Math (2026)",
    metaDescription:
      "Custom embroidery sellers: model your real take-home on Etsy after blanks, thread, time, and platform fees.",
    heroHeadline: "Why your $32 embroidered hat nets less than a coffee.",
    heroSubcopy:
      "Blank cost + thread + the full Etsy fee stack means embroidery shops are routinely surprised by their real margin.",
    prefilledScenario: {
      itemPrice: 32,
      shippingCharged: 5,
      manufacturingCost: 12,
      actualShippingCost: 4.5,
    },
    faq: baseFaq,
  },
  {
    slug: "leather-goods",
    category: "Accessories",
    title: "Etsy Leather Goods Profit After Fees (2026)",
    metaDescription:
      "Leather wallet, belt, and bag makers: see your real margin on Etsy after hides, hardware, and the fee stack.",
    heroHeadline: "Leather goods: high price tags, premium fee drag.",
    heroSubcopy:
      "Higher-priced items mean Off-Site Ads can sting. The $100 cap helps on luxury pieces — see where you land below.",
    prefilledScenario: {
      itemPrice: 95,
      shippingCharged: 7,
      manufacturingCost: 28,
      actualShippingCost: 6.5,
    },
    faq: baseFaq,
  },
  {
    slug: "dog-accessories",
    category: "Pet",
    title: "Etsy Dog Collar & Pet Accessory Profit (2026)",
    metaDescription:
      "Pet accessory sellers: see your real margin on Etsy after webbing, hardware, shipping, and platform fees.",
    heroHeadline: "Pet accessories: small SKUs, real fee compounding.",
    heroSubcopy:
      "Hardware cost plus the Etsy fee stack means margins are slimmer than the pet category implies. Run your numbers.",
    prefilledScenario: {
      itemPrice: 22,
      shippingCharged: 4,
      manufacturingCost: 6,
      actualShippingCost: 4.25,
    },
    faq: baseFaq,
  },
  {
    slug: "wedding-favors",
    category: "Paper",
    title: "Etsy Wedding Favor Profit Calculator (2026)",
    metaDescription:
      "Wedding favor sellers: model bulk-order profit on Etsy after fulfillment and platform fees.",
    heroHeadline: "Bulk favors: where order size makes the math swing.",
    heroSubcopy:
      "Wedding favor orders are often per-unit at scale (50+). The waterfall changes shape fast as quantity grows.",
    prefilledScenario: {
      itemPrice: 75,
      shippingCharged: 12,
      manufacturingCost: 22,
      actualShippingCost: 11,
    },
    faq: baseFaq,
  },
  {
    slug: "resin-art",
    category: "Art",
    title: "Etsy Resin Art Profit Margin (2026)",
    metaDescription:
      "Resin art and home goods sellers: see your real margin on Etsy after materials, mold cost, and fees.",
    heroHeadline: "Resin art: glossy product, tight margin.",
    heroSubcopy:
      "Material cost is high relative to perceived value, and shipping fragile pieces adds risk. Run your real numbers.",
    prefilledScenario: {
      itemPrice: 38,
      shippingCharged: 9,
      manufacturingCost: 12,
      actualShippingCost: 8.5,
    },
    faq: baseFaq,
  },
  {
    slug: "baby-clothing",
    category: "Apparel",
    title: "Etsy Baby Clothing & Onesie Profit (2026)",
    metaDescription:
      "Baby clothing sellers: see your real margin on Etsy after blanks, customization time, and platform fees.",
    heroHeadline: "Custom baby clothing: low price, low margin trap.",
    heroSubcopy:
      "Buyers expect baby items to feel affordable, but Etsy fees don't scale down. The waterfall makes the squeeze obvious.",
    prefilledScenario: {
      itemPrice: 18,
      shippingCharged: 4,
      manufacturingCost: 7,
      actualShippingCost: 3.75,
    },
    faq: baseFaq,
  },
];

export function getPseoEntry(slug: string): PseoEntry | undefined {
  return PSEO_ENTRIES.find((e) => e.slug === slug);
}
