"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculate, type CalculatorInputs } from "@/lib/fees";
import { COUNTRY_LIST, type CountryCode } from "@/lib/countries";
import { inputsFromQuery, inputsToQuery, loadDefaults, saveDefaults } from "@/lib/storage";
import { events } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";
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

function readClientOverrides(): Partial<CalculatorInputs> {
  if (typeof window === "undefined") return {};
  try {
    const fromUrl = inputsFromQuery(new URLSearchParams(window.location.search));
    const fromStorage = loadDefaults() ?? {};
    return { ...fromStorage, ...fromUrl };
  } catch {
    return {};
  }
}

export function Calculator({
  initialInputs,
  embedded = false,
}: {
  initialInputs?: Partial<CalculatorInputs>;
  embedded?: boolean;
}) {
  // Lazy initializer: SSR returns base; client merges localStorage + URL on
  // first render so we hydrate with the right values from the start instead
  // of flashing defaults.
  const [inputs, setInputs] = useState<CalculatorInputs>(() => ({
    ...DEFAULT_INPUTS,
    ...initialInputs,
    ...readClientOverrides(),
  }));
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether the user has actually interacted. Until then we leave the
  // URL clean — writing default inputs to the address bar makes a plain
  // visit look polluted (?p=25&s=5&...).
  const userEditedRef = useRef(false);

  useEffect(() => {
    setHydrated(true);
    // Arrived via a shared link with params already on the URL: treat that
    // as "in-scenario" so subsequent edits keep the URL in sync.
    if (typeof window !== "undefined" && window.location.search.length > 1) {
      userEditedRef.current = true;
    }
  }, []);

  // Persist macro defaults whenever inputs change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    saveDefaults(inputs);
  }, [inputs, hydrated]);

  // Keep URL in sync with current inputs (replaceState — no history spam).
  // Skip in embedded mode (mutating the iframe URL surprises the host page)
  // and skip until the user has touched something so a bare visit stays bare.
  useEffect(() => {
    if (!hydrated || embedded) return;
    if (!userEditedRef.current) return;
    const qs = inputsToQuery(inputs);
    const url = `${window.location.pathname}?${qs}`;
    window.history.replaceState(null, "", url);
  }, [inputs, hydrated, embedded]);

  const result = useMemo(() => calculate(inputs), [inputs]);

  const update = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    userEditedRef.current = true;
    if (embedded) return;
    if (key === "offsiteAdsEnabled") events.offsiteAdsToggled(value as boolean);
    if (key === "country") events.countryChanged(value as string);
  };

  // Fire calculator_calculated once per stable input set.
  useEffect(() => {
    if (!hydrated || embedded) return;
    events.calculatorCalculated({
      country: inputs.country,
      offsiteAds: inputs.offsiteAdsEnabled,
      netProfit: result.netProfit,
    });
  }, [hydrated, embedded, inputs.country, inputs.offsiteAdsEnabled, result.netProfit]);

  const onShare = async () => {
    // In embedded mode, point the share URL at the canonical site, not the
    // iframe origin (which is the embedder's page).
    const base = embedded
      ? `${siteConfig.url}/`
      : `${window.location.origin}${window.location.pathname}`;
    const url = `${base}?${inputsToQuery(inputs)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (!embedded) events.shareUrlCopied();
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — silent */
    }
  };

  return (
    <section
      id="calculator"
      className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]"
      suppressHydrationWarning
    >
      <InputsPanel
        inputs={inputs}
        countries={COUNTRY_LIST}
        onChange={update}
        onCountryChange={(code: CountryCode) => update("country", code)}
      />

      <div id="results" className="space-y-6">
        <ResultsSummary result={result} itemPrice={inputs.itemPrice} />
        <WaterfallChart result={result} />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onShare}
            aria-live="polite"
            className="inline-flex min-w-[148px] items-center justify-center rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800 focus:outline-none focus:ring-2 focus:ring-patina-300"
          >
            {copied ? "Link copied" : "Copy share link"}
          </button>
          <span className="text-xs text-patina-muted">
            Bookmark or share this scenario — every input is in the URL.
          </span>
        </div>
      </div>
    </section>
  );
}
