"use client";

import type { CalculatorResult } from "@/lib/fees";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

const pct = (n: number) =>
  `${(n * 100).toFixed(1)}%`;

type Props = {
  result: CalculatorResult;
  itemPrice: number;
};

export function ResultsSummary({ result, itemPrice }: Props) {
  const losing = result.netProfit < 0;
  const tone = losing
    ? "bg-red-50 text-red-900 ring-red-200"
    : result.marginPercent < 0.15
      ? "bg-amber-50 text-amber-900 ring-amber-200"
      : "bg-patina-50 text-patina-900 ring-patina-200";

  return (
    <div className={`rounded-2xl p-6 shadow-sm ring-1 ${tone}`}>
      <p className="text-sm font-medium uppercase tracking-wide opacity-70">
        True Net Profit
      </p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-4xl font-bold tabular-nums sm:text-5xl">
          {usd(result.netProfit)}
        </span>
        <span className="text-xl font-medium tabular-nums opacity-80">
          {pct(result.marginPercent)} margin
        </span>
      </div>
      {losing ? (
        <p className="mt-3 text-sm font-medium">
          You&apos;re losing {usd(Math.abs(result.netProfit))} on every order at this price.
        </p>
      ) : itemPrice > 0 ? (
        <p className="mt-3 text-sm opacity-75">
          Etsy keeps {pct(result.effectiveFeeRate)} of every dollar before you cover product cost.
        </p>
      ) : null}

      <table className="mt-5 w-full text-sm">
        <tbody className="divide-y divide-current/10">
          <tr>
            <td className="py-2 opacity-70">Gross (item + shipping)</td>
            <td className="py-2 text-right font-medium tabular-nums">
              {usd(result.gross)}
            </td>
          </tr>
          {result.fees.map((fee) => (
            <tr key={fee.label}>
              <td className="py-2 opacity-70">
                {fee.label}
                {fee.detail && (
                  <span className="ml-2 text-xs opacity-50">— {fee.detail}</span>
                )}
              </td>
              <td className="py-2 text-right font-medium tabular-nums">
                −{usd(fee.amount)}
              </td>
            </tr>
          ))}
          <tr>
            <td className="py-2 opacity-70">Cost of goods + shipping</td>
            <td className="py-2 text-right font-medium tabular-nums">
              −{usd(result.costOfGoods)}
            </td>
          </tr>
          <tr className="font-semibold">
            <td className="py-2">Net Profit</td>
            <td className="py-2 text-right tabular-nums">
              {usd(result.netProfit)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
