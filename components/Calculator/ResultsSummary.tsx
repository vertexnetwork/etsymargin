"use client";

import type { CalculatorInputs, CalculatorResult } from "@/lib/fees";
import { NextBestAction } from "./NextBestAction";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

const pct = (n: number) => {
  const v = n * 100;
  // Sub-1% margins (especially negative ones near zero) round to "0.0%" and
  // read like a UI bug next to a clearly-negative dollar amount. Bump to
  // two decimals when |v| < 1 so the loss is honestly shown.
  return `${Math.abs(v) < 1 ? v.toFixed(2) : v.toFixed(1)}%`;
};

type Props = {
  result: CalculatorResult;
  inputs: CalculatorInputs;
  category?: string;
};

// Verbal status that mirrors the color band. Bands are recalibrated to Etsy
// reality: a 15–30% net margin is "workable, but tight" (not healthy), and the
// healthy line only starts at 30%. The label gives the color a voice so the
// diagnosis doesn't depend on a user reading hue alone.
function profitStatus(result: CalculatorResult): { label: string; dot: string } {
  if (result.netProfit < 0) return { label: "Losing money on this order", dot: "bg-red-500" };
  const m = result.marginPercent;
  if (m < 0.15) return { label: "Critically thin margin", dot: "bg-red-500" };
  if (m < 0.3) return { label: "Workable, but tight", dot: "bg-amber-500" };
  return { label: "Healthy margin", dot: "bg-patina-600" };
}

export function ResultsSummary({ result, inputs, category }: Props) {
  const losing = result.netProfit < 0;
  const tone = losing
    ? "bg-red-50 text-red-900 ring-red-200"
    : result.marginPercent < 0.3
      ? "bg-amber-50 text-amber-900 ring-amber-200"
      : "bg-patina-50 text-patina-900 ring-patina-200";
  const status = profitStatus(result);

  return (
    <div className={`rounded-2xl p-5 shadow-sm ring-1 sm:p-6 ${tone}`}>
      <p className="text-sm font-medium uppercase tracking-wide opacity-80">True Net Profit</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-4xl font-bold tabular-nums sm:text-5xl">{usd(result.netProfit)}</span>
        <span className="text-xl font-medium tabular-nums opacity-80">
          {pct(result.marginPercent)} margin
        </span>
      </div>
      <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
        <span
          aria-hidden="true"
          className={`inline-block h-2.5 w-2.5 rounded-full ${status.dot}`}
        />
        {status.label}
      </p>
      <NextBestAction result={result} inputs={inputs} category={category} />

      <table className="mt-5 w-full text-sm">
        <tbody className="divide-y divide-current/10">
          <tr>
            <td className="py-2 opacity-80">Gross (item + shipping)</td>
            <td className="py-2 text-right font-medium tabular-nums">{usd(result.gross)}</td>
          </tr>
          {result.fees.map((fee) => (
            <tr key={fee.label}>
              <td className="py-2 opacity-80">
                {fee.label}
                {fee.detail && <span className="ml-2 text-xs opacity-75">— {fee.detail}</span>}
              </td>
              <td className="py-2 text-right font-medium tabular-nums">−{usd(fee.amount)}</td>
            </tr>
          ))}
          <tr>
            <td className="py-2 opacity-80">Cost of goods + shipping</td>
            <td className="py-2 text-right font-medium tabular-nums">−{usd(result.costOfGoods)}</td>
          </tr>
          <tr className="font-semibold">
            <td className="py-2">Net Profit</td>
            <td className="py-2 text-right tabular-nums">{usd(result.netProfit)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
