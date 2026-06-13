import { readFileSync } from "node:fs";
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

// Validates the parser against a fixture built to the real EtsyListingsDownload
// .csv schema (24 columns, BOM, CRLF, quoted comma-fields, escaped quotes,
// variation columns, blank SKUs). Regenerate via temp/.../make-sample-csv.mjs.
describe("real Etsy export schema (fixture)", () => {
  const csv = readFileSync(
    new URL("../fixtures/etsy-listings-sample.csv", import.meta.url),
    "utf8",
  );
  const { rows, warnings } = parseEtsyListings(csv);

  it("detects all the columns we need (no critical warnings)", () => {
    // price/title/sku all present in the real schema → zero warnings.
    expect(warnings).toEqual([]);
    expect(rows).toHaveLength(18);
  });

  it("does not mistake 'VARIATION 1 NAME' for the title column", () => {
    // TITLE precedes the variation columns, so first /title|name/ match wins.
    expect(rows[0].title).toBe("Vinyl Sticker - Wildflower Bouquet");
    expect(rows[0].price).toBe(3.5);
    expect(rows[0].sku).toBe("STK-WF-01");
  });

  it("parses a title containing a comma (quoted field)", () => {
    const pet = rows.find((r) => r.sku === "" && r.price === 25);
    expect(pet?.title).toBe("Custom Pet Portrait, Hand-Drawn Digital");
  });

  it("parses a title with escaped double-quotes", () => {
    const mug = rows.find((r) => r.sku === "MUG-GARD");
    expect(mug?.title).toBe('Ceramic Mug - "World\'s Okayest Gardener"');
  });

  it("keeps blank SKUs blank rather than dropping the row", () => {
    const blanks = rows.filter((r) => r.sku === "");
    expect(blanks.length).toBeGreaterThanOrEqual(3);
    expect(blanks.every((r) => r.price > 0 && r.title.length > 0)).toBe(true);
  });
});
