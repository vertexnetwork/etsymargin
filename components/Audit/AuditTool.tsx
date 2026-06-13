"use client";

import { useEffect, useMemo, useState } from "react";
import { COUNTRY_LIST, type CountryCode } from "@/lib/countries";
import {
  auditListings,
  parseEtsyListings,
  parseSkuCostMap,
  type AuditGlobals,
  type ListingRow,
} from "@/lib/etsy-export";
import { AuditResults } from "./AuditResults";

const STORAGE_KEY = "etsymargin:audit:v1";

// Settings persisted between visits (everything except the uploaded file).
type StoredSettings = {
  country: CountryCode;
  offsiteAdsEnabled: boolean;
  atOrAbove10k: boolean;
  shippingCharged: number;
  actualShippingCost: number;
  cogsMode: "percent" | "flat";
  cogsValue: number; // percent as 0..100 when mode=percent, else $ per item
  skuMapText: string;
};

const DEFAULTS: StoredSettings = {
  country: "US",
  offsiteAdsEnabled: true,
  atOrAbove10k: false,
  shippingCharged: 0,
  actualShippingCost: 0,
  cogsMode: "percent",
  cogsValue: 35,
  skuMapText: "",
};

function loadSettings(): StoredSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<StoredSettings>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function AuditTool() {
  const [s, setS] = useState<StoredSettings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const [rows, setRows] = useState<ListingRow[] | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setS(loadSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      /* quota/disabled — silent */
    }
  }, [s, hydrated]);

  const set = <K extends keyof StoredSettings>(key: K, value: StoredSettings[K]) =>
    setS((prev) => ({ ...prev, [key]: value }));

  const onFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseEtsyListings(text);
    setRows(parsed.rows);
    setWarnings(parsed.warnings);
    setFileName(file.name);
  };

  const globals: AuditGlobals = useMemo(
    () => ({
      country: s.country,
      offsiteAdsEnabled: s.offsiteAdsEnabled,
      atOrAbove10k: s.atOrAbove10k,
      shippingCharged: s.shippingCharged,
      actualShippingCost: s.actualShippingCost,
      cogs:
        s.cogsMode === "percent"
          ? { mode: "percent", percent: Math.max(0, s.cogsValue) / 100 }
          : { mode: "flat", amount: Math.max(0, s.cogsValue) },
      skuCostMap: s.skuMapText.trim() ? parseSkuCostMap(s.skuMapText) : undefined,
    }),
    [s],
  );

  const audited = useMemo(
    () => (rows && rows.length ? auditListings(rows, globals) : null),
    [rows, globals],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <div className="space-y-5">
        <div className="quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80 sm:p-6">
          <h2 className="text-lg font-semibold text-patina-900">1. Upload your Etsy export</h2>
          <p className="mt-1 text-sm text-patina-muted">
            Shop Manager → Settings → Options → Download Data → currently-for-sale listings. The
            file is read in your browser — it never leaves your device.
          </p>
          <label className="mt-3 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-patina-200 bg-cream-50 px-4 py-6 text-center text-sm text-patina-700 transition hover:border-patina-400">
            <input
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onFile(f);
              }}
            />
            {fileName ? (
              <span>
                <strong>{fileName}</strong> — {rows?.length ?? 0} listings. Click to replace.
              </span>
            ) : (
              <span>Click to choose your listings CSV</span>
            )}
          </label>
          {warnings.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-amber-200">
              {warnings.map((w) => (
                <li key={w}>⚠️ {w}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80 sm:p-6">
          <h2 className="text-lg font-semibold text-patina-900">2. Shop settings</h2>
          <p className="mt-1 text-sm text-patina-muted">
            The export doesn&apos;t include these — set them once for the whole shop.
          </p>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-patina-800">Shop country</span>
            <select
              value={s.country}
              onChange={(e) => set("country", e.target.value as CountryCode)}
              className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-patina-100 bg-cream-50 px-3 py-2 text-base text-patina-900 outline-none transition focus:border-patina-400 focus:ring-2 focus:ring-patina-200"
            >
              {COUNTRY_LIST.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <NumField
              label="Avg shipping charged"
              value={s.shippingCharged}
              onChange={(v) => set("shippingCharged", v)}
            />
            <NumField
              label="Avg actual shipping cost"
              value={s.actualShippingCost}
              onChange={(v) => set("actualShippingCost", v)}
            />
          </div>

          <div className="mt-4 space-y-2.5 rounded-lg bg-cream-100 p-3.5">
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={s.offsiteAdsEnabled}
                onChange={(e) => set("offsiteAdsEnabled", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-patina-600"
              />
              <span className="text-sm text-patina-800">Include Off-Site Ads fee</span>
            </label>
            {s.offsiteAdsEnabled && (
              <label className="flex cursor-pointer items-start gap-2.5 pl-6">
                <input
                  type="checkbox"
                  checked={s.atOrAbove10k}
                  onChange={(e) => set("atOrAbove10k", e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-patina-600"
                />
                <span className="text-sm text-patina-800">$10k+ trailing revenue (12% rate)</span>
              </label>
            )}
          </div>
        </div>

        <div className="quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80 sm:p-6">
          <h2 className="text-lg font-semibold text-patina-900">3. Product cost</h2>
          <p className="mt-1 text-sm text-patina-muted">
            The export has no cost data. Start with a shop-wide estimate, then refine the listings
            that matter with exact per-SKU costs.
          </p>

          <div className="mt-3 flex gap-2">
            <SegBtn
              active={s.cogsMode === "percent"}
              onClick={() => set("cogsMode", "percent")}
              label="% of price"
            />
            <SegBtn
              active={s.cogsMode === "flat"}
              onClick={() => set("cogsMode", "flat")}
              label="Flat $ / item"
            />
          </div>
          <div className="mt-3">
            <NumField
              label={s.cogsMode === "percent" ? "Cost as % of price" : "Cost per item ($)"}
              value={s.cogsValue}
              onChange={(v) => set("cogsValue", v)}
              suffix={s.cogsMode === "percent" ? "%" : undefined}
            />
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-patina-700">
              Per-SKU costs (optional, more accurate)
            </summary>
            <p className="mt-2 text-xs text-patina-muted">
              One per line: <code>SKU,cost</code>. Overrides the estimate above for matching SKUs.
            </p>
            <textarea
              value={s.skuMapText}
              onChange={(e) => set("skuMapText", e.target.value)}
              rows={4}
              placeholder={"MUG-11OZ,3.20\nTEE-BLK-L,8.75"}
              className="mt-2 block w-full rounded-lg border border-patina-100 bg-cream-50 px-3 py-2 font-mono text-xs text-patina-900 outline-none focus:border-patina-400 focus:ring-2 focus:ring-patina-200"
            />
          </details>
        </div>
      </div>

      <div>
        {audited ? (
          <AuditResults audited={audited} />
        ) : (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-patina-200 p-8 text-center text-patina-muted">
            Upload your listings export to see which ones are losing money.
          </div>
        )}
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-patina-800">{label}</span>
      <div className="relative mt-1.5">
        {!suffix && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-patina-muted">
            $
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={Number.isFinite(value) ? String(value) : ""}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
              const n = parseFloat(raw);
              onChange(Number.isFinite(n) && n >= 0 ? n : 0);
            }
          }}
          className={`block min-h-[44px] w-full rounded-lg border border-patina-100 bg-cream-50 py-2 text-base text-patina-900 outline-none transition focus:border-patina-400 focus:ring-2 focus:ring-patina-200 ${
            suffix ? "px-3" : "pl-7 pr-3"
          }`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-patina-muted">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function SegBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-patina-700 text-white shadow-sm"
          : "bg-cream-100 text-patina-700 ring-1 ring-patina-200/60 hover:ring-patina-300"
      }`}
    >
      {label}
    </button>
  );
}
