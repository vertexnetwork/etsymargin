import { PSEO_ENTRIES } from "@/lib/pseo/data";
import { loadPseoMdx } from "@/lib/mdx";
import {
  LISTING_FEE,
  TRANSACTION_FEE_RATE,
  OFFSITE_ADS_RATE_UNDER_10K,
  OFFSITE_ADS_RATE_AT_10K,
  OFFSITE_ADS_FEE_CAP,
} from "@/lib/fees";

export const dynamic = "force-static";

const BASE_URL = "https://etsymargin.tools";
const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

export async function GET() {
  const sections: string[] = [];

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
  sections.push(`- Transaction fee: ${pct(TRANSACTION_FEE_RATE)} of (item price + shipping charged)`);
  sections.push("- Payment processing: country-specific. US: 3% + $0.25. UK: 4% + £0.20. CA: 3% + CA$0.25 + 1.15% regulatory operating fee. AU: 3% + AU$0.25. EU: 4% + €0.30.");
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
    `- Web app at ${BASE_URL} — full calculator, 20 category-specific scenarios, shareable URL state.`,
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
      "cache-control": "public, max-age=3600",
    },
  });
}
