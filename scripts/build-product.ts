// Build the Gumroad product bundle: a PDF reference manual and a
// pipe-delimited spreadsheet of every fee scenario. The fee math is
// imported directly from lib/fees so the product can never drift from
// the live calculator at etsymargin.tools.
//
// Usage: `npm run build:product`
// Outputs: temp/gumroad-product/etsy-pricing-bible-2026.pdf
//          temp/gumroad-product/master-pricing-matrix-2026.psv

import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";

import {
  calculate,
  LISTING_FEE,
  TRANSACTION_FEE_RATE,
  OFFSITE_ADS_RATE_UNDER_10K,
  OFFSITE_ADS_RATE_AT_10K,
  OFFSITE_ADS_FEE_CAP,
  type CalculatorInputs,
  type CalculatorResult,
} from "../lib/fees";
import { COUNTRIES, type CountryCode } from "../lib/countries";
import { PSEO_ENTRIES, type PseoEntry } from "../lib/pseo/data";

const MDX_DIR = path.resolve("content/pseo");

const OUT_DIR = path.resolve("temp/gumroad-product");
const PDF_PATH = path.join(OUT_DIR, "etsy-pricing-bible-2026.pdf");
// The pre-modeled spreadsheet is branded the "Master Pricing Matrix" on the
// sales page and throughout this manual; the filename matches it so a buyer
// who reads a reference to it can find the file in their download.
const MATRIX_NAME = "Master Pricing Matrix";
const MATRIX_FILE = "master-pricing-matrix-2026.psv";
const PSV_PATH = path.join(OUT_DIR, MATRIX_FILE);

const BRAND = {
  patinaBlue: "#3E7C7B",
  patinaBlueDark: "#2A5757",
  limeCream: "#E8F0D8",
  ink: "#1F2937",
  muted: "#6B7280",
  rule: "#D1D5DB",
};

const COUNTRY_CODES: CountryCode[] = ["US", "UK", "CA", "AU", "EU"];

type Doc = InstanceType<typeof PDFDocument>;

type Scenario = {
  category: string;
  slug: string;
  countryCode: CountryCode;
  countryLabel: string;
  adsEnabled: boolean;
  atOrAbove10k: boolean;
  inputs: CalculatorInputs;
  result: CalculatorResult;
};

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function fmtMoney(n: number, sym = "$"): string {
  const neg = n < 0;
  const abs = Math.abs(n);
  return `${neg ? "-" : ""}${sym}${abs.toFixed(2)}`;
}

function findFee(s: Scenario, label: string): number {
  return s.result.fees.find((f) => f.label === label)?.amount ?? 0;
}

function runScenario(
  entry: PseoEntry,
  country: CountryCode,
  ads: boolean,
  at10k: boolean,
): Scenario {
  const inputs: CalculatorInputs = {
    ...entry.prefilledScenario,
    country,
    offsiteAdsEnabled: ads,
    atOrAbove10k: at10k,
  };
  const result = calculate(inputs);
  return {
    category: entry.category,
    slug: entry.slug,
    countryCode: country,
    countryLabel: COUNTRIES[country].label,
    adsEnabled: ads,
    atOrAbove10k: at10k,
    inputs,
    result,
  };
}

function allScenarios(): Scenario[] {
  const out: Scenario[] = [];
  for (const entry of PSEO_ENTRIES) {
    for (const cc of COUNTRY_CODES) {
      for (const ads of [false, true]) {
        for (const at10k of [false, true]) {
          out.push(runScenario(entry, cc, ads, at10k));
        }
      }
    }
  }
  return out;
}

