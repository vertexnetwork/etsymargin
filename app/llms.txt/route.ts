import { PSEO_ENTRIES } from "@/lib/pseo/data";

export const dynamic = "force-static";

const BASE_URL = "https://etsymargin.tools";

export function GET() {
  const lines: string[] = [];

  lines.push("# Etsy Margin");
  lines.push("");
  lines.push(
    "> Free, client-side Etsy profit calculator. Computes true net profit and margin after every layered Etsy fee — listing, transaction, payment processing, regulatory operating fee, and the 12–15% Off-Site Ads cut (capped at $100 per order).",
  );
  lines.push("");
  lines.push(
    "Numbers reflect Etsy's published 2026 fee schedule. The calculator is fully client-side; inputs serialize to URL query parameters so any scenario can be linked or shared. Country selector covers US, UK, Canada, Australia, and the EU, including the Canada 1.15% regulatory operating fee.",
  );
  lines.push("");

  lines.push("## Calculator");
  lines.push(`- [Etsy Margin Calculator](${BASE_URL}): Live calculator with waterfall chart, fee breakdown, and shareable URL state.`);
  lines.push("");

  lines.push("## Profit math by Etsy category");
  for (const entry of PSEO_ENTRIES) {
    lines.push(
      `- [${entry.title}](${BASE_URL}/etsy-profit-margin/${entry.slug}): ${entry.metaDescription}`,
    );
  }
  lines.push("");

  lines.push("## Fee reference (2026)");
  lines.push("- Listing fee: $0.20 per listing or sale");
  lines.push("- Transaction fee: 6.5% of (item price + shipping charged)");
  lines.push("- Payment processing (US): 3% + $0.25");
  lines.push("- Payment processing (UK): 4% + £0.20");
  lines.push("- Payment processing (Canada): 3% + CA$0.25 + 1.15% regulatory operating fee");
  lines.push("- Payment processing (Australia): 3% + AU$0.25");
  lines.push("- Payment processing (EU): 4% + €0.30");
  lines.push("- Off-Site Ads (under $10k trailing 12-mo revenue): 15%, optional");
  lines.push("- Off-Site Ads (≥ $10k trailing 12-mo revenue): 12%, mandatory");
  lines.push("- Off-Site Ads cap: $100 maximum per order");
  lines.push("");

  lines.push("## Optional");
  lines.push(`- [llms-full.txt](${BASE_URL}/llms-full.txt): Full long-form content for all category pages.`);

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
