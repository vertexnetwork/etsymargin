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

  it("returns 'healthy' when margin clears 15% — even with Off-Site Ads on", () => {
    // High price, low cost: margin is comfortable, so no pitch.
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

  it("routes to 'pricing' for a thin margin not explained by ads or manufacturing", () => {
    // Tiny price where flat fees dominate and manufacturing share is low.
    const action = route({ itemPrice: 0.5, manufacturingCost: 0, offsiteAdsEnabled: false });
    expect(action.kind).toBe("pricing");
  });

  it("flags a loss in the 'pricing' branch", () => {
    const action = route({ itemPrice: 0.4, manufacturingCost: 0, offsiteAdsEnabled: false });
    expect(action.kind).toBe("pricing");
    if (action.kind === "pricing") {
      expect(action.losing).toBe(true);
      expect(action.netProfit).toBeLessThan(0);
    }
  });
});
