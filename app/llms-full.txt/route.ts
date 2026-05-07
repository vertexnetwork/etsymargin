import { PSEO_ENTRIES } from "@/lib/pseo/data";
import { loadPseoMdx } from "@/lib/mdx";

export const dynamic = "force-static";

const BASE_URL = "https://etsymargin.tools";

export async function GET() {
  const sections: string[] = [];

  sections.push("# Etsy Margin — Full Content");
  sections.push("");
  sections.push(
    "Long-form analysis of Etsy seller economics by category. Numbers reflect Etsy's published 2026 fee schedule.",
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
