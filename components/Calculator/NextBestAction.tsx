"use client";

import type { CalculatorInputs, CalculatorResult } from "@/lib/fees";
import { nextBestAction, type AdviceTier } from "@/lib/next-best-action";
import { GumroadCta } from "@/components/affiliates/GumroadCta";
import { PrintifyCard } from "@/components/affiliates/PrintifyCard";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const pct = (n: number) => `${Math.round(n * 100)}%`;

// The bundling hook for low-priced items. Stays accurate regardless of the
// Off-Site Ads toggle by talking about the flat fees as a per-order tax (true
// in every scenario) rather than citing the total effective rate (which would
// fold in the ads cut and overstate what bundling fixes). The specific
// 18.6%→10.4% numbers live in the Bible's bundling chapter, where the scenario
// is controlled.
function bundleLine(tier: AdviceTier, itemPrice: number, category?: string): string {
  const price = usd(itemPrice);
  const digital = category?.toLowerCase() === "digital";
  if (tier === "opportunity") {
    return `Solid margin — but at ${price}, Etsy's flat listing + processing fees are a fixed tax that barely shrinks per item.${
      digital ? " Digital products bundle at no extra cost, so the whole saving is margin." : ""
    } Bundling a few into one listing pays those flat fees once, not on every order.`;
  }
  return `At ${price}, Etsy's flat fees bite as hard as on a $50 sale — they're charged per order, not per item.${
    digital ? " And digital bundles add no cost." : ""
  } Bundling is the highest-leverage fix here.`;
}

// The generic pricing pitch for items above the bundling zone. Category-aware:
// POD/Apparel sellers get the "overhead twice" framing the Bible leads with.
function pricingLine(
  tier: Exclude<AdviceTier, "opportunity">,
  netProfit: number,
  category?: string,
): string {
  const apparel = category?.toLowerCase() === "apparel";
  const podPrefix = apparel
    ? "Print-on-demand pays overhead twice — your supplier and Etsy's full fee stack. "
    : "";
  if (tier === "loss") {
    return `${podPrefix}You're losing ${usd(Math.abs(netProfit))} on every order at this price — and the listings quietly doing this across a shop are the ones you never think to check.`;
  }
  if (tier === "thin") {
    return `${podPrefix}Margin under 15% leaves no room for variants, sales, or rising costs — and thin listings like this hide in plain sight across a full shop.`;
  }
  // workable (15–30%) — soft nudge, never alarmist.
  return "Margin's workable, but tight — there's usually a higher-netting price for a product like this, and the category cards show where it lands.";
}

// Renders the one action the seller's own numbers point to. Message + CTA are
// chosen together by nextBestAction() so the pitch always matches the lever
// the waterfall just showed. On category pages, `category` tailors the copy.
// See lib/next-best-action.ts for the ordering and tiering.
export function NextBestAction({
  result,
  inputs,
  category,
}: {
  result: CalculatorResult;
  inputs: CalculatorInputs;
  category?: string;
}) {
  const action = nextBestAction(result, inputs);

  switch (action.kind) {
    case "none":
      return null;

    case "healthy":
      // Healthy margin → information, not a pitch. Best action is to keep the
      // price (or share/embed via the controls below).
      return (
        <p className="mt-3 text-sm opacity-75">
          Etsy takes {pct(result.effectiveFeeRate)} of revenue in fees before any product cost — and
          this price absorbs it.
        </p>
      );

    case "optout-offsite":
      // The free win. No affiliate link by design.
      return (
        <div
          role="note"
          className="mt-3 rounded-lg bg-amber-50/60 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200/70"
        >
          <span className="font-semibold">
            Off-Site Ads is adding {usd(action.offsiteFee)} — {pct(action.offsiteShare)} of your
            fees.
          </span>{" "}
          You&apos;re under $10k trailing revenue, so this one is opt-out: Shop Manager → Marketing
          → Off-Site Ads. That&apos;s your highest-leverage move, and it costs nothing.
        </div>
      );

    case "lower-cogs":
      return (
        <>
          <p className="mt-3 text-sm font-medium">
            Manufacturing is eating {pct(action.manufacturingShare)} of your gross — that&apos;s the
            lever here, not Etsy&apos;s fees.
          </p>
          <PrintifyCard variant="compact" source="calculator" campaign="calc-cogs" />
        </>
      );

    case "bundle":
      // Low-priced item → the bundling lever. Opportunity tone (healthy) reads
      // soft; the problem tiers read as the fix to a real squeeze.
      return (
        <>
          <p
            className={
              action.tier === "opportunity" ? "mt-3 text-sm opacity-80" : "mt-3 text-sm font-medium"
            }
          >
            {bundleLine(action.tier, action.itemPrice, category)}
          </p>
          <GumroadCta variant="compact" source="calculator" content="calc-bundle" />
        </>
      );

    case "pricing":
      return (
        <>
          <p className="mt-3 text-sm font-medium">
            {pricingLine(action.tier, action.netProfit, category)}
          </p>
          <GumroadCta
            variant="compact"
            source="calculator"
            content={
              action.tier === "loss"
                ? "calc-loss"
                : action.tier === "thin"
                  ? "calc-thin"
                  : "calc-workable"
            }
          />
        </>
      );
  }
}
