"use client";

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
  key: keyof CalculatorInputs;
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
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-patina-100">
      <h2 className="mb-5 text-lg font-semibold text-patina-900">Your numbers</h2>

      <div className="space-y-4">
        {numericFields.map(({ key, label, hint }) => (
          <label key={key} className="block">
            <span className="text-sm font-medium text-patina-800">{label}</span>
            {hint && (
              <span className="mt-0.5 block text-xs text-patina-700/60">
                {hint}
              </span>
            )}
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-patina-700/60">
                $
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={Number.isFinite(inputs[key] as number) ? (inputs[key] as number) : 0}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onChange(key, (Number.isFinite(v) ? v : 0) as CalculatorInputs[typeof key]);
                }}
                className="w-full rounded-lg border border-patina-100 bg-cream-50 py-2 pl-7 pr-3 text-base text-patina-900 outline-none transition focus:border-patina-400 focus:ring-2 focus:ring-patina-200"
              />
            </div>
          </label>
        ))}

        <label className="block">
          <span className="text-sm font-medium text-patina-800">Shop Country</span>
          <select
            value={inputs.country}
            onChange={(e) => onCountryChange(e.target.value as CountryCode)}
            className="mt-1.5 w-full rounded-lg border border-patina-100 bg-cream-50 px-3 py-2 text-base text-patina-900 outline-none transition focus:border-patina-400 focus:ring-2 focus:ring-patina-200"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="space-y-2.5 rounded-lg bg-cream-100 p-3.5">
          <legend className="text-sm font-medium text-patina-800">
            Off-Site Ads
          </legend>
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
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={inputs.atOrAbove10k}
              onChange={(e) => onChange("atOrAbove10k", e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-patina-600"
            />
            <span className="text-sm text-patina-800">
              My shop has $10k+ in trailing 12-mo revenue (12% rate)
            </span>
          </label>
        </fieldset>
      </div>
    </div>
  );
}
