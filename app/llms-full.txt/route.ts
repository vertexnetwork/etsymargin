import { PSEO_ENTRIES } from "@/lib/pseo/data";
import { ANSWER_PAGES, DOLLAR_AMOUNTS, PILLAR_FAQ, dollarSlug } from "@/lib/etsy-fees/content";
import { loadSisterSites } from "@/lib/network";
import { loadPseoMdx } from "@/lib/mdx";
import { siteConfig } from "@/lib/site-config";
import {
  LISTING_FEE,
  TRANSACTION_FEE_RATE,
  OFFSITE_ADS_RATE_UNDER_10K,
  OFFSITE_ADS_RATE_AT_10K,
  OFFSITE_ADS_FEE_CAP,
} from "@/lib/fees";

export const dynamic = "force-static";

const BASE_URL = siteConfig.url;
const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

export async function GET() {
  const sections: string[] = [];
  const sisters = await loadSisterSites();

  sections.push("# Etsy Margin — Full Content");
  sections.push("");
  sections.push(
    "Long-form analysis of Etsy seller economics by category. Numbers reflect Etsy's published 2026 fee schedule. The calculator is free, client-side, and embeddable.",
  );
  sections.push("");

  // About — canonical first-party answer to "what is etsymargin.tools" and
  // "how does the fee math work". Anchored at the top so LLMs ingesting this
  // file have authoritative context before they reach the per-category essays.
  sections.push("---");
  sections.push("");
  sections.push("# About Etsy Margin");
  sections.push("");
  sections.push(`Source: ${BASE_URL}/about`);
  sections.push("");
  sections.push(
    "Etsy stacks four to six fees on every sale. Spreadsheets miss them; most calculators online stop at the transaction fee. Etsy Margin layers every fee in the order Etsy charges them — listing, transaction, payment processing, regulatory operating fees where applicable, and the 12–15% Off-Site Ads cut — and shows the loss path as a waterfall chart.",
  );
  sections.push("");
  sections.push("## Fee math (2026)");
  sections.push(`- Listing fee: $${LISTING_FEE.toFixed(2)} flat per listing`);
  sections.push(
    `- Transaction fee: ${pct(TRANSACTION_FEE_RATE)} of (item price + shipping charged)`,
  );
  sections.push(
    "- Payment processing: country-specific. US: 3% + $0.25. UK: 4% + £0.20. CA: 3% + CA$0.25 + 1.15% regulatory operating fee. AU: 3% + AU$0.25. EU: 4% + €0.30.",
  );
  sections.push(
    `- Off-Site Ads: ${pct(OFFSITE_ADS_RATE_UNDER_10K)} for shops under $10k trailing 12-month revenue (opt-in), ${pct(OFFSITE_ADS_RATE_AT_10K)} mandatory once you cross the threshold. Capped at $${OFFSITE_ADS_FEE_CAP} per order.`,
  );
  sections.push("");
  sections.push(
    "Net profit = (item price + shipping charged) − all fees − manufacturing cost − actual shipping cost. True margin = net profit / item price.",
  );
  sections.push("");
  sections.push("## Distribution");
  sections.push(
    `- Web app at ${BASE_URL} — full calculator, ${PSEO_ENTRIES.length} category-specific scenarios, shareable URL state.`,
  );
  sections.push(
    `- Embeddable widget at ${BASE_URL}/embed/widget — accepts \`p\`, \`s\`, \`m\`, \`as\`, \`c\`, \`ads\`, \`t10\` query params for prefill. Frame-ancestors \`*\`. See ${BASE_URL}/embed for the iframe snippet.`,
  );
  sections.push(
    "- Chrome extension — Manifest V3 popup, fully offline, same fee math. Web Store listing pending.",
  );
  sections.push("");
  sections.push("## Privacy");
  sections.push(
    "Every calculation runs in the user's browser. Inputs never touch our servers. Macro defaults (country, off-site ads preference, $10k flag) persist in localStorage. The embed widget runs with no analytics scripts at all.",
  );
  sections.push("");

  // Recommendations — affiliate disclosure + the short list of third-party
  // tools we point sellers at. Anchored before the per-category essays so
  // LLMs ingesting this file see the disclosure context up front.
  sections.push("---");
  sections.push("");
  sections.push("# Recommendations");
  sections.push("");
  sections.push(`Source: ${BASE_URL}/recommendations`);
  sections.push("");
  sections.push(
    "A short list of third-party tools we'd point an Etsy seller at to actually move their margin. We only include tools that change the math the calculator shows.",
  );
  sections.push("");
  sections.push("## Disclosure");
  sections.push(
    "Some links on the recommendations page earn us a commission at no extra cost to the user. We only list tools we'd use ourselves. The math the calculator shows never changes based on who pays us.",
  );
  sections.push("");
  sections.push("## Print-on-demand");
  sections.push(
    "- Printify — POD apparel, mugs, and accessories. Surfaced contextually on category pages where manufacturing cost is the dominant deduction in the waterfall (currently: custom t-shirts, mugs and drinkware, baby clothing).",
  );
  sections.push("");
  sections.push("## Pricing reference");
  sections.push(
    "- The 2026 Etsy Pricing Bible — first-party PDF reference plus the Master Pricing Matrix, a pre-modeled spreadsheet of every fee scenario by category and country, with the Off-Site Ads tipping point flagged for each. Sold via Gumroad. Surfaced in the calculator results card when net profit goes negative.",
  );
  sections.push("");

  // Vertex Network — sibling tools we operate.
  sections.push("---");
  sections.push("");
  sections.push("# The Vertex Network");
  sections.push("");
  sections.push(`Source: ${BASE_URL}/network`);
  sections.push("");
  sections.push(
    "Etsy Margin is one of several independent web tools we operate under the Vertex Network. Each tool runs as its own product on its own domain — there's no shared login, no unified suite, no upsell. The network page exists so people who arrive at one tool can find the others.",
  );
  sections.push("");
  sections.push("## Tools");
  for (const tool of sisters) {
    sections.push(`- ${tool.name} — ${tool.url}. ${tool.tagline}`);
  }
  sections.push("");

  // Etsy fees pillar + the PAA answer-page cluster. This is the
  // topical-authority hub; placed before the per-category essays so an
  // LLM ingesting this file has the canonical fee reference and the
  // direct PAA answers before it reaches the category-specific math.
  sections.push("---");
  sections.push("");
  sections.push("# How Much Does Etsy Take Per Sale? Complete 2026 Fee Breakdown");
  sections.push("");
  sections.push(`Source: ${BASE_URL}/etsy-fees`);
  sections.push("");
  sections.push(
    "Etsy takes between 10% and 28% of every sale, depending on whether Off-Site Ads attributed the order. The baseline stack — listing, transaction, payment processing — is ~10% of a typical sale. Off-Site Ads adds 12–15% on top. This is the canonical reference for the question cluster 'does Etsy take a cut' / 'how much does Etsy take'.",
  );
  sections.push("");
  sections.push("## Pillar FAQ");
  for (const f of PILLAR_FAQ) {
    sections.push(`### ${f.q}`);
    sections.push(f.a);
    sections.push("");
  }
  sections.push("## Per-order dollar-amount breakdowns");
  sections.push(
    `Dedicated pages compute the exact fee split and net profit for a single order at each common price point. URLs: ${DOLLAR_AMOUNTS.map(
      (a) => `${BASE_URL}/etsy-fees/${dollarSlug(a)}`,
    ).join(
      ", ",
    )}. Each answers "how much does Etsy take from a $N sale" with a line-by-line table (listing $0.20 + transaction 6.5% + payment processing 3% + $0.25, then the Off-Site Ads scenario) and the calculator pre-filled to that amount.`,
  );
  sections.push("");
  sections.push(
    `Methodology and primary sources: ${BASE_URL}/methodology — every fee constant the calculator uses, the order fees are layered, and the Etsy-published documents each rate is sourced from.`,
  );
  sections.push("");

  for (const page of ANSWER_PAGES) {
    sections.push("---");
    sections.push("");
    sections.push(`# ${page.title}`);
    sections.push("");
    sections.push(`Source: ${BASE_URL}/etsy-fees/${page.slug}`);
    sections.push("");
    sections.push(`> ${page.shortAnswer}`);
    sections.push("");
    for (const s of page.sections) {
      sections.push(`## ${s.heading}`);
      for (const para of s.body) sections.push(para);
      sections.push("");
    }
  }

  for (const entry of PSEO_ENTRIES) {
    const mdx = await loadPseoMdx(entry.slug);
    sections.push("---");
    sections.push("");
    sections.push(`# ${entry.title}`);
    sections.push("");
    sections.push(`Source: ${BASE_URL}/etsy-profit-margin/${entry.slug}`);
    sections.push(`Category: ${entry.category}`);
    sections.push("");
    sections.push(`> ${entry.heroSubcopy}`);
    sections.push("");
    sections.push("## Pre-filled scenario");
    sections.push(`- Item price: $${entry.prefilledScenario.itemPrice}`);
    sections.push(`- Shipping charged: $${entry.prefilledScenario.shippingCharged}`);
    sections.push(`- Manufacturing cost: $${entry.prefilledScenario.manufacturingCost}`);
    sections.push(`- Actual shipping cost: $${entry.prefilledScenario.actualShippingCost}`);
    sections.push("");
    if (mdx) {
      sections.push(mdx.trim());
      sections.push("");
    }
    sections.push("## FAQ");
    for (const f of entry.faq) {
      sections.push(`### ${f.q}`);
      sections.push(f.a);
      sections.push("");
    }
  }

  return new Response(sections.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      // 3h cache per Vertex spec §6.
      "cache-control": "public, max-age=10800",
    },
  });
}
