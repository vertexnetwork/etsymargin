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
//   3. Else the lever is pricing strategy → the Etsy Pricing Bible (own
//      product). For low-priced items (< $10) the specific lever is bundling,
//      which collapses the flat-fee drag — so we pitch the bundling angle.
//   4. Healthy margins get information, not a pitch — with one exception: a
//      low-priced item still carries real flat-fee drag, so we surface the
//      bundling *opportunity* (soft, never alarmist) even at a good margin.
//
// The Bible pitch is tiered by severity so the tone matches the seller's
// reality: a loss reads urgent, a thin margin reads cautionary, and a merely
// workable margin (15–30%) gets a soft nudge — not a hard sell at numbers
// that are actually fine.

export const HEALTHY_MARGIN = 0.3;
export const THIN_MARGIN = 0.15;
// Below this item price, Etsy's two flat fees ($0.20 listing + $0.25 fixed
// processing) dominate the effective rate — the lever is bundling, not a
// generic price bump. Matches the Bible's bundling chapter.
export const LOW_PRICE = 10;
// Off-Site Ads is ~60% of total fees when enabled under $10k, so 0.3 cleanly
// separates "Off-Site Ads is the story" from "it's a minor line item".
export const OFFSITE_FEE_SHARE_TRIGGER = 0.3;
// Manufacturing eating ≥30% of gross is where Printify's per-unit pricing
// (typically 15–30% under a blended Etsy seller cost) moves the needle.
export const MANUFACTURING_SHARE_TRIGGER = 0.3;

const OFFSITE_ADS_LABEL = "Off-Site Ads Fee";

// Severity of the pricing situation, lowest-to-highest urgency. "opportunity"
// is the healthy-but-low-priced case — a positive nudge, not a problem.
export type AdviceTier = "opportunity" | "workable" | "thin" | "loss";

export type NextBestAction =
  | { kind: "none" }
  | { kind: "healthy"; effectiveFeeRate: number }
  | { kind: "optout-offsite"; offsiteFee: number; offsiteShare: number }
  | { kind: "lower-cogs"; manufacturingShare: number }
  | { kind: "bundle"; tier: AdviceTier; itemPrice: number; effectiveFeeRate: number }
  | { kind: "pricing"; tier: Exclude<AdviceTier, "opportunity">; netProfit: number };

export function nextBestAction(result: CalculatorResult, inputs: CalculatorInputs): NextBestAction {
  // Degenerate/empty state — no item priced yet, nothing to advise.
  if (inputs.itemPrice <= 0) return { kind: "none" };

  const losing = result.netProfit < 0;
  const margin = result.marginPercent;
  const lowPrice = inputs.itemPrice < LOW_PRICE;

  // Comfortably profitable. Information, not a pitch — unless it's a low-priced
  // item, where the flat-fee drag is a specific, honest opportunity (bundling)
  // worth one soft line even at a healthy margin.
  if (!losing && margin >= HEALTHY_MARGIN) {
    if (lowPrice) {
      return {
        kind: "bundle",
        tier: "opportunity",
        itemPrice: inputs.itemPrice,
        effectiveFeeRate: result.effectiveFeeRate,
      };
    }
    return { kind: "healthy", effectiveFeeRate: result.effectiveFeeRate };
  }

  // Below healthy (losing, thin <15%, or workable 15–30%): surface the dominant
  // honest lever first — the free win, then COGS — before any Bible pitch.
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

  // The lever is pricing. Tier the urgency by the seller's actual margin.
  const tier: Exclude<AdviceTier, "opportunity"> = losing
    ? "loss"
    : margin < THIN_MARGIN
      ? "thin"
      : "workable";

  // For low-priced items the specific lever is bundling (flat-fee drag), not a
  // generic "raise your price" — pitch the bundling angle at the matching tier.
  if (lowPrice) {
    return {
      kind: "bundle",
      tier,
      itemPrice: inputs.itemPrice,
      effectiveFeeRate: result.effectiveFeeRate,
    };
  }
  return { kind: "pricing", tier, netProfit: result.netProfit };
}