function writePsv(scenarios: Scenario[]) {
  const sep = "|";
  const headers = [
    "category",
    "country_code",
    "country_label",
    "ads_enabled",
    "at_or_above_10k",
    "item_price",
    "shipping_charged",
    "manufacturing_cost",
    "actual_shipping_cost",
    "gross",
    "listing_fee",
    "transaction_fee",
    "payment_processing_fee",
    "regulatory_operating_fee",
    "offsite_ads_fee",
    "total_fees",
    "net_profit",
    "margin_percent",
    "effective_fee_rate",
  ];
  const lines = [headers.join(sep)];
  for (const s of scenarios) {
    const row = [
      s.slug,
      s.countryCode,
      s.countryLabel,
      s.adsEnabled ? "true" : "false",
      s.atOrAbove10k ? "true" : "false",
      s.inputs.itemPrice.toFixed(2),
      s.inputs.shippingCharged.toFixed(2),
      s.inputs.manufacturingCost.toFixed(2),
      s.inputs.actualShippingCost.toFixed(2),
      s.result.gross.toFixed(2),
      findFee(s, "Listing Fee").toFixed(2),
      findFee(s, "Transaction Fee").toFixed(2),
      findFee(s, "Payment Processing").toFixed(2),
      findFee(s, "Regulatory Operating Fee").toFixed(2),
      findFee(s, "Off-Site Ads Fee").toFixed(2),
      s.result.totalFees.toFixed(2),
      s.result.netProfit.toFixed(2),
      (s.result.marginPercent * 100).toFixed(2),
      (s.result.effectiveFeeRate * 100).toFixed(2),
    ];
    lines.push(row.join(sep));
  }
  fs.writeFileSync(PSV_PATH, lines.join("\n") + "\n", "utf8");
  return lines.length - 1;
}

// --- PDF rendering helpers --------------------------------------------------

function H1(doc: Doc, text: string) {
  doc.font("Helvetica-Bold").fontSize(22).fillColor(BRAND.patinaBlueDark).text(text);
  doc.moveDown(0.4);
}

// Keep-with-next: if a heading would land within `needed` points of the page
// bottom, push it to the next page so it never gets stranded above the fold
// from the body or table that follows it. Guards against orphaned FAQ
// questions and "## The common mistake" sub-heads.
function ensureSpace(doc: Doc, needed: number) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) doc.addPage();
}

function H2(doc: Doc, text: string) {
  ensureSpace(doc, 64);
  doc.font("Helvetica-Bold").fontSize(13).fillColor(BRAND.patinaBlueDark).text(text);
  doc.moveDown(0.25);
}

function P(doc: Doc, text: string) {
  doc.font("Helvetica").fontSize(10.5).fillColor(BRAND.ink).text(text, {
    lineGap: 2,
    align: "left",
  });
  doc.moveDown(0.5);
}

function muted(doc: Doc, text: string) {
  doc.font("Helvetica-Oblique").fontSize(9.5).fillColor(BRAND.muted).text(text);
  doc.moveDown(0.3);
}

function H3(doc: Doc, text: string) {
  ensureSpace(doc, 60);
  doc.x = doc.page.margins.left;
  doc.font("Helvetica-Bold").fontSize(11.5).fillColor(BRAND.patinaBlueDark).text(text);
  doc.moveDown(0.2);
}

// Render simple Markdown (## headings, paragraphs, **bold**, [link text](url),
// "- " bullets) into the PDF. Stops at the bottom of a page automatically —
// pdfkit auto-flows multi-page text. Used for category-card narratives loaded
// from content/pseo/*.mdx so the bible's commentary stays in lock-step with
// the website.
type InlineSeg = { text: string; bold: boolean };

function parseInline(text: string): InlineSeg[] {
  // Strip Markdown links: [label](url) → label
  const stripped = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  const segments: InlineSeg[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(stripped)) !== null) {
    if (m.index > last) {
      segments.push({ text: stripped.slice(last, m.index), bold: false });
    }
    segments.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < stripped.length) {
    segments.push({ text: stripped.slice(last), bold: false });
  }
  return segments.length ? segments : [{ text: stripped, bold: false }];
}

function drawInlineParagraph(doc: Doc, text: string, opts?: { bullet?: boolean }) {
  doc.x = doc.page.margins.left;
  doc.font("Helvetica").fontSize(10.5).fillColor(BRAND.ink);
  const segments = parseInline(text);
  if (opts?.bullet) {
    doc.text("•   ", { continued: true, lineGap: 2 });
  }
  segments.forEach((seg, i) => {
    const isLast = i === segments.length - 1;
    doc.font(seg.bold ? "Helvetica-Bold" : "Helvetica");
    doc.text(seg.text, { continued: !isLast, lineGap: 2 });
  });
  doc.moveDown(opts?.bullet ? 0.25 : 0.5);
}

function renderMarkdown(doc: Doc, md: string) {
  const lines = md.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      H3(doc, line.slice(3).trim());
      i++;
    } else if (line.startsWith("- ")) {
      while (i < lines.length && lines[i].startsWith("- ")) {
        drawInlineParagraph(doc, lines[i].slice(2).trim(), { bullet: true });
        i++;
      }
      doc.moveDown(0.2);
    } else if (line.trim() === "") {
      i++;
    } else {
      const para: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].startsWith("## ") &&
        !lines[i].startsWith("- ")
      ) {
        para.push(lines[i].trim());
        i++;
      }
      drawInlineParagraph(doc, para.join(" "));
    }
  }
}

