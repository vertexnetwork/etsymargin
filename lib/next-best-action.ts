import type { CalculatorInputs, CalculatorResult } from "./fees";

// Next-Best-Action: pick the single highest-leverage action for a seller from
// their own calculator output — no profiling, no tracking, computed on-device
// from inputs + result. The ordering encodes honesty over conversion:
//
//   1. If Off-Site Ads is the dominant fee AND the seller is under $10k
//      trailing revenue, the best action is FREE — opt out. We surface that
//      tip (no affiliate link) even though it earns us nothing, because a
//      fee-transparency tool that upsells past a free win burns its own trust.
//   2. Else if manufacturing is the dominant drag, the lever is production
//      cost → Printify (disclosed affiliate).
//   3. Else the lever is pricing strategy → the Etsy Pricing Bible (own product).
//   4. Healthy margins get information, not a pitch.

export const THIN_MARGIN = 0.15;
// Off-Site Ads is ~60% of total fees when enabled under $10k, so 0.3 cleanly
// separates "Off-Site Ads is the story" from "it's a minor line item".
export const OFFSITE_FEE_SHARE_TRIGGER = 0.3;
// Manufacturing eating ≥30% of gross is where Printify's per-unit pricing
// (typically 15–30% under a blended Etsy seller cost) moves the needle.
export const MANUFACTURING_SHARE_TRIGGER = 0.3;

const OFFSITE_ADS_LABEL = "Off-Site Ads Fee";

export type NextBestAction =
  | { kind: "none" }
  | { kind: "healthy"; effectiveFeeRate: number }
  | { kind: "optout-offsite"; offsiteFee: number; offsiteShare: number }
  | { kind: "lower-cogs"; manufacturingShare: number }
  | { kind: "pricing"; losing: boolean; netProfit: number };

export function nextBestAction(result: CalculatorResult, inputs: CalculatorInputs): NextBestAction {
  // Degenerate/empty state — no item priced yet, nothing to advise.
  if (inputs.itemPrice <= 0) return { kind: "none" };

  const losing = result.netProfit < 0;
  const thin = result.marginPercent < THIN_MARGIN;

  if (!losing && !thin) {
    return { kind: "healthy", effectiveFeeRate: result.effectiveFeeRate };
  }

  // Margin is negative or thin — find the dominant lever.
  const offsiteFee = result.fees.find((f) => f.label === OFFSITE_ADS_LABEL)?.amount ?? 0;
  const offsiteShare = result.totalFees > 0 ? offsiteFee / result.totalFees : 0;
  if (
    inputs.offsiteAdsEnabled &&
    !inputs.atOrAbove10k &&
    offsiteShare >= OFFSITE_FEE_SHARE_TRIGGER
  ) {
    return { kind: "optout-offsite", offsiteFee, offsiteShare };
  }

  const manufacturingShare = result.gross > 0 ? inputs.manufacturingCost / result.gross : 0;
  if (manufacturingShare >= MANUFACTURING_SHARE_TRIGGER) {
    return { kind: "lower-cogs", manufacturingShare };
  }

  return { kind: "pricing", losing, netProfit: result.netProfit };
}
