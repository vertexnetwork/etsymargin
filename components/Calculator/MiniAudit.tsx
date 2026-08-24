"use client";

import { useState } from "react";
import { calculate, type CalculatorInputs, type CalculatorResult } from "@/lib/fees";
import { COUNTRY_LIST } from "@/lib/countries";
import { GumroadCta } from "@/components/affiliates/GumroadCta";
import { InputsPanel } from "./InputsPanel";

const MAX_EXTRA_LISTINGS = 2;

const BLANK_LISTING: CalculatorInputs = {
  itemPrice: 25,
  shippingCharged: 5,
  manufacturingCost: 4,
  actualShippingCost: 5,
  country: "US",
  offsiteAdsEnabled: true,
  atOrAbove10k: false,
};

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const pct = (n: number) => `${Math.round(n * 100)}%`;

function rowTone(result: CalculatorResult): string {
  if (result.netProfit < 0) return "bg-red-50 ring-red-200";
  if (result.marginPercent < 0.15) return "bg-amber-50 ring-amber-200";
  return "bg-patina-50 ring-patina-100";
}

// The free middle rung between "check one listing" and "$19 for the whole
// shop" — that jump was too big to convert on (16 clicks, 0 sales). Letting
// someone add 2 more listings, still free, still on-device, gives them a
// taste of the ranked-worst-first view the paid audit does automatically
// across an entire export, before asking for money.
export function MiniAudit({ firstResult }: { firstResult: CalculatorResult }) {
  const [extras, setExtras] = useState<CalculatorInputs[]>([]);

  const addListing = () => {
    if (extras.length >= MAX_EXTRA_LISTINGS) return;
    setExtras((prev) => [...prev, { ...BLANK_LISTING }]);
  };

  const removeExtra = (idx: number) => {
    setExtras((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateExtra = <K extends keyof CalculatorInputs>(
    idx: number,
    key: K,
    value: CalculatorInputs[K],
  ) => {
    setExtras((prev) => prev.map((inp, i) => (i === idx ? { ...inp, [key]: value } : inp)));
  };

  const rows = [
    { label: "This listing", result: firstResult },
    ...extras.map((inputs, i) => ({ label: `Listing ${i + 2}`, result: calculate(inputs) })),
  ].sort((a, b) => a.result.marginPercent - b.result.marginPercent);

  const atMax = extras.length >= MAX_EXTRA_LISTINGS;

  return (
    <div className="mt-5 rounded-xl bg-white/85 p-4 ring-1 ring-patina-200/70">
      <p className="text-sm font-semibold text-patina-900">You just checked one listing.</p>
      <p className="mt-1 text-sm text-patina-800/85">
        Add a couple more free and see them ranked worst-margin-first — the same thing the full
        audit does automatically across your entire shop.
      </p>

      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ring-1 ${rowTone(row.result)}`}
          >
            <span className="font-medium text-patina-900">{row.label}</span>
            <span className="tabular-nums text-patina-800">
              {usd(row.result.netProfit)} ({pct(row.result.marginPercent)} margin)
            </span>
          </div>
        ))}
      </div>

      {extras.map((inputs, i) => (
        <div key={i} className="mt-4 border-t border-patina-100 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-patina-900">Listing {i + 2}</span>
            <button
              type="button"
              onClick={() => removeExtra(i)}
              className="text-xs font-medium text-patina-600 underline underline-offset-2 hover:text-patina-800"
            >
              Remove
            </button>
          </div>
          <InputsPanel
            inputs={inputs}
            countries={COUNTRY_LIST}
            onChange={(key, value) => updateExtra(i, key, value)}
            onCountryChange={(code) => updateExtra(i, "country", code)}
          />
        </div>
      ))}

      {!atMax && (
        <button
          type="button"
          onClick={addListing}
          className="mt-4 inline-flex items-center gap-1 rounded-lg border border-patina-200 bg-transparent px-4 py-2 text-sm font-medium text-patina-700 transition hover:border-patina-300 hover:bg-patina-50"
        >
          + Add another listing free
        </button>
      )}

      {atMax && (
        <div className="mt-5 border-t border-patina-100 pt-4">
          <p className="text-sm font-semibold text-patina-900">
            That&apos;s 3. Your shop probably has 50–200 more.
          </p>
          <p className="mt-1 text-sm text-patina-800/85">
            The audit runs this exact fee math across every listing in your Etsy export at once —
            ranked worst-margin-first, money-losers flagged, no manual typing.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            <GumroadCta variant="button" source="calculator" content="mini-audit-3" />
          </div>
        </div>
      )}
    </div>
  );
}
