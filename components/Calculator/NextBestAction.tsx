"use client";

import type { CalculatorInputs, CalculatorResult } from "@/lib/fees";
import { nextBestAction } from "@/lib/next-best-action";
import { GumroadCta } from "@/components/affiliates/GumroadCta";
import { PrintifyCard } from "@/components/affiliates/PrintifyCard";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const pct = (n: number) => `${Math.round(n * 100)}%`;

// Renders the one action the seller's own numbers point to. Message + CTA are
// chosen together by nextBestAction() so the pitch always matches the lever
// the waterfall just showed. See lib/next-best-action.ts for the ordering.
export function NextBestAction({
  result,
  inputs,
}: {
  result: CalculatorResult;
  inputs: CalculatorInputs;
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

    case "pricing":
      return (
        <>
          <p className="mt-3 text-sm font-medium">
            {action.losing
              ? `You're losing ${usd(Math.abs(action.netProfit))} on every order at this price.`
              : "Margin under 15% leaves no room for product variants, sales, or rising supplier costs."}
          </p>
          <GumroadCta
            variant="compact"
            source="calculator"
            content={action.losing ? "calc-loss" : "calc-thin"}
          />
        </>
      );
  }
}
