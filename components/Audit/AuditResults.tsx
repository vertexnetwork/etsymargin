"use client";

import { useState } from "react";
import { auditedToCsv, summarize, type AuditedListing, type MarginBand } from "@/lib/etsy-export";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

const BAND_META: Record<MarginBand, { label: string; dot: string; row: string }> = {
  loss: { label: "Losing money", dot: "bg-red-500", row: "bg-red-50/60" },
  thin: { label: "Critically thin", dot: "bg-red-500", row: "" },
  workable: { label: "Workable, tight", dot: "bg-amber-500", row: "" },
  healthy: { label: "Healthy", dot: "bg-patina-600", row: "" },
};

type SortKey = "margin" | "net" | "price";

export function AuditResults({ audited }: { audited: AuditedListing[] }) {
  const [sort, setSort] = useState<SortKey>("margin");
  const summary = summarize(audited, audited.length);

  const sorted = [...audited].sort((a, b) => {
    if (sort === "net") return a.result.netProfit - b.result.netProfit;
    if (sort === "price") return b.inputs.itemPrice - a.inputs.itemPrice;
    return a.result.marginPercent - b.result.marginPercent;
  });

  const onDownload = () => {
    const blob = new Blob([auditedToCsv(sorted)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "etsy-shop-audit.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const atRisk = summary.loss + summary.thin;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-patina-50 p-5 ring-1 ring-patina-200 sm:p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-patina-700">Shop audit</p>
        <p className="mt-1 text-2xl font-bold text-patina-900 sm:text-3xl">
          {summary.loss > 0 ? (
            <>
              <span className="text-red-600">{summary.loss}</span> of {summary.total} listings lose
              money
            </>
          ) : (
            <>{summary.total} listings audited</>
          )}
        </p>
        <p className="mt-1 text-sm text-patina-800/85">
          {atRisk > 0 ? (
            <>
              {atRisk} need attention now (losing or under 15% margin). Net across all listings at
              these assumptions: <strong>{usd(summary.totalNetProfit)}</strong> per unit sold.
            </>
          ) : (
            <>
              No money-losers at these assumptions. Net per unit across the shop:{" "}
              {usd(summary.totalNetProfit)}.
            </>
          )}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
          <Pill band="loss" n={summary.loss} />
          <Pill band="thin" n={summary.thin} />
          <Pill band="workable" n={summary.workable} />
          <Pill band="healthy" n={summary.healthy} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-sm text-patina-800">
          Sort by{" "}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="ml-1 rounded-lg border border-patina-100 bg-cream-50 px-2 py-1 text-sm text-patina-900"
          >
            <option value="margin">Worst margin first</option>
            <option value="net">Lowest net profit</option>
            <option value="price">Highest price</option>
          </select>
        </label>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-1 rounded-lg bg-patina-700 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800"
        >
          Download audit CSV ↓
        </button>
      </div>

      {/* table-fixed + per-column widths so the whole table fits without
          horizontal scrolling: the Listing column flexes and truncates, the
          numbers never wrap, and Price/Fees drop out on phones (Net + Margin +
          Status carry the verdict). overflow-x-auto is only a safety net. */}
      <div className="overflow-x-auto rounded-2xl ring-1 ring-patina-100/80">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-cream-100 text-left text-xs uppercase tracking-wide text-patina-700">
            <tr>
              <th className="px-3 py-2 font-semibold">Listing</th>
              <th className="hidden px-3 py-2 text-right font-semibold sm:table-cell sm:w-[4.5rem]">
                Price
              </th>
              <th className="hidden px-3 py-2 text-right font-semibold sm:table-cell sm:w-20">
                Fees
              </th>
              <th className="w-[5rem] px-3 py-2 text-right font-semibold">Net</th>
              <th className="w-[4.25rem] px-3 py-2 text-right font-semibold">Margin</th>
              <th className="w-[6.5rem] px-3 py-2 font-semibold sm:w-[8rem]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-patina-100/70">
            {sorted.map((a, i) => {
              const meta = BAND_META[a.band];
              return (
                <tr key={`${a.row.sku || a.row.title || "row"}-${i}`} className={meta.row}>
                  <td className="px-3 py-2 text-patina-900">
                    <span className="block truncate">
                      {a.row.title || <span className="text-patina-muted">(untitled)</span>}
                    </span>
                    {a.row.sku && (
                      <span className="block truncate text-xs text-patina-muted">{a.row.sku}</span>
                    )}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-2 text-right tabular-nums sm:table-cell">
                    {usd(a.inputs.itemPrice)}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-2 text-right tabular-nums text-patina-700 sm:table-cell">
                    −{usd(a.result.totalFees)}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-2 text-right font-medium tabular-nums ${
                      a.result.netProfit < 0 ? "text-red-600" : "text-patina-900"
                    }`}
                  >
                    {usd(a.result.netProfit)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                    {pct(a.result.marginPercent)}
                  </td>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                      <span className="truncate">{meta.label}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pill({ band, n }: { band: MarginBand; n: number }) {
  const meta = BAND_META[band];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 ring-1 ring-patina-200/60">
      <span className={`inline-block h-2 w-2 rounded-full ${meta.dot}`} />
      {n} {meta.label}
    </span>
  );
}
