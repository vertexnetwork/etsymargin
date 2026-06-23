import { describe, expect, it } from "vitest";
import { computeFoundingOffer, FOUNDER_CAP, FOUNDER_CODE } from "@/lib/gumroad-stats";

describe("computeFoundingOffer", () => {
  it("is active with spots remaining when sales are below the cap", () => {
    const offer = computeFoundingOffer(0);
    expect(offer.active).toBe(true);
    expect(offer.remaining).toBe(FOUNDER_CAP);
    expect(offer.code).toBe(FOUNDER_CODE);
  });

  it("counts down as sales accrue", () => {
    expect(computeFoundingOffer(5).remaining).toBe(FOUNDER_CAP - 5);
  });

  it("deactivates and clamps remaining at zero once the cap is hit", () => {
    const atCap = computeFoundingOffer(FOUNDER_CAP);
    expect(atCap.active).toBe(false);
    expect(atCap.remaining).toBe(0);
  });

  it("stays clamped (never negative) past the cap", () => {
    const past = computeFoundingOffer(FOUNDER_CAP + 10);
    expect(past.active).toBe(false);
    expect(past.remaining).toBe(0);
  });

  it("fails closed (full price) when the count is unknown", () => {
    const unknown = computeFoundingOffer(null);
    expect(unknown.active).toBe(false);
  });
});
