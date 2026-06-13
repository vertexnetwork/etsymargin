import { describe, expect, it } from "vitest";
import {
  auditListings,
  parseCsv,
  parseEtsyListings,
  parseSkuCostMap,
  resolveManufacturingCost,
  summarize,
  toCalculatorInputs,
  type AuditGlobals,
} from "@/lib/etsy-export";

const globals: AuditGlobals = {
  country: "US",
  offsiteAdsEnabled: false,
  atOrAbove10k: false,
  shippingCharged: 0,
  actualShippingCost: 0,
  cogs: { mode: "percent", percent: 0.35 },
};

describe("parseCsv", () => {
  it("handles quoted fields with embedded commas, quotes, and newlines", () => {
    const csv = 'a,b,c\n"x, y","he said ""hi""","line1\nline2"\n';
    const rows = parseCsv(csv);
    expect(rows).toEqual([
      ["a", "b", "c"],
      ["x, y", 'he said "hi"', "line1\nline2"],
    ]);
  });

  it("strips a UTF-8 BOM and tolerates CRLF and a missing trailing newline", () => {
    const csv = "﻿TITLE,PRICE\r\nMug,12.50";
    expect(parseCsv(csv)).toEqual([
      ["TITLE", "PRICE"],
      ["Mug", "12.50"],
    ]);
  });
});

describe("parseEtsyListings", () => {
  it("detects columns by header name regardless of order/case and coerces price", () => {
    const csv = ["SKU,Title,Quantity,PRICE", 'MUG-1,"Mug, ceramic",3,$12.50'].join("\n");
    const { rows, warnings } = parseEtsyListings(csv);
    expect(warnings).toEqual([]);
    expect(rows[0]).toEqual({ sku: "MUG-1", title: "Mug, ceramic", price: 12.5, quantity: 3 });
  });

  it("warns when the price column is absent", () => {
    const { rows, warnings } = parseEtsyListings("Title,SKU\nMug,M1");
    expect(rows[0].price).toBe(0);
    expect(warnings.some((w) => /price/i.test(w))).toBe(true);
  });
});

describe("parseSkuCostMap", () => {
  it("parses comma/pipe/tab separated lines and skips junk", () => {
    const map = parseSkuCostMap("MUG-1,3.20\nTEE|8.75\nBAD\n  \nNEG,-1");
    expect(map).toEqual({ "MUG-1": 3.2, TEE: 8.75 });
  });
});

describe("resolveManufacturingCost", () => {
  it("uses the per-SKU override when present, else the strategy", () => {
    const row = { title: "t", sku: "MUG-1", price: 20, quantity: 1 };
    expect(resolveManufacturingCost(row, globals)).toBeCloseTo(7); // 35% of 20
    expect(resolveManufacturingCost(row, { ...globals, skuCostMap: { "MUG-1": 4 } })).toBe(4);
  });

  it("applies a flat strategy independent of price", () => {
    const row = { title: "t", sku: "", price: 50, quantity: 1 };
    expect(resolveManufacturingCost(row, { ...globals, cogs: { mode: "flat", amount: 6 } })).toBe(
      6,
    );
  });
});

describe("toCalculatorInputs", () => {
  it("threads globals and resolved cost into the calculator shape", () => {
    const row = { title: "t", sku: "X", price: 30, quantity: 1 };
    const inputs = toCalculatorInputs(row, {
      ...globals,
      shippingCharged: 5,
      actualShippingCost: 4,
    });
    expect(inputs).toMatchObject({
      itemPrice: 30,
      shippingCharged: 5,
      actualShippingCost: 4,
      country: "US",
      offsiteAdsEnabled: false,
    });
    expect(inputs.manufacturingCost).toBeCloseTo(10.5);
  });
});

describe("auditListings + summarize", () => {
  it("classifies each listing into a margin band and counts them", () => {
    const rows = [
      { title: "loser", sku: "LOSS", price: 5, quantity: 1 }, // cost > price via override → loss
      { title: "healthy", sku: "", price: 100, quantity: 1 }, // high price, 35% cogs → healthy
    ];
    const audited = auditListings(rows, { ...globals, skuCostMap: { LOSS: 6 } });
    const summary = summarize(audited);
    expect(summary.total).toBe(2);
    expect(summary.loss).toBe(1);
    expect(summary.healthy).toBe(1);
    // Worst-first ordering: the loss sorts to the front.
    expect(summary.worst[0].row.title).toBe("loser");
    expect(audited.find((a) => a.row.title === "loser")?.result.netProfit).toBeLessThan(0);
  });
});