function loadMdx(slug: string): string {
  // Returns "" for slugs that don't have an MDX body yet. The PDF build
  // covers all 60+ pSEO entries; only the original 20 have full narrative
  // content. New entries get a data-only category card until their MDX
  // ships.
  const file = path.join(MDX_DIR, `${slug}.mdx`);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function drawTable(doc: Doc, headers: string[], rows: string[][], colWidths: number[]) {
  const startX = doc.page.margins.left;
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  let y = doc.y + 4;
  const rowH = 20;

  // Header
  doc.save().fillColor(BRAND.limeCream).rect(startX, y, totalW, rowH).fill().restore();
  doc.font("Helvetica-Bold").fontSize(10).fillColor(BRAND.patinaBlueDark);
  let x = startX;
  headers.forEach((h, i) => {
    doc.text(h, x + 6, y + 6, { width: colWidths[i] - 12, lineBreak: false });
    x += colWidths[i];
  });
  y += rowH;

  // Rows
  doc.font("Helvetica").fontSize(10).fillColor(BRAND.ink);
  for (const row of rows) {
    doc
      .save()
      .strokeColor(BRAND.rule)
      .lineWidth(0.5)
      .moveTo(startX, y)
      .lineTo(startX + totalW, y)
      .stroke()
      .restore();
    x = startX;
    row.forEach((cell, i) => {
      doc.text(cell, x + 6, y + 6, { width: colWidths[i] - 12, lineBreak: false });
      x += colWidths[i];
    });
    y += rowH;
  }
  // bottom rule
  doc
    .save()
    .strokeColor(BRAND.rule)
    .lineWidth(0.5)
    .moveTo(startX, y)
    .lineTo(startX + totalW, y)
    .stroke()
    .restore();
  // Reset cursor to left margin so subsequent text() calls flow full-width
  // instead of inheriting the rightmost cell's x and wrapping into a narrow
  // column.
  doc.x = startX;
  doc.y = y + 10;
}

function drawCover(doc: Doc) {
  const w = doc.page.width;
  const h = doc.page.height;
  const left = doc.page.margins.left;
  const contentW = w - doc.page.margins.left - doc.page.margins.right;
  const bandTop = h * 0.22;
  const bandHeight = h * 0.42;

  // Lime cream band centered vertically — sized to hold title + tagline
  // tightly rather than leaving a tall empty block of color.
  doc.save().fillColor(BRAND.limeCream).rect(0, bandTop, w, bandHeight).fill().restore();

  // Eyebrow
  doc
    .fillColor(BRAND.patinaBlue)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("THE 2026", left, bandTop + 50, { width: contentW, characterSpacing: 1.5 });

  // Title (two lines)
  doc
    .fillColor(BRAND.patinaBlueDark)
    .font("Helvetica-Bold")
    .fontSize(44)
    .text("Etsy Pricing", left, bandTop + 80, { width: contentW, lineGap: -4 });
  doc.text("Bible.", { width: contentW });

  // Tagline — italic, ink color, sits inside the band below the title
  doc
    .moveDown(0.8)
    .font("Helvetica-Oblique")
    .fontSize(14)
    .fillColor(BRAND.ink)
    .text("Find your true profit before you price.", { width: contentW });

  // Reset x for the footer text
  doc.x = left;

  // Footer below the band
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(BRAND.muted)
    .text("etsymargin.tools  ·  2026 Edition", left, h - doc.page.margins.bottom - 14, {
      width: contentW,
    });
}

function drawForeword(doc: Doc) {
  doc.addPage();
  H1(doc, "How to use this book");
  P(
    doc,
    `This is a reference, not a read-through. Skip to the country chapter for your shop's location, then jump to the category card that matches what you sell. The ${MATRIX_NAME} (${MATRIX_FILE}) has every combination pre-modeled — open it whenever you're tempted to set a price by feel.`,
  );
  P(doc, "Three things to internalize before any pricing decision:");
  P(doc, "1. Etsy stacks four to six fees per sale. Most sellers can name two.");
  P(
    doc,
    "2. Off-Site Ads is a cliff at $10,000 in trailing 12-month revenue, not a slope. Plan for the day you cross it.",
  );
  P(
    doc,
    "3. Country matters. UK and Canadian sellers pay a regulatory operating fee on top of the standard stack — and it's not optional.",
  );
  H2(doc, "How the math is sourced");
  P(
    doc,
    "Every number in this book is produced by the same TypeScript fee model that powers the live calculator at etsymargin.tools. There is no second source of truth, so this manual cannot drift from the website's results.",
  );
}

function drawFeeStack(doc: Doc) {
  doc.addPage();
  H1(doc, "The Etsy fee stack, explained");

  H2(doc, "1. Listing Fee — $0.20 flat");
  P(
    doc,
    "Charged when you list, and re-charged when an item renews after a sale. Punishingly expensive at low price points: a $4 SVG file pays a 5% effective rate from this fee alone, before any percentage fees touch the order.",
  );

  H2(doc, "2. Transaction Fee — 6.5% of (item + shipping)");
  P(
    doc,
    "Etsy's headline take. Crucial detail: the 6.5% applies to the SHIPPING line, not just the item — so charging shipping separately costs you 6.5% on that revenue too. Rolling shipping into your item price doesn't reduce this fee; it just changes how the buyer sees the breakdown.",
  );

  doc.addPage();
  H2(doc, "3. Payment Processing — varies by country");
  P(doc, "Standard rates by region:");
  const rows = COUNTRY_CODES.map((cc) => {
    const c = COUNTRIES[cc];
    return [
      c.label,
      `${(c.paymentPercent * 100).toFixed(1)}% + ${c.currencySymbol}${c.paymentFlat.toFixed(2)}`,
    ];
  });
  drawTable(doc, ["Country", "Formula"], rows, [220, 240]);

  H2(doc, "4. Regulatory Operating Fee");
  P(
    doc,
    "A pass-through digital-services tax on top of everything else. UK shops: 0.32% of the order. Canadian shops: 1.15%. US, AU, and EU sellers don't see this line.",
  );

  doc.addPage();
  H2(doc, "5. Off-Site Ads Fee");
  P(doc, "The most painful line in the stack — and the one most sellers haven't read carefully:");
  P(
    doc,
    `· Under $10,000 in trailing 12-month revenue: ${
      OFFSITE_ADS_RATE_UNDER_10K * 100
    }% of the order total when a sale is attributed to an off-site ad. Optional — you can opt out.`,
  );
  P(
    doc,
    `· At or above $10,000: ${
      OFFSITE_ADS_RATE_AT_10K * 100
    }% of the order total. Mandatory — you cannot opt out.`,
  );
  P(doc, `· Capped at $${OFFSITE_ADS_FEE_CAP} per order.`);
  P(
    doc,
    "The cliff at $10,000 means crossing the threshold can make your effective fee rate jump several points overnight, even though the rate technically dropped from 15% to 12%. The country chapters and category cards both flag where this tipping point lands for you.",
  );
}

// The bundling chapter — the highest-leverage tactic in this book for any
// shop selling low-priced items, and the insight buyers single out. Etsy's
// two flat fees ($0.20 listing + $0.25 fixed payment-processing portion) are
// charged per ORDER, not per item, so selling cheap items one at a time pays
// them over and over. Bundling pays them once. Every figure here is computed
// live from lib/fees, so it can never drift from the calculator, the preview
// imagery, or the Master Pricing Matrix.
function drawBundlingChapter(doc: Doc) {
  doc.addPage();
  doc.font("Helvetica-Bold").fontSize(10).fillColor(BRAND.patinaBlue).text("PRICING TACTIC");
  doc.moveDown(0.2);
  H1(doc, "Bundle to stop paying the flat fees on every order");

  P(
    doc,
    "If you sell low-priced items, this is the single highest-leverage pricing move in this book. It does not require raising your prices, cutting your costs, or changing your product — only how many items ride on one order.",
  );

  H2(doc, "Why cheap items bleed margin");
  P(
    doc,
    "Two of Etsy's fees are flat, not percentage-based: the $0.20 listing fee and the $0.25 fixed portion of US payment processing. On a $5 item those $0.45 in flat fees are 9% of the sale before a single percentage fee applies. On a $50 item the same $0.45 is under 1%. The flat fees do not scale down for cheap products — your effective fee rate scales up.",
  );
  P(
    doc,
    "The percentage fees (6.5% transaction + 3% payment processing) are the same either way. So the entire penalty for selling cheap items individually is the flat fees, repeated once per order.",
  );

  // Worked example, computed live — ten $5 items sold solo vs. one $50 bundle,
  // US shop, Off-Site Ads off (the one variable bundling actually changes).
  const BUNDLE_N = 10;
  const ITEM = 5;
  const base = {
    shippingCharged: 0,
    manufacturingCost: 0,
    actualShippingCost: 0,
    country: "US" as CountryCode,
    offsiteAdsEnabled: false,
    atOrAbove10k: false,
  };
  const solo = calculate({ ...base, itemPrice: ITEM });
  const bundle = calculate({ ...base, itemPrice: ITEM * BUNDLE_N });
  const soloTotalFees = solo.totalFees * BUNDLE_N;
  const soloKeep = ITEM * BUNDLE_N - soloTotalFees;
  const bundleKeep = bundle.gross - bundle.totalFees;
  const saved = bundleKeep - soloKeep;

  H2(doc, `Worked example: ten $${ITEM} items, US shop, Off-Site Ads off`);
  drawTable(
    doc,
    ["Approach", "Total fees", "Effective rate", "You keep"],
    [
      [
        `Sold one at a time (${BUNDLE_N} orders)`,
        fmtMoney(soloTotalFees),
        `${(solo.effectiveFeeRate * 100).toFixed(1)}%`,
        fmtMoney(soloKeep),
      ],
      [
        `Bundled into one $${ITEM * BUNDLE_N} listing`,
        fmtMoney(bundle.totalFees),
        `${(bundle.effectiveFeeRate * 100).toFixed(1)}%`,
        fmtMoney(bundleKeep),
      ],
    ],
    [200, 90, 90, 80],
  );
  P(
    doc,
    `Same products, same $${
      ITEM * BUNDLE_N
    } of revenue. Bundling nearly halves the effective fee rate — from ${(
      solo.effectiveFeeRate * 100
    ).toFixed(1)}% to ${(bundle.effectiveFeeRate * 100).toFixed(
      1,
    )}% — because the flat fees are paid once instead of ${BUNDLE_N} times. That is ${fmtMoney(
      saved,
    )} more in your pocket on the same sales.`,
  );

  H2(doc, "How the rate falls as the bundle grows");
  P(doc, `Effective fee rate for $${ITEM} items, US shop, Off-Site Ads off, at each bundle size:`);
  const sizes = [1, 3, 5, 10];
  drawTable(
    doc,
    ["Bundle", "Listing price", "Effective fee rate"],
    sizes.map((n) => {
      const r = calculate({ ...base, itemPrice: ITEM * n });
      const label = n === 1 ? "Single item" : `${n}-pack`;
      return [label, fmtMoney(ITEM * n), `${(r.effectiveFeeRate * 100).toFixed(1)}%`];
    }),
    [180, 140, 140],
  );
  P(
    doc,
    "Most of the gain lands by the 3-pack; after that the curve flattens because the flat fees are already spread thin. You do not need a huge bundle — you need to stop paying the flat fees on every single low-priced order.",
  );

  H2(doc, "The framework");
  drawInlineParagraph(
    doc,
    "**Bundle what a buyer already wants together.** Variant packs (colors, sizes), themed sets, and volume packs convert. Bundling unrelated items just to dodge fees lowers conversion and erases the gain.",
    { bullet: true },
  );
  drawInlineParagraph(
    doc,
    "**Price the bundle below single-item × N.** A small discount is what makes the bundle attractive — and the fee savings above are what fund that discount without touching your margin.",
    { bullet: true },
  );
  drawInlineParagraph(
    doc,
    "**Digital products bundle for free.** No added manufacturing or shipping cost, so the entire fee saving drops to the bottom line. This tactic is most powerful for digital shops.",
    { bullet: true },
  );
  drawInlineParagraph(
    doc,
    "**For physical bundles, re-check shipping.** A heavier bundle can raise your actual shipping cost; model the bundle as its own scenario in the Master Pricing Matrix before you set the price.",
    { bullet: true },
  );
  drawInlineParagraph(
    doc,
    "**It matters most below ~$10 per item.** Above that, the flat fees are already a small share of the sale and the tactic fades. Use it where the flat-fee drag is real.",
    { bullet: true },
  );
}

// Three worked examples per country chapter — low / mid / high price tier —
// so the chapter has real density instead of one jewelry table copy-pasted
// across five currencies.
const COUNTRY_WORKED_EXAMPLES: Array<{ slug: string; label: string }> = [
  { slug: "digital-downloads-profitability", label: "Low tier — digital download @ $5" },
  { slug: "handmade-jewelry-fees", label: "Mid tier — handmade jewelry @ $38" },
  { slug: "leather-goods", label: "High tier — leather goods @ $95" },
];

function drawCountryChapter(doc: Doc, code: CountryCode) {
  const c = COUNTRIES[code];
  doc.addPage();
  doc.font("Helvetica-Bold").fontSize(10).fillColor(BRAND.patinaBlue).text(`COUNTRY · ${code}`);
  doc.moveDown(0.2);
  H1(doc, c.label);
  P(doc, `Currency: ${c.currencySymbol}    Country code: ${c.code}`);

  H2(doc, "Payment processor formula");
  P(
    doc,
    `${(c.paymentPercent * 100).toFixed(1)}% of (item + shipping) plus ${c.currencySymbol}${c.paymentFlat.toFixed(
      2,
    )} flat per transaction.`,
  );

  H2(doc, "Regulatory operating fee");
  if (c.regulatoryOperatingPercent > 0) {
    P(
      doc,
      `${(c.regulatoryOperatingPercent * 100).toFixed(2)}% of (item + shipping). Etsy passes this digital-services tax through to ${c.label} sellers — it is not optional and it is not absorbed.`,
    );
  } else {
    P(doc, "None applied for this country.");
  }

  H2(doc, "Worked examples across the price spectrum");
  P(
    doc,
    "Three scenarios at low, mid, and high price points show how the fee burden scales for sellers in this region. Each table holds the product fixed and varies the Off-Site Ads state.",
  );

  const combos: Array<{ ads: boolean; at10k: boolean; label: string }> = [
    { ads: false, at10k: false, label: "Ads off, under $10k" },
    {
      ads: true,
      at10k: false,
      label: `Ads on (${OFFSITE_ADS_RATE_UNDER_10K * 100}%), under $10k`,
    },
    {
      ads: true,
      at10k: true,
      label: `Ads on (${OFFSITE_ADS_RATE_AT_10K * 100}%), at/above $10k`,
    },
  ];

  for (const ex of COUNTRY_WORKED_EXAMPLES) {
    const entry = PSEO_ENTRIES.find((e) => e.slug === ex.slug);
    if (!entry) continue;
    H3(doc, ex.label);
    const rows = combos.map((co) => {
      const r = calculate({
        ...entry.prefilledScenario,
        country: code,
        offsiteAdsEnabled: co.ads,
        atOrAbove10k: co.at10k,
      });
      return [
        co.label,
        fmtMoney(r.totalFees, c.currencySymbol),
        fmtMoney(r.netProfit, c.currencySymbol),
        `${(r.marginPercent * 100).toFixed(1)}%`,
      ];
    });
    drawTable(doc, ["Scenario", "Total fees", "Net profit", "Margin"], rows, [240, 80, 80, 60]);
  }
}

function drawCategoryCard(doc: Doc, entry: PseoEntry) {
  doc.addPage();
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(BRAND.patinaBlue)
    .text(`CATEGORY · ${entry.category.toUpperCase()}`);
  doc.moveDown(0.2);
  H1(doc, entry.heroHeadline);

  H2(doc, "Scenario inputs");
  drawTable(
    doc,
    ["Input", "Value"],
    [
      ["Item price", `$${entry.prefilledScenario.itemPrice.toFixed(2)}`],
      ["Shipping charged", `$${entry.prefilledScenario.shippingCharged.toFixed(2)}`],
      ["Manufacturing cost", `$${entry.prefilledScenario.manufacturingCost.toFixed(2)}`],
      ["Actual shipping cost", `$${entry.prefilledScenario.actualShippingCost.toFixed(2)}`],
    ],
    [220, 120],
  );

  H2(doc, "Profit by Off-Site Ads scenario (US shop)");
  const combos: Array<{ ads: boolean; at10k: boolean; label: string }> = [
    { ads: false, at10k: false, label: "Ads off, under $10k" },
    { ads: false, at10k: true, label: "Ads off, at/above $10k" },
    {
      ads: true,
      at10k: false,
      label: `Ads on (${OFFSITE_ADS_RATE_UNDER_10K * 100}%), under $10k`,
    },
    {
      ads: true,
      at10k: true,
      label: `Ads on (${OFFSITE_ADS_RATE_AT_10K * 100}%), at/above $10k`,
    },
  ];
  const rows = combos.map((c) => {
    const r = calculate({
      ...entry.prefilledScenario,
      country: "US",
      offsiteAdsEnabled: c.ads,
      atOrAbove10k: c.at10k,
    });
    return [
      c.label,
      `$${r.gross.toFixed(2)}`,
      `$${r.totalFees.toFixed(2)}`,
      `$${r.netProfit.toFixed(2)}`,
      `${(r.marginPercent * 100).toFixed(1)}%`,
    ];
  });
  drawTable(doc, ["Scenario", "Gross", "Fees", "Net", "Margin"], rows, [220, 70, 70, 70, 60]);

  // Pull the live category narrative from content/pseo/<slug>.mdx when it
  // exists so the card carries 300-400 words of analysis. For lite entries
  // without an MDX body yet, fall back to the subcopy as a brief "What
  // this means" callout — keeps every card consistent.
  const mdx = loadMdx(entry.slug);
  if (mdx) {
    doc.moveDown(0.4);
    renderMarkdown(doc, mdx);
  } else {
    H2(doc, "What this means");
    P(doc, entry.heroSubcopy);
  }
}

// Hand-authored FAQs specific to using this book and the Master Pricing
// Matrix. Deliberately *not* deduped from the website's pSEO FAQs —
// those are SEO answers for category pages and don't fit the bible context.
const BIBLE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "How is this different from a free Etsy fee calculator?",
    a: `A calculator answers one scenario at a time. This book answers 1,200 scenarios in one place — every category in this manual, against every payment-processor region, with Off-Site Ads on or off and your shop above or below the $10,000 threshold. The ${MATRIX_NAME} (${MATRIX_FILE}) is the lookup table; the PDF explains the math behind it.`,
  },
  {
    q: "What's the refund policy?",
    a: "Gumroad's standard 7-day, no-questions-asked window. If the math doesn't help you reprice at least one listing for a higher net margin, ask for your money back through the link in your purchase email.",
  },
  {
    q: "What file formats do I get?",
    a: `Two files. A PDF reference manual (etsy-pricing-bible-2026.pdf) for reading and reference. The ${MATRIX_NAME} (${MATRIX_FILE}) — a pipe-delimited spreadsheet — for opening in Excel, Google Sheets, or Numbers.`,
  },
  {
    q: "Will the Master Pricing Matrix open in Excel, Google Sheets, and Numbers?",
    a: "Yes. The .psv is plain text with the pipe character (|) as the column delimiter. In Excel, use Data > From Text/CSV and set the delimiter to Pipe. In Google Sheets, use File > Import > Upload, then choose Custom and enter a pipe (|). In Numbers on macOS, double-click the file and confirm the pipe delimiter when prompted.",
  },
  {
    q: "Why pipe-delimited instead of CSV?",
    a: 'Etsy product names and descriptive labels routinely contain commas — "Mid tier, ads on" being the obvious example. CSV files break on those commas without quote-escaping. Pipe characters virtually never appear inside the data, so the file imports cleanly into every spreadsheet app on the first try.',
  },
  {
    q: "What if Etsy changes its fee structure during 2026?",
    a: `You get the rebuilt bundle for free. Email the address printed on your Gumroad receipt and we re-send the PDF and ${MATRIX_NAME} with the updated rates. The fee math in this book is generated from the same TypeScript model that powers etsymargin.tools, so an Etsy change updates everything in one pass.`,
  },
  {
    q: "Which countries are covered?",
    a: "Five payment-processor regions: United States, United Kingdom, Canada, Australia, and EU (Other). Each has a dedicated chapter with the exact processor formula and three worked examples at low, mid, and high price points. If you sell from a country not in this list, the closest analog is usually EU (Other) — but verify the rate against your own Etsy seller dashboard.",
  },
  {
    q: "Is this affiliated with Etsy?",
    a: "No. This is an independent reference. Etsy did not endorse, sponsor, or review this manual. All fee figures are derived from Etsy's published seller fee schedule as of the build date printed on the colophon page.",
  },
  {
    q: "Why isn't VAT or sales tax in the fee breakdown?",
    a: "VAT, GST, and US sales tax are collected from the buyer and remitted on your behalf — they don't reduce your net profit on the sale itself. They affect cash-flow timing and bookkeeping, not margin, so they're outside the scope of this book. Talk to a local accountant for the tax-side picture.",
  },
  {
    q: "Does this cover Etsy Ads (on-site PPC), or only Off-Site Ads?",
    a: "Off-Site Ads only. Etsy Ads (the on-site PPC product where you set a daily budget) is a discretionary marketing spend, not a per-sale fee — it doesn't fit the same waterfall and would skew the per-listing math. Track Etsy Ads spend separately in your P&L.",
  },
  {
    q: "Does this work for print-on-demand and dropship sellers?",
    a: `Yes. The category cards already include t-shirts, mugs, baby clothing, stickers, and pet portraits — common POD product types. The ${MATRIX_NAME}'s manufacturing-cost column is where you put your supplier's per-unit rate. Swap in your actual Printify, Printful, or Gelato number for a sharper read on a specific listing.`,
  },
  {
    q: "Can I share this with a business partner or my mastermind group?",
    a: "Single license per buyer. If multiple people in your shop or mastermind want a copy, please buy additional licenses. The price is set low enough that this is the honest path; group-buying erodes the model that lets us keep the manual updated and free of ads.",
  },
];

