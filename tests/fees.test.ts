import { describe, expect, it } from "vitest";
import { calculate, OFFSITE_ADS_FEE_CAP } from "../lib/fees";

describe("calculate", () => {
  it("computes core US fees on a $25 item with $5 shipping, no ads", () => {
    const r = calculate({
      itemPrice: 25,
      shippingCharged: 5,
      manufacturingCost: 4,
      actualShippingCost: 5,
      country: "US",
      offsiteAdsEnabled: false,
      atOrAbove10k: false,
    });
    expect(r.gross).toBe(30);
    expect(r.fees.find((f) => f.label === "Listing Fee")?.amount).toBe(0.2);
    expect(r.fees.find((f) => f.label === "Transaction Fee")?.amount).toBe(1.95);
    expect(r.fees.find((f) => f.label === "Payment Processing")?.amount).toBe(1.15);
    expect(r.totalFees).toBe(3.3);
    expect(r.netProfit).toBe(17.7);
  });

  it("applies the 15% off-site ads rate for shops under $10k", () => {
    const r = calculate({
      itemPrice: 25,
      shippingCharged: 5,
      manufacturingCost: 4,
      actualShippingCost: 5,
      country: "US",
      offsiteAdsEnabled: true,
      atOrAbove10k: false,
    });
    expect(r.fees.find((f) => f.label === "Off-Site Ads Fee")?.amount).toBe(4.5);
  });

  it("applies the 12% off-site ads rate at the $10k threshold", () => {
    const r = calculate({
      itemPrice: 25,
      shippingCharged: 5,
      manufacturingCost: 4,
      actualShippingCost: 5,
      country: "US",
      offsiteAdsEnabled: true,
      atOrAbove10k: true,
    });
    expect(r.fees.find((f) => f.label === "Off-Site Ads Fee")?.amount).toBe(3.6);
  });

  it("caps the off-site ads fee at $100 per order", () => {
    const r = calculate({
      itemPrice: 1000,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
      country: "US",
      offsiteAdsEnabled: true,
      atOrAbove10k: false,
    });
    const adsFee = r.fees.find((f) => f.label === "Off-Site Ads Fee");
    expect(adsFee?.amount).toBe(OFFSITE_ADS_FEE_CAP);
    expect(adsFee?.detail).toContain("capped");
  });

  it("adds the Canadian regulatory operating fee", () => {
    const r = calculate({
      itemPrice: 100,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
      country: "CA",
      offsiteAdsEnabled: false,
      atOrAbove10k: false,
    });
    expect(
      r.fees.find((f) => f.label === "Regulatory Operating Fee")?.amount,
    ).toBe(1.15);
  });

  it("uses UK payment processing rate (4% + £0.20)", () => {
    const r = calculate({
      itemPrice: 100,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
      country: "UK",
      offsiteAdsEnabled: false,
      atOrAbove10k: false,
    });
    expect(r.fees.find((f) => f.label === "Payment Processing")?.amount).toBe(4.2);
  });

  it("uses EU payment processing rate (4% + €0.30)", () => {
    const r = calculate({
      itemPrice: 100,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
      country: "EU",
      offsiteAdsEnabled: false,
      atOrAbove10k: false,
    });
    expect(r.fees.find((f) => f.label === "Payment Processing")?.amount).toBe(4.3);
  });

  it("flat fees disproportionately punish tiny sales", () => {
    const tiny = calculate({
      itemPrice: 1,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
      country: "US",
      offsiteAdsEnabled: false,
      atOrAbove10k: false,
    });
    const big = calculate({
      itemPrice: 100,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
      country: "US",
      offsiteAdsEnabled: false,
      atOrAbove10k: false,
    });
    expect(tiny.effectiveFeeRate).toBeGreaterThan(big.effectiveFeeRate);
    expect(tiny.effectiveFeeRate).toBeGreaterThan(0.4);
  });

  it("handles a $0 item without dividing by zero", () => {
    const r = calculate({
      itemPrice: 0,
      shippingCharged: 0,
      manufacturingCost: 0,
      actualShippingCost: 0,
      country: "US",
      offsiteAdsEnabled: false,
      atOrAbove10k: false,
    });
    expect(r.marginPercent).toBe(0);
    expect(r.effectiveFeeRate).toBe(0);
  });

  it("computes margin correctly when net profit is negative", () => {
    const r = calculate({
      itemPrice: 12,
      shippingCharged: 0,
      manufacturingCost: 6,
      actualShippingCost: 4,
      country: "US",
      offsiteAdsEnabled: true,
      atOrAbove10k: false,
    });
    expect(r.netProfit).toBeLessThan(0);
    expect(r.marginPercent).toBeLessThan(0);
  });
});
