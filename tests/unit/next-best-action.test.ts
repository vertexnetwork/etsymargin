import { describe, expect, it } from "vitest";
import { calculate, type CalculatorInputs } from "@/lib/fees";
import { nextBestAction } from "@/lib/next-best-action";

// Drive the router through the real fee math so the routing is tested against
// actual results, not hand-mocked numbers.
const base: CalculatorInputs = {
  itemPrice: 25,
  shippingCharged: 0,
  manufacturingCost: 4,
  actualShippingCost: 0,
  country: "US",
  offsiteAdsEnabled: false,
  atOrAbove10k: false,
};

const route = (overrides: Partial<CalculatorInputs>) => {
  const inputs = { ...base, ...overrides };
  return nextBestAction(calculate(inputs), inputs);
};

describe("nextBestAction", () => {
  it("returns 'none' before an item is priced", () => {
    expect(route({ itemPrice: 0 }).kind).toBe("none");
  });

  it("returns 'healthy' when margin clears 30% — even with Off-Site Ads on", () => {
    // High price, low cost: margin is comfortable (>30%), so no pitch. The
    // healthy check pre-empts the Off-Site Ads opt-out by design.
    const action = route({ itemPrice: 50, manufacturingCost: 5, offsiteAdsEnabled: true });
    expect(action.kind).toBe("healthy");
  });

  it("prioritizes the free Off-Site Ads opt-out when it's the dominant fee and shop is under $10k", () => {
    // Thin margin, Off-Site Ads on, under $10k, manufacturing also high —
    // the free opt-out still wins over the affiliate.
    const action = route({
      itemPrice: 20,
      manufacturingCost: 12,
      actualShippingCost: 2,
      offsiteAdsEnabled: true,
      atOrAbove10k: false,
    });
    expect(action.kind).toBe("optout-offsite");
    if (action.kind === "optout-offsite") {
      expect(action.offsiteFee).toBeGreaterThan(0);
      expect(action.offsiteShare).toBeGreaterThanOrEqual(0.3);
    }
  });

  it("does NOT offer opt-out when Off-Site Ads is mandatory (≥$10k)", () => {
    // Same squeeze, but at/above $10k Off-Site Ads can't be opted out, so the
    // lever falls through to the next dominant cost (manufacturing here).
    const action = route({
      itemPrice: 20,
      manufacturingCost: 12,
      actualShippingCost: 2,
      offsiteAdsEnabled: true,
      atOrAbove10k: true,
    });
    expect(action.kind).toBe("lower-cogs");
  });

  it("routes to 'lower-cogs' when manufacturing is the dominant drag", () => {
    const action = route({ itemPrice: 20, manufacturingCost: 15, actualShippingCost: 1 });
    expect(action.kind).toBe("lower-cogs");
    if (action.kind === "lower-cogs") {
      expect(action.manufacturingShare).toBeGreaterThanOrEqual(0.3);
    }
  });

  it("routes a low-priced item to the bundling lever, even at a healthy margin", () => {
    // $5 digital download: 81% margin, but flat fees still drag. Healthy + low
    // price → bundle with the soft 'opportunity' tone, not a generic pitch.
    const action = route({ itemPrice: 5, manufacturingCost: 0, offsiteAdsEnabled: false });
    expect(action.kind).toBe("bundle");
    if (action.kind === "bundle") {
      expect(action.tier).toBe("opportunity");
      expect(action.itemPrice).toBe(5);
    }
  });

  it("routes a losing low-priced item to 'bundle' at the loss tier", () => {
    // Cheap item underwater on shipping — bundling is the specific fix, so the
    // pitch is bundle (loss tier), not the generic pricing line.
    const action = route({
      itemPrice: 5,
      manufacturingCost: 0,
      actualShippingCost: 6,
      offsiteAdsEnabled: false,
    });
    expect(action.kind).toBe("bundle");
    if (action.kind === "bundle") {
      expect(action.tier).toBe("loss");
    }
  });

  it("routes a mid-priced 'workable' margin to 'pricing' (not bundle, not cogs)", () => {
    // $20 item, low manufacturing share but heavy actual shipping pulls margin
    // into the 15–30% band — the lever is pricing, soft-nudged.
    const action = route({
      itemPrice: 20,
      manufacturingCost: 3,
      actualShippingCost: 10,
      offsiteAdsEnabled: false,
    });
    expect(action.kind).toBe("pricing");
    if (action.kind === "pricing") {
      expect(action.tier).toBe("workable");
    }
  });

  it("flags a loss in the 'pricing' branch for an above-bundling-zone item", () => {
    const action = route({
      itemPrice: 20,
      manufacturingCost: 3,
      actualShippingCost: 25,
      offsiteAdsEnabled: false,
    });
    expect(action.kind).toBe("pricing");
    if (action.kind === "pricing") {
      expect(action.tier).toBe("loss");
      expect(action.netProfit).toBeLessThan(0);
    }
  });
});
