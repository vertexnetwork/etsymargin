import { calculate, type CalculatorInputs, type CalculatorResult } from "./fees";
import type { CountryCode } from "./countries";
import { HEALTHY_MARGIN, THIN_MARGIN } from "./next-best-action";

// Bulk shop audit: parse an Etsy listings CSV export and run the same fee math
// the single-listing calculator uses (lib/fees) over every row. The export
// gives us price/title/SKU/quantity but NOT cost, shipping, country, or ads
// state — so the seller supplies those once as "globals", and we resolve a
// per-listing COGS via a strategy (flat %, flat $, or a per-SKU override map).
//
// NOTE: the exact Etsy export column headers are an open item to confirm
// against a real EtsyListingsDownload.csv. Column detection is therefore
// header-name based and tolerant, and emits warnings when an expected column
// is absent rather than guessing positionally.

// ---------------------------------------------------------------------------
// CSV parsing (RFC 4180-ish): handles quoted fields, embedded commas/newlines,
// and "" escaped quotes. Hand-rolled to avoid a runtime dependency for what is
// a small, well-tested state machine.
// ---------------------------------------------------------------------------
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  // Strip a leading UTF-8 BOM Excel/Etsy often prepend.
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      // Swallow \r\n as one break; ignore blank line artifacts.
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  // Flush trailing field/row (file not ending in newline).
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.length > 1 || row[0] !== "") rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Column detection + row extraction
// ---------------------------------------------------------------------------
export type ListingRow = {
  title: string;
  sku: string;
  price: number;
  quantity: number;
};

export type ParsedListings = {
  rows: ListingRow[];
  warnings: string[];
};

const findCol = (headers: string[], test: RegExp): number =>
  headers.findIndex((h) => test.test(h.trim().toLowerCase()));

const toNumber = (raw: string | undefined): number => {
  if (!raw) return 0;
  // Tolerate currency symbols, thousands separators, stray quotes.
  const n = parseFloat(raw.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export function parseEtsyListings(csvText: string): ParsedListings {
  const table = parseCsv(csvText);
  const warnings: string[] = [];
  if (table.length < 2) {
    return { rows: [], warnings: ["No data rows found in the file."] };
  }

  const headers = table[0];
  const priceCol = findCol(headers, /price/);
  const titleCol = findCol(headers, /title|name/);
  const skuCol = findCol(headers, /sku/);
  const qtyCol = findCol(headers, /quantit/);

  if (priceCol === -1) {
    warnings.push(
      "No price column detected — every listing will read $0. Check that this is an Etsy listings export.",
    );
  }
  if (titleCol === -1) warnings.push("No title column detected; listings will be unlabeled.");
  if (skuCol === -1) {
    warnings.push("No SKU column detected — per-SKU cost overrides won't match.");
  }

  const rows: ListingRow[] = table.slice(1).map((cols) => ({
    title: titleCol >= 0 ? (cols[titleCol] ?? "").trim() : "",
    sku: skuCol >= 0 ? (cols[skuCol] ?? "").trim() : "",
    price: priceCol >= 0 ? toNumber(cols[priceCol]) : 0,
    quantity: qtyCol >= 0 ? Math.max(1, Math.round(toNumber(cols[qtyCol]))) : 1,
  }));

  return { rows, warnings };
}

// ---------------------------------------------------------------------------
// COGS strategy + globals → per-listing CalculatorInputs
// ---------------------------------------------------------------------------
export type CogsStrategy =
  | { mode: "percent"; percent: number } // fraction of item price, 0..1
  | { mode: "flat"; amount: number }; // flat $ per item

export type AuditGlobals = {
  country: CountryCode;
  offsiteAdsEnabled: boolean;
  atOrAbove10k: boolean;
  // The export rarely carries these, so they're assumed shop-wide defaults.
  shippingCharged: number;
  actualShippingCost: number;
  cogs: CogsStrategy;
  // Optional per-SKU manufacturing cost ($). Wins over the COGS strategy.
  skuCostMap?: Record<string, number>;
};

export function resolveManufacturingCost(row: ListingRow, globals: AuditGlobals): number {
  const override = row.sku ? globals.skuCostMap?.[row.sku] : undefined;
  if (typeof override === "number" && Number.isFinite(override) && override >= 0) {
    return override;
  }
  return globals.cogs.mode === "percent" ? row.price * globals.cogs.percent : globals.cogs.amount;
}

export function toCalculatorInputs(row: ListingRow, globals: AuditGlobals): CalculatorInputs {
  return {
    itemPrice: row.price,
    shippingCharged: globals.shippingCharged,
    manufacturingCost: resolveManufacturingCost(row, globals),
    actualShippingCost: globals.actualShippingCost,
    country: globals.country,
    offsiteAdsEnabled: globals.offsiteAdsEnabled,
    atOrAbove10k: globals.atOrAbove10k,
  };
}

// Parse a pasted/uploaded per-SKU cost map. Accepts "SKU,cost" or "SKU|cost"
// per line; ignores blanks and a header row if present.
export function parseSkuCostMap(text: string): Record<string, number> {
  const map: Record<string, number> = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/[,|\t]/);
    if (parts.length < 2) continue;
    const sku = parts[0].trim();
    const cost = parseFloat(parts[1].replace(/[^0-9.\-]/g, ""));
    if (!sku || !Number.isFinite(cost) || cost < 0) continue;
    map[sku] = cost;
  }
  return map;
}

