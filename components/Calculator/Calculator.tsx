"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculate, type CalculatorInputs } from "@/lib/fees";
import { COUNTRY_LIST, type CountryCode } from "@/lib/countries";
import {
  inputsFromQuery,
  inputsToQuery,
  loadDefaults,
  saveDefaults,
} from "@/lib/storage";
import { events } from "@/lib/analytics";
import { InputsPanel } from "./InputsPanel";
import { ResultsSummary } from "./ResultsSummary";
import { WaterfallChart } from "./WaterfallChart";

const DEFAULT_INPUTS: CalculatorInputs = {
  itemPrice: 25,
  shippingCharged: 5,
  manufacturingCost: 4,
  actualShippingCost: 5,
  country: "US",
  offsiteAdsEnabled: true,
  atOrAbove10k: false,
};

export function Calculator({
  initialInputs,
}: {
  initialInputs?: Partial<CalculatorInputs>;
}) {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    ...DEFAULT_INPUTS,
    ...initialInputs,
  });
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from URL > localStorage > defaults, once on mount.
  useEffect(() => {
    const fromUrl = inputsFromQuery(
      new URLSearchParams(window.location.search),
    );
    const fromStorage = loadDefaults() ?? {};
    setInputs((prev) => ({ ...prev, ...fromStorage, ...fromUrl }));
    setHydrated(true);
  }, []);

  // Persist macro defaults whenever inputs change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    saveDefaults(inputs);
  }, [inputs, hydrated]);

  // Keep URL in sync with current inputs (replaceState — no history spam).
  useEffect(() => {
    if (!hydrated) return;
    const qs = inputsToQuery(inputs);
    const url = `${window.location.pathname}?${qs}`;
    window.history.replaceState(null, "", url);
  }, [inputs, hydrated]);

  const result = useMemo(() => calculate(inputs), [inputs]);

  const update = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    if (key === "offsiteAdsEnabled") events.offsiteAdsToggled(value as boolean);
    if (key === "country") events.countryChanged(value as string);
  };

  // Fire calculator_calculated once per stable input set (debounced via effect coalescing).
  useEffect(() => {
    if (!hydrated) return;
    events.calculatorCalculated({
      country: inputs.country,
      offsiteAds: inputs.offsiteAdsEnabled,
      netProfit: result.netProfit,
    });
  }, [hydrated, inputs.country, inputs.offsiteAdsEnabled, result.netProfit]);

  const onShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?${inputsToQuery(inputs)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      events.shareUrlCopied();
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — silent */
    }
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <InputsPanel
        inputs={inputs}
        countries={COUNTRY_LIST}
        onChange={update}
        onCountryChange={(code: CountryCode) => update("country", code)}
      />

      <div className="space-y-6">
        <ResultsSummary result={result} itemPrice={inputs.itemPrice} />
        <WaterfallChart result={result} />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onShare}
            className="rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800 focus:outline-none focus:ring-2 focus:ring-patina-300"
          >
            {copied ? "Link copied ✓" : "Copy share link"}
          </button>
          <span className="text-xs text-patina-700/60">
            Bookmark or share this scenario — every input is in the URL.
          </span>
        </div>
      </div>
    </section>
  );
}
