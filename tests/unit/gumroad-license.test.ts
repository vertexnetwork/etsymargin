import { describe, expect, it } from "vitest";
import { evaluateLicense } from "@/lib/gumroad-license";

const CAP = 5;

describe("evaluateLicense", () => {
  it("accepts a valid, unused-within-cap purchase", () => {
    expect(evaluateLicense({ success: true, uses: 1, purchase: {} }, CAP)).toEqual({ ok: true });
  });

  it("rejects an unsuccessful response", () => {
    expect(evaluateLicense({ success: false }, CAP)).toEqual({ ok: false, reason: "invalid" });
    expect(evaluateLicense(null, CAP)).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects refunded / chargebacked / disputed purchases regardless of uses", () => {
    expect(evaluateLicense({ success: true, uses: 1, purchase: { refunded: true } }, CAP).ok).toBe(
      false,
    );
    expect(
      evaluateLicense({ success: true, uses: 1, purchase: { chargebacked: true } }, CAP).ok,
    ).toBe(false);
    expect(evaluateLicense({ success: true, uses: 1, purchase: { disputed: true } }, CAP).ok).toBe(
      false,
    );
  });

  it("rejects when uses exceed the cap (sharing signal)", () => {
    expect(evaluateLicense({ success: true, uses: CAP + 1, purchase: {} }, CAP)).toEqual({
      ok: false,
      reason: "uses_exceeded",
    });
    // At the cap is still allowed.
    expect(evaluateLicense({ success: true, uses: CAP, purchase: {} }, CAP).ok).toBe(true);
  });

  it("ignores the uses cap when set to 0 (disabled)", () => {
    expect(evaluateLicense({ success: true, uses: 999, purchase: {} }, 0).ok).toBe(true);
  });
});