// ---------------------------------------------------------------------------
// Audit + summary
// ---------------------------------------------------------------------------
export type MarginBand = "loss" | "thin" | "workable" | "healthy";

export function marginBand(result: CalculatorResult): MarginBand {
  if (result.netProfit < 0) return "loss";
  if (result.marginPercent < THIN_MARGIN) return "thin";
  if (result.marginPercent < HEALTHY_MARGIN) return "workable";
  return "healthy";
}

export type AuditedListing = {
  row: ListingRow;
  inputs: CalculatorInputs;
  result: CalculatorResult;
  band: MarginBand;
};

export function auditListings(rows: ListingRow[], globals: AuditGlobals): AuditedListing[] {
  return rows.map((row) => {
    const inputs = toCalculatorInputs(row, globals);
    const result = calculate(inputs);
    return { row, inputs, result, band: marginBand(result) };
  });
}

export type AuditSummary = {
  total: number;
  loss: number;
  thin: number;
  workable: number;
  healthy: number;
  totalNetProfit: number;
  // Worst offenders first — the triage list the headline points at.
  worst: AuditedListing[];
};

export function summarize(audited: AuditedListing[], worstLimit = 10): AuditSummary {
  const counts = { loss: 0, thin: 0, workable: 0, healthy: 0 };
  let totalNetProfit = 0;
  for (const a of audited) {
    counts[a.band] += 1;
    totalNetProfit += a.result.netProfit;
  }
  const worst = [...audited]
    .sort((a, b) => a.result.marginPercent - b.result.marginPercent)
    .slice(0, worstLimit);
  return {
    total: audited.length,
    ...counts,
    totalNetProfit: Math.round(totalNetProfit * 100) / 100,
    worst,
  };
}

// CSV export of audited results — the seller's triage list to act on.
export function auditedToCsv(audited: AuditedListing[]): string {
  const header = [
    "title",
    "sku",
    "item_price",
    "manufacturing_cost",
    "total_fees",
    "net_profit",
    "margin_percent",
    "status",
  ];
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = audited.map((a) =>
    [
      a.row.title,
      a.row.sku,
      a.inputs.itemPrice.toFixed(2),
      a.inputs.manufacturingCost.toFixed(2),
      a.result.totalFees.toFixed(2),
      a.result.netProfit.toFixed(2),
      (a.result.marginPercent * 100).toFixed(1),
      a.band,
    ]
      .map(esc)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}
