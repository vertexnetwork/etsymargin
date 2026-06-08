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
    "itemPrice" | "shippingCharged" | "manufacturingCost" | "actualShippingCost"
  >;
  faq: PseoFaq[];
};

// Last refresh date for the PSEO corpus. Surfaced as an explicit "Updated"
// stamp in the page header AND as `dateModified` on the Article JSON-LD.
// Anonymous-brand EEAT relies on objective freshness signals — bump this
// whenever the corpus gets a substantive content or fee-math refresh.
export const PSEO_LAST_UPDATED = "2026-05-14";

const baseFaq: PseoFaq[] = [
  {
    q: "Does Etsy really take 15% for Off-Site Ads?",
    a: "Yes — for shops under $10,000 in trailing 12-month revenue, the Off-Site Ads fee is 15% of the order total. Above $10,000 it drops to 12% but becomes mandatory. The fee is capped at $100 per order.",
  },
  {
    q: "What's the cheapest way to lower my Etsy fees?",
    a: "Two levers move the needle: opting out of Off-Site Ads while you're still under the $10k threshold, and rolling shipping into the item price so you don't pay the 6.5% transaction fee on a separately-charged shipping line.",
  },
  {
    q: "What percentage of sales does Etsy take overall?",
    a: "Between roughly 10% and 28% of every sale. Standard fees (listing $0.20 + transaction 6.5% + US payment processing 3% + $0.25) come to about 10% of a typical order. Off-Site Ads attribution adds 12–15% on top — that's what pushes the realistic ceiling to 25–28%.",
  },
  {
    q: "Does Etsy take 30%?",
    a: "Not on a standard sale. Standard fees total around 10%, and Off-Site Ads attribution adds 12–15% (capped at $100 per order). 30% is only reached in unusual scenarios — a sales-tax pass-through plus currency conversion plus Off-Site Ads on a low-priced order — and even then it's the exception, not the rule.",
  },
  {
    q: "How much does Etsy take from a $100 sale?",
    a: "On a $100 sale (item only, US seller): Listing $0.20 + Transaction $6.50 + Payment processing $3.25 = $9.95 baseline (about 10%). If Off-Site Ads attribute the sale at 15%, add $15 — total $24.95, or about 25% of revenue.",
  },
  {
    q: "Does Etsy charge $0.20 per listing?",
    a: "Yes — $0.20 each time a listing sells, and the listing fee renews automatically every 4 months whether the item sells or not. Multi-quantity listings get charged $0.20 per unit sold, not per order.",
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
    title: "Etsy SVG Files Profit: 12%+ Fees on $4 Sales (2026)",
    metaDescription:
      "Selling SVG cut files on Etsy at $3–5? Real 2026 math: a $4 SVG nets $3.30 — effective fee rate is north of 12% before Off-Site Ads.",
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
    heroHeadline: "Cottage soap math: where the margin lives.",
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
    title: "Etsy Greeting Card Profit: $8 Sale Nets $3 After Fees (2026)",
    metaDescription:
      "Etsy greeting card sellers: real 2026 math on a $6 card with $2 shipping. Effective fee rate hits 30% on single-card orders. Bundle math included.",
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
    title: "Etsy Embroidery Profit Margin: $32 Hat Nets $11 in 2026",
    metaDescription:
      "Custom embroidery sellers: real 2026 math on a $32 hat after blanks, thread, time, and fees. Plus the digitizing trap that erases first-design profit.",
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
  // ─── High-intent long-tail entries (Phase 2 expansion) ──────────────────
  // Each carries the calculator, prefilled scenario, FAQ, and structured
  // data. MDX bodies will be added in batches over time; the page renders
  // cleanly without them in the meantime.
  {
    slug: "canva-templates",
    category: "Digital",
    title: "Etsy Canva Template Profit Margin: Real Math (2026)",
    metaDescription:
      "Selling Canva templates on Etsy? See your real margin on a $15 template after every layered fee.",
    heroHeadline: "Canva templates: the easiest digital muse on Etsy?",
    heroSubcopy:
      "Zero shipping, zero materials, instant delivery — but the flat $0.20 listing fee plus $0.25 payment processing flat fee make low-priced templates expensive on a percentage basis.",
    prefilledScenario: {
      itemPrice: 15,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "procreate-brushes",
    category: "Digital",
    title: "Etsy Procreate Brush Profit Calculator (2026)",
    metaDescription:
      "Selling Procreate brushes on Etsy? See your real margin on a $12 brush pack after the platform fee stack.",
    heroHeadline: "Procreate brushes: high margin, low ceiling.",
    heroSubcopy:
      "Brush packs price between $8 and $20 — the sweet spot where flat fees still bite and percentage fees haven't yet dominated. Run the math.",
    prefilledScenario: {
      itemPrice: 12,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "lightroom-presets",
    category: "Digital",
    title: "Etsy Lightroom Preset Profit Margin (2026)",
    metaDescription:
      "Lightroom preset sellers: see your true take-home on Etsy at typical $10–20 price points after every fee.",
    heroHeadline: "Lightroom presets: bundle or die on margin.",
    heroSubcopy:
      "Single preset packs at $5–10 lose 18–20% to flat fees alone. Bundles at $20+ flip the math; the calculator shows the cliff.",
    prefilledScenario: {
      itemPrice: 14,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "coloring-pages-printable",
    category: "Digital",
    title: "Etsy Printable Coloring Page Profit (2026)",
    metaDescription:
      "Printable coloring page sellers: see your real margin on Etsy at typical $3–8 price points after every fee.",
    heroHeadline: "Coloring pages at $5: where flat fees eat 13%.",
    heroSubcopy:
      "Activity printables price low and depend on volume. The flat $0.20 listing fee + $0.25 processing fee compound on every order. Bundle the math.",
    prefilledScenario: {
      itemPrice: 5,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "business-card-templates",
    category: "Digital",
    title: "Etsy Business Card Template Profit Margin (2026)",
    metaDescription:
      "Designers selling business card templates on Etsy: see your real margin after Etsy's full fee stack.",
    heroHeadline: "Business card templates: $9 average, $1.50 in fees.",
    heroSubcopy:
      "Sub-$10 design templates lose 16–18% to fees before any percentage rate touches the order. Calculator shows where your real take-home lands.",
    prefilledScenario: {
      itemPrice: 9,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "logo-templates",
    category: "Digital",
    title: "Etsy Logo Template Pack Profit Math (2026)",
    metaDescription:
      "Selling premade logo packs on Etsy? See your real margin on a $20 logo bundle after every fee.",
    heroHeadline: "Logo template packs: where bundling wins on margin.",
    heroSubcopy:
      "At $20 a pack, you cross the threshold where percentage fees dominate flat fees. That's the price point where digital design products scale.",
    prefilledScenario: {
      itemPrice: 20,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "printable-planners",
    category: "Digital",
    title: "Etsy Printable Planner Profit Calculator (2026)",
    metaDescription:
      "Printable planner sellers: see your real margin on Etsy at typical $7–12 price points after fees.",
    heroHeadline: "Printable planners: monthly volume hides the fee drag.",
    heroSubcopy:
      "PDF planners look like pure profit until you stack the listing fee, transaction fee, and processing flat fee on every $9 sale. The calculator shows the real margin per order.",
    prefilledScenario: {
      itemPrice: 9,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "digital-stickers",
    category: "Digital",
    title: "Etsy Digital Sticker Profit Margin: Real Math (2026)",
    metaDescription:
      "Selling digital planner stickers (GoodNotes, Notability) on Etsy? See your real take-home after fees.",
    heroHeadline: "Digital stickers: planner culture, sub-$5 price points.",
    heroSubcopy:
      "GoodNotes and Notability sticker packs typically sell at $3–6. At those prices, fixed fees consume 15–20% before any percentage fee. Bundle aggressively or watch margin disappear.",
    prefilledScenario: {
      itemPrice: 4,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "hoodies-pod",
    category: "Apparel",
    title: "Etsy POD Hoodie Profit After Supplier & Fees (2026)",
    metaDescription:
      "Print-on-demand hoodie sellers: see your real margin on a $42 hoodie after Printify cost, shipping, and Off-Site Ads.",
    heroHeadline: "POD hoodies: high price tag, double-stack fees.",
    heroSubcopy:
      "Hoodies have higher gross than t-shirts but the same percentage fees and supplier overhead. The waterfall shows whether the higher price actually nets you more.",
    prefilledScenario: {
      itemPrice: 42,
      shippingCharged: 7,
      manufacturingCost: 24,
      actualShippingCost: 7,
    },
    faq: baseFaq,
  },
  {
    slug: "tank-tops-pod",
    category: "Apparel",
    title: "Etsy POD Tank Top Profit Calculator (2026)",
    metaDescription:
      "Print-on-demand tank top sellers: model your real take-home after supplier cost and Etsy's full fee stack.",
    heroHeadline: "POD tank tops: $20 price, $3 actual margin.",
    heroSubcopy:
      "Lower-priced POD apparel suffers the same fee structure as higher-priced items but with less gross to absorb it. Tank tops live or die on supplier negotiation.",
    prefilledScenario: {
      itemPrice: 20,
      shippingCharged: 4.5,
      manufacturingCost: 11,
      actualShippingCost: 4.5,
    },
    faq: baseFaq,
  },
  {
    slug: "embroidered-sweatshirts",
    category: "Apparel",
    title: "Etsy Embroidered Sweatshirt Profit Math (2026)",
    metaDescription:
      "Custom embroidery sellers: see your real margin on a $48 embroidered sweatshirt after blanks, thread, and fees.",
    heroHeadline: "Embroidered sweatshirts: where labor disappears into fees.",
    heroSubcopy:
      "Blanks at $20+ plus thread, hooping, digitizing time — embroidery margins look healthy until Etsy fees take their cut. Run your numbers.",
    prefilledScenario: {
      itemPrice: 48,
      shippingCharged: 6,
      manufacturingCost: 20,
      actualShippingCost: 5.5,
    },
    faq: baseFaq,
  },
  {
    slug: "embroidered-hats",
    category: "Apparel",
    title: "Etsy Custom Embroidered Hat Profit (2026)",
    metaDescription:
      "Custom hat embroidery sellers: see your real margin on a $28 embroidered cap after Etsy's full fee stack.",
    heroHeadline: "Embroidered hats: $28 list, single-digit margins on Off-Site Ads.",
    heroSubcopy:
      "Hat blanks plus thread plus the full Etsy stack. The 15% Off-Site Ads fee is often the difference between a viable shop and a hobby.",
    prefilledScenario: {
      itemPrice: 28,
      shippingCharged: 4,
      manufacturingCost: 12,
      actualShippingCost: 3.5,
    },
    faq: baseFaq,
  },
  {
    slug: "aprons-handmade",
    category: "Apparel",
    title: "Etsy Handmade Apron Profit Calculator (2026)",
    metaDescription:
      "Handmade apron sellers: model your real take-home on Etsy after fabric, labor, and platform fees.",
    heroHeadline: "Handmade aprons: fabric is cheap, labor is the real cost.",
    heroSubcopy:
      "Cotton canvas runs $4–6/yard, but cutting and sewing time isn't free. The fee waterfall shows what's left after the platform takes its cut.",
    prefilledScenario: {
      itemPrice: 24,
      shippingCharged: 5,
      manufacturingCost: 7,
      actualShippingCost: 4.5,
    },
    faq: baseFaq,
  },
  {
    slug: "kids-clothing-handmade",
    category: "Apparel",
    title: "Etsy Handmade Kids' Clothing Profit (2026)",
    metaDescription:
      "Sewing kids' clothing for Etsy? See your real margin on a $22 handmade item after fabric, time, and fees.",
    heroHeadline: "Handmade kids' clothing: fabric, time, and Etsy's cut.",
    heroSubcopy:
      "Children's apparel has price ceilings — buyers won't pay adult prices for smaller fabric. Etsy fees still scale full. Margin pressure is real.",
    prefilledScenario: {
      itemPrice: 22,
      shippingCharged: 4,
      manufacturingCost: 9,
      actualShippingCost: 3.75,
    },
    faq: baseFaq,
  },
  {
    slug: "earrings-handmade",
    category: "Jewelry",
    title: "Etsy Handmade Earring Profit Margin (2026)",
    metaDescription:
      "Handmade earring sellers: see your real margin on Etsy at $18–28 price points after every fee.",
    heroHeadline: "Handmade earrings: light shipping, heavy material variance.",
    heroSubcopy:
      "Sterling silver and 14k gold-fill have wildly different cost profiles. Shipping is cheap; design time isn't. The calculator handles both.",
    prefilledScenario: {
      itemPrice: 22,
      shippingCharged: 3.5,
      manufacturingCost: 6,
      actualShippingCost: 3,
    },
    faq: baseFaq,
  },
  {
    slug: "statement-necklaces",
    category: "Jewelry",
    title: "Etsy Statement Necklace Profit Math (2026)",
    metaDescription:
      "Statement necklace sellers: see your real margin on a $48 piece after materials, shipping, and Etsy fees.",
    heroHeadline: "Statement necklaces: high price tag, premium fee drag.",
    heroSubcopy:
      "Higher gross helps absorb fixed fees, but the 6.5% transaction fee and Off-Site Ads still take their share. Where exactly does the margin land?",
    prefilledScenario: {
      itemPrice: 48,
      shippingCharged: 4,
      manufacturingCost: 12,
      actualShippingCost: 3.5,
    },
    faq: baseFaq,
  },
  {
    slug: "friendship-bracelets",
    category: "Jewelry",
    title: "Etsy Friendship Bracelet Profit Calculator (2026)",
    metaDescription:
      "Friendship and string bracelet sellers: see your real margin on Etsy at $12–18 price points after fees.",
    heroHeadline: "Friendship bracelets: $15 list, single-digit fee rate.",
    heroSubcopy:
      "Embroidery thread is cheap; the math problem is volume. Each $15 sale loses ~15% to fees. The calculator shows the cumulative bite at scale.",
    prefilledScenario: {
      itemPrice: 15,
      shippingCharged: 3,
      manufacturingCost: 4,
      actualShippingCost: 2.75,
    },
    faq: baseFaq,
  },
  {
    slug: "birthstone-jewelry",
    category: "Jewelry",
    title: "Etsy Birthstone & Personalized Jewelry Profit (2026)",
    metaDescription:
      "Personalized birthstone jewelry sellers: see your real margin on a $40 piece after stones, settings, and fees.",
    heroHeadline: "Birthstone jewelry: personalization premium, Etsy still wins.",
    heroSubcopy:
      "Custom personalization commands a premium, but the Etsy fee stack doesn't care that yours is hand-set. Run the math before you discount.",
    prefilledScenario: {
      itemPrice: 40,
      shippingCharged: 4,
      manufacturingCost: 11,
      actualShippingCost: 3.5,
    },
    faq: baseFaq,
  },
  {
    slug: "pillow-covers",
    category: "Home",
    title: "Etsy Throw Pillow Cover Profit Margin (2026)",
    metaDescription:
      "Handmade pillow cover sellers: see your real margin on a $24 cover after fabric, shipping, and Etsy fees.",
    heroHeadline: "Pillow covers: bulky shipping, slim margins.",
    heroSubcopy:
      "Decorative pillow covers are the perfect fee-stack victim — light items but bulky packaging. The waterfall shows where the real cost lands.",
    prefilledScenario: {
      itemPrice: 24,
      shippingCharged: 5,
      manufacturingCost: 9,
      actualShippingCost: 5,
    },
    faq: baseFaq,
  },
  {
    slug: "throw-blankets-handmade",
    category: "Home",
    title: "Etsy Handmade Throw Blanket Profit (2026)",
    metaDescription:
      "Handmade and crocheted blanket sellers: see your real margin on a $48 blanket after yarn, time, and fees.",
    heroHeadline: "Handmade blankets: yarn cost is the smaller line item.",
    heroSubcopy:
      "Yarn for a $48 blanket runs $15–20 — but Etsy fees pull another $10 out before shipping. The labor cost lands wherever's left.",
    prefilledScenario: {
      itemPrice: 48,
      shippingCharged: 9,
      manufacturingCost: 18,
      actualShippingCost: 9,
    },
    faq: baseFaq,
  },
  {
    slug: "cutting-boards-engraved",
    category: "Home",
    title: "Etsy Engraved Cutting Board Profit Math (2026)",
    metaDescription:
      "Engraved and personalized cutting board sellers: see your real margin on a $42 board after wood, fees, and shipping.",
    heroHeadline: "Engraved cutting boards: oversized shipping is the killer.",
    heroSubcopy:
      "A $12 wood blank plus a $14 shipping label plus the Etsy fee stack — the calculator shows whether your $42 sale actually clears margin.",
    prefilledScenario: {
      itemPrice: 42,
      shippingCharged: 12,
      manufacturingCost: 14,
      actualShippingCost: 11,
    },
    faq: baseFaq,
  },
  {
    slug: "bath-bombs",
    category: "Beauty",
    title: "Etsy Bath Bomb Profit Calculator (2026)",
    metaDescription:
      "Bath bomb makers: see your real margin on Etsy at $6–12 price points after ingredients, packaging, and fees.",
    heroHeadline: "Bath bombs: $8 sale, $2 margin reality.",
    heroSubcopy:
      "Baking soda is cheap; packaging and shipping aren't. The flat fees alone consume 11% of an $8 sale before percentage rates kick in.",
    prefilledScenario: {
      itemPrice: 8,
      shippingCharged: 5,
      manufacturingCost: 2.5,
      actualShippingCost: 4.75,
    },
    faq: baseFaq,
  },
  {
    slug: "wax-melts",
    category: "Home",
    title: "Etsy Wax Melt Profit Margin (2026)",
    metaDescription:
      "Wax melt sellers: see your real margin on Etsy at $7–12 price points after wax, fragrance, packaging, and fees.",
    heroHeadline: "Wax melts: lower price than candles, same fee bite.",
    heroSubcopy:
      "Wax melts price below candles but carry the same fee structure on every order. Margin compresses fast at $9 retail.",
    prefilledScenario: {
      itemPrice: 9,
      shippingCharged: 4,
      manufacturingCost: 2.25,
      actualShippingCost: 4,
    },
    faq: baseFaq,
  },
  {
    slug: "macrame-wall-hangings",
    category: "Home",
    title: "Etsy Macrame Wall Hanging Profit (2026)",
    metaDescription:
      "Macrame artists: see your real margin on a $58 wall hanging after rope, time, oversized shipping, and Etsy fees.",
    heroHeadline: "Macrame: hours of labor, oversized shipping, single-digit margins.",
    heroSubcopy:
      "Cotton rope is cheap; knotting is slow; shipping is bulky. The calculator shows whether you're actually paid for the hours.",
    prefilledScenario: {
      itemPrice: 58,
      shippingCharged: 14,
      manufacturingCost: 14,
      actualShippingCost: 13.5,
    },
    faq: baseFaq,
  },
  {
    slug: "planners-physical",
    category: "Paper",
    title: "Etsy Physical Planner & Notebook Profit (2026)",
    metaDescription:
      "Bound planner and undated journal sellers: see your real margin on a $35 planner after print cost, shipping, and Etsy fees.",
    heroHeadline: "Physical planners: print cost, shipping, fees — what's left?",
    heroSubcopy:
      "Print-on-demand planners cost $9–14 to produce. Shipping adds more. The calculator shows whether $35 retail is actually viable.",
    prefilledScenario: {
      itemPrice: 35,
      shippingCharged: 7,
      manufacturingCost: 11,
      actualShippingCost: 6.5,
    },
    faq: baseFaq,
  },
  {
    slug: "journals-handmade",
    category: "Paper",
    title: "Etsy Handmade Journal & Notebook Profit (2026)",
    metaDescription:
      "Handmade journal sellers: see your real margin on a $28 leather journal after materials, time, and Etsy fees.",
    heroHeadline: "Handmade journals: materials cost more than buyers think.",
    heroSubcopy:
      "Leather, paper, binding thread, time. A $28 journal looks reasonable until you see what Etsy keeps and what shipping consumes.",
    prefilledScenario: {
      itemPrice: 28,
      shippingCharged: 5,
      manufacturingCost: 9,
      actualShippingCost: 4.75,
    },
    faq: baseFaq,
  },
  {
    slug: "thank-you-cards",
    category: "Paper",
    title: "Etsy Thank-You Card Pack Profit Math (2026)",
    metaDescription:
      "Thank-you and stationery card sellers: see your real margin on a $9 pack after print, shipping, and fees.",
    heroHeadline: "Thank-you card packs: where flat fees take everything.",
    heroSubcopy:
      "A 4-card pack at $9 sounds reasonable. After Etsy's $0.45 in flat fees, the 6.5% transaction fee, and shipping, what's left isn't enough.",
    prefilledScenario: {
      itemPrice: 9,
      shippingCharged: 2.5,
      manufacturingCost: 2,
      actualShippingCost: 2.25,
    },
    faq: baseFaq,
  },
  {
    slug: "watercolor-paintings",
    category: "Art",
    title: "Etsy Original Watercolor Painting Profit (2026)",
    metaDescription:
      "Original watercolor artists: see your real margin on a $55 piece after materials, framing-safe shipping, and Etsy fees.",
    heroHeadline: "Original watercolor: where labor is everything.",
    heroSubcopy:
      "Materials run $10–15. Shipping flat artwork without damage adds more. Etsy still takes the same percentage. The calculator handles all of it.",
    prefilledScenario: {
      itemPrice: 55,
      shippingCharged: 9,
      manufacturingCost: 14,
      actualShippingCost: 8.5,
    },
    faq: baseFaq,
  },
  {
    slug: "canvas-prints",
    category: "Art",
    title: "Etsy Canvas Print & Wall Art Profit (2026)",
    metaDescription:
      "Stretched canvas print sellers: see your real margin on a $48 wall art piece after print supplier and Etsy fees.",
    heroHeadline: "Canvas prints: bulky shipping, supplier squeeze.",
    heroSubcopy:
      "Print suppliers charge $15–22 per stretched canvas. Shipping wall art without bending adds more. Etsy fees compound the squeeze.",
    prefilledScenario: {
      itemPrice: 48,
      shippingCharged: 11,
      manufacturingCost: 18,
      actualShippingCost: 10.5,
    },
    faq: baseFaq,
  },
  {
    slug: "nursery-prints",
    category: "Art",
    title: "Etsy Nursery & Kids' Print Profit Math (2026)",
    metaDescription:
      "Nursery wall art sellers: see your real margin on a $7 printable nursery print after every layered fee.",
    heroHeadline: "Nursery printables: tiny price, brutal flat-fee drag.",
    heroSubcopy:
      "Digital nursery prints sell at $5–10. The flat $0.20 listing fee plus $0.25 processing fee alone consume 6–9% before any percentage fee.",
    prefilledScenario: {
      itemPrice: 7,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
    },
    faq: baseFaq,
  },
  {
    slug: "pet-beds",
    category: "Pet",
    title: "Etsy Handmade Pet Bed Profit Calculator (2026)",
    metaDescription:
      "Handmade pet bed sellers: see your real margin on a $48 bed after fabric, stuffing, oversized shipping, and Etsy fees.",
    heroHeadline: "Handmade pet beds: oversized shipping is the silent killer.",
    heroSubcopy:
      "Fabric and polyfill are cheap. Shipping a 24-inch pet bed isn't. The calculator shows where the margin disappears.",
    prefilledScenario: {
      itemPrice: 48,
      shippingCharged: 14,
      manufacturingCost: 18,
      actualShippingCost: 13.5,
    },
    faq: baseFaq,
  },
  {
    slug: "cat-toys",
    category: "Pet",
    title: "Etsy Handmade Cat Toy Profit Margin (2026)",
    metaDescription:
      "Cat toy makers: see your real margin on Etsy at $10–18 price points after fabric, catnip, shipping, and fees.",
    heroHeadline: "Handmade cat toys: $14 retail, the fee math is unforgiving.",
    heroSubcopy:
      "Catnip and felt are cheap; sewing time isn't. Etsy doesn't care about your hourly rate. Run the calculator before you set bulk discounts.",
    prefilledScenario: {
      itemPrice: 14,
      shippingCharged: 4,
      manufacturingCost: 4,
      actualShippingCost: 3.75,
    },
    faq: baseFaq,
  },
  {
    slug: "custom-pet-tags",
    category: "Pet",
    title: "Etsy Custom Pet Tag Profit (2026)",
    metaDescription:
      "Custom engraved pet tag sellers: see your real margin on a $18 tag after blank cost, engraving time, and Etsy fees.",
    heroHeadline: "Custom pet tags: $18 retail, materials are the smaller line.",
    heroSubcopy:
      "Aluminum or brass blanks run $3–6. Engraving takes minutes. Etsy fees take more than the materials. The calculator shows the actual reality.",
    prefilledScenario: {
      itemPrice: 18,
      shippingCharged: 3,
      manufacturingCost: 5,
      actualShippingCost: 2.75,
    },
    faq: baseFaq,
  },
  {
    slug: "lip-balm",
    category: "Beauty",
    title: "Etsy Handmade Lip Balm Profit Math (2026)",
    metaDescription:
      "Handmade lip balm sellers: see your real margin on a $14 3-pack after ingredients, packaging, and Etsy fees.",
    heroHeadline: "Lip balm: 3-packs are the only viable price point.",
    heroSubcopy:
      "A single $4 lip balm loses 25%+ to fees. Bundling into 3-packs at $14 flips the math — flat fees stop dominating.",
    prefilledScenario: {
      itemPrice: 14,
      shippingCharged: 4,
      manufacturingCost: 3.5,
      actualShippingCost: 3.75,
    },
    faq: baseFaq,
  },
  {
    slug: "bath-salts",
    category: "Beauty",
    title: "Etsy Bath Salt Profit Calculator (2026)",
    metaDescription:
      "Bath salt sellers: see your real margin on a $14 jar after Epsom, essential oils, packaging, and Etsy fees.",
    heroHeadline: "Bath salts: heavy shipping, tight margins.",
    heroSubcopy:
      "Epsom salt is dirt cheap; jar shipping weight isn't. Run the waterfall to see whether $14 retail clears for your specific shipping zone.",
    prefilledScenario: {
      itemPrice: 14,
      shippingCharged: 5,
      manufacturingCost: 4,
      actualShippingCost: 4.75,
    },
    faq: baseFaq,
  },
  {
    slug: "body-butter",
    category: "Beauty",
    title: "Etsy Handmade Body Butter Profit (2026)",
    metaDescription:
      "Handmade body butter and balm sellers: see your real margin on an $18 jar after ingredients and Etsy fees.",
    heroHeadline: "Body butter: shea, oils, jar — and Etsy's cut.",
    heroSubcopy:
      "Shea butter and carrier oils are the dominant cost. Glass jars and shipping weight stack the rest. The calculator handles all of it.",
    prefilledScenario: {
      itemPrice: 18,
      shippingCharged: 5,
      manufacturingCost: 4.75,
      actualShippingCost: 4.75,
    },
    faq: baseFaq,
  },
  {
    slug: "enamel-pins",
    category: "Accessories",
    title: "Etsy Enamel Pins: $12 Profit After 100-Unit Minimums (2026)",
    metaDescription:
      "Enamel pin sellers: real 2026 math on a $12 pin. Manufacturing minimums lock per-unit cost at $3, Etsy takes ~25% with Off-Site Ads. Run the numbers.",
    heroHeadline: "Enamel pins: minimum-order economics dictate margin.",
    heroSubcopy:
      "Pin manufacturing has minimums (100+ units) that lock in your per-unit cost. Etsy then takes its cut on every individual sale. Run the math.",
    prefilledScenario: {
      itemPrice: 12,
      shippingCharged: 3,
      manufacturingCost: 3,
      actualShippingCost: 2,
    },
    faq: baseFaq,
  },
  {
    slug: "canvas-tote-bags",
    category: "Accessories",
    title: "Etsy Canvas Tote Bag Profit Math (2026)",
    metaDescription:
      "Printed and embroidered canvas tote bag sellers: see your real margin on a $28 bag after blanks, print/embroidery, and fees.",
    heroHeadline: "Canvas totes: bulk-blank cost meets retail price ceilings.",
    heroSubcopy:
      "Blank canvas totes run $4–8 in bulk. Print or embroidery adds $4–6. Etsy fees take their cut. The calculator shows what's left at $28 retail.",
    prefilledScenario: {
      itemPrice: 28,
      shippingCharged: 5,
      manufacturingCost: 9,
      actualShippingCost: 4.75,
    },
    faq: baseFaq,
  },
  {
    slug: "wedding-cake-toppers",
    category: "Wedding",
    title: "Etsy Custom Wedding Cake Topper Profit (2026)",
    metaDescription:
      "Custom acrylic and wood wedding cake topper sellers: see your real margin on a $24 topper after cutting, packaging, and Etsy fees.",
    heroHeadline: "Wedding cake toppers: low-volume, custom, fee-pressured.",
    heroSubcopy:
      "Acrylic stock plus laser-cut time plus packaging. The calculator shows whether $24 retail is sustainable on a per-order basis.",
    prefilledScenario: {
      itemPrice: 24,
      shippingCharged: 5,
      manufacturingCost: 7,
      actualShippingCost: 4.5,
    },
    faq: baseFaq,
  },
  {
    slug: "christmas-ornaments-handmade",
    category: "Holiday",
    title: "Etsy Handmade Christmas Ornament Profit (2026)",
    metaDescription:
      "Handmade ornament sellers: see your real margin on a $14 ornament after materials, seasonal shipping rates, and Etsy fees.",
    heroHeadline: "Holiday ornaments: seasonal volume, year-round fee structure.",
    heroSubcopy:
      "Christmas ornaments do most of their sales in 8 weeks. The fee math doesn't care about seasonality — it takes the same cut on every single order.",
    prefilledScenario: {
      itemPrice: 14,
      shippingCharged: 4,
      manufacturingCost: 4,
      actualShippingCost: 3.75,
    },
    faq: baseFaq,
  },
];

export function getPseoEntry(slug: string): PseoEntry | undefined {
  return PSEO_ENTRIES.find((e) => e.slug === slug);
}