function drawFaqAppendix(doc: Doc) {
  doc.addPage();
  H1(doc, "Frequently asked questions");
  P(
    doc,
    `Common questions about using this book, the ${MATRIX_NAME}, and the underlying fee math.`,
  );
  for (const f of BIBLE_FAQ) {
    H3(doc, f.q);
    P(doc, f.a);
  }
}

function drawColophon(doc: Doc) {
  doc.addPage();
  H1(doc, "Methodology & disclaimer");
  H2(doc, "Fee constants used in this edition");
  drawTable(
    doc,
    ["Constant", "Value"],
    [
      ["Listing Fee", `$${LISTING_FEE.toFixed(2)}`],
      ["Transaction Fee Rate", `${(TRANSACTION_FEE_RATE * 100).toFixed(1)}%`],
      ["Off-Site Ads Rate (under $10k)", `${(OFFSITE_ADS_RATE_UNDER_10K * 100).toFixed(0)}%`],
      ["Off-Site Ads Rate (at/above $10k)", `${(OFFSITE_ADS_RATE_AT_10K * 100).toFixed(0)}%`],
      ["Off-Site Ads Fee Cap", `$${OFFSITE_ADS_FEE_CAP.toFixed(0)}`],
    ],
    [260, 200],
  );
  H2(doc, "Source of truth");
  P(
    doc,
    "All numbers in this manual are produced by the same fee model that powers etsymargin.tools. There is no second source. When Etsy changes its fee structure, the model updates and this manual is rebuilt.",
  );
  H2(doc, "Disclaimer");
  P(
    doc,
    "This is an independent reference. It is not affiliated with, endorsed by, or sponsored by Etsy, Inc. Numbers are accurate to the published fee structure as of the build date below. Verify against your own Etsy seller dashboard before making large pricing decisions.",
  );
  muted(doc, `Built ${new Date().toISOString().slice(0, 10)} from etsymargin.tools fee model.`);
}

// --- Main -------------------------------------------------------------------

function buildPdf(): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      bufferPages: true,
      info: {
        Title: "The 2026 Etsy Pricing Bible",
        Author: "etsymargin.tools",
        Subject: "Etsy seller fee reference manual",
        Keywords: "Etsy, fees, profit margin, pricing, off-site ads",
      },
    });
    const stream = fs.createWriteStream(PDF_PATH);
    stream.on("finish", () => resolve());
    stream.on("error", reject);
    doc.pipe(stream);

    drawCover(doc);
    drawForeword(doc);
    drawFeeStack(doc);
    drawBundlingChapter(doc);
    for (const cc of COUNTRY_CODES) drawCountryChapter(doc, cc);
    for (const entry of PSEO_ENTRIES) drawCategoryCard(doc, entry);
    drawFaqAppendix(doc);
    drawColophon(doc);

    doc.end();
  });
}

async function main() {
  ensureDir(OUT_DIR);
  const scenarios = allScenarios();
  const psvRowCount = writePsv(scenarios);
  await buildPdf();
  console.log(`product: wrote ${psvRowCount} scenario rows → ${PSV_PATH}`);
  console.log(`product: wrote PDF → ${PDF_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
