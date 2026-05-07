"use client";

import { useEffect, useState } from "react";
import type { CalculatorInputs } from "@/lib/fees";
import type { Country, CountryCode } from "@/lib/countries";

type Props = {
  inputs: CalculatorInputs;
  countries: Country[];
  onChange: <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => void;
  onCountryChange: (code: CountryCode) => void;
};

const numericFields: Array<{
  key: "itemPrice" | "shippingCharged" | "manufacturingCost" | "actualShippingCost";
  label: string;
  hint?: string;
}> = [
  { key: "itemPrice", label: "Item Sale Price", hint: "What the buyer pays for the item" },
  { key: "shippingCharged", label: "Shipping Charged to Buyer" },
  { key: "manufacturingCost", label: "Product / Manufacturing Cost" },
  { key: "actualShippingCost", label: "Actual Shipping Cost" },
];

export function InputsPanel({
  inputs,
  countries,
  onChange,
  onCountryChange,
}: Props) {
  return (
    <div className="quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80 sm:p-6">
      <h2 className="mb-5 text-lg font-semibold text-patina-900">Your numbers</h2>

      <div className="space-y-4">
        {numericFields.map(({ key, label, hint }) => (
          <NumericField
            key={key}
            id={`field-${key}`}
            label={label}
            hint={hint}
            value={inputs[key] as number}
            onChange={(v) => onChange(key, v as CalculatorInputs[typeof key])}
          />
        ))}

        <label className="block">
          <span className="text-sm font-medium text-patina-800">Shop Country</span>
          <select
            value={inputs.country}
            onChange={(e) => onCountryChange(e.target.value as CountryCode)}
            className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-patina-100 bg-cream-50 px-3 py-2 text-base text-patina-900 outline-none transition focus:border-patina-400 focus:ring-2 focus:ring-patina-200"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-patina-muted">
            All math runs in USD. Country drives Etsy&apos;s payment-processing
            and regulatory fees.
          </span>
        </label>

        <div
          role="group"
          aria-labelledby="ads-group-label"
          className="space-y-2.5 rounded-lg bg-cream-100 p-3.5"
        >
          <p
            id="ads-group-label"
            className="text-sm font-medium text-patina-800"
          >
            Off-Site Ads
          </p>
          <p id="ads-10k-help" className="text-xs text-patina-muted">
            Etsy charges 15% under $10k trailing revenue (opt-in) or 12% at/above
            (mandatory).
          </p>
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={inputs.offsiteAdsEnabled}
              onChange={(e) => onChange("offsiteAdsEnabled", e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-patina-600"
            />
            <span className="text-sm text-patina-800">
              Include Off-Site Ads fee on this order
            </span>
          </label>
          {inputs.offsiteAdsEnabled && (
            <label className="flex cursor-pointer items-start gap-2.5 pl-6">
              <input
                type="checkbox"
                checked={inputs.atOrAbove10k}
                onChange={(e) => onChange("atOrAbove10k", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-patina-600"
                aria-describedby="ads-10k-help"
              />
              <span className="text-sm text-patina-800">
                My shop has $10k+ in trailing 12-mo revenue (12% rate)
              </span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

function NumericField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  // Local string state lets the user clear/type without fighting a coerced 0.
  // Sync external value changes (e.g. URL hydration, prefilled scenario swap)
  // into the local string when not focused.
  const [text, setText] = useState<string>(formatForInput(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(formatForInput(value));
  }, [value, focused]);

  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-medium text-patina-800">{label}</span>
      {hint && (
        <span className="mt-0.5 block text-xs text-patina-muted">{hint}</span>
      )}
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-patina-muted">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          onFocus={(e) => {
            setFocused(true);
            e.target.select();
          }}
          onBlur={() => {
            setFocused(false);
            const n = parseFloat(text);
            const safe = Number.isFinite(n) && n >= 0 ? n : 0;
            setText(formatForInput(safe));
            onChange(safe);
          }}
          onChange={(e) => {
            const raw = e.target.value;
            // Allow empty or partial decimals during typing.
            if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
              setText(raw);
              const n = parseFloat(raw);
              if (Number.isFinite(n) && n >= 0) onChange(n);
              else if (raw === "") onChange(0);
            }
          }}
          className="block min-h-[44px] w-full rounded-lg border border-patina-100 bg-cream-50 py-2 pl-7 pr-3 text-base text-patina-900 outline-none transition focus:border-patina-400 focus:ring-2 focus:ring-patina-200"
        />
      </div>
    </label>
  );
}

function formatForInput(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (n === 0) return "0";
  // Drop trailing zeros so prefilled "5.00" reads as "5".
  return String(Math.round(n * 100) / 100);
}
