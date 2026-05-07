import type { CalculatorInputs } from "./fees";
import type { CountryCode } from "./countries";

const KEY = "etsymargin:v1";
const CURRENT_VERSION = 1;

type StoredDefaults = Partial<CalculatorInputs>;

type StoredPayloadV1 = {
  version: 1;
  defaults: StoredDefaults;
};

// Legacy (pre-version) payloads were the raw defaults map. Treat any
// versionless object as v0 so returning visitors don't get reset.
function migrate(raw: unknown): StoredDefaults | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.version !== "number") {
    return obj as StoredDefaults;
  }
  switch (obj.version) {
    case 1:
      return (obj.defaults as StoredDefaults) ?? null;
    default:
      return null;
  }
}

export function loadDefaults(): StoredDefaults | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return migrate(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveDefaults(inputs: CalculatorInputs) {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredPayloadV1 = {
      version: CURRENT_VERSION,
      defaults: {
        country: inputs.country,
        offsiteAdsEnabled: inputs.offsiteAdsEnabled,
        atOrAbove10k: inputs.atOrAbove10k,
      },
    };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* quota or disabled — silent */
  }
}

const URL_KEYS = {
  itemPrice: "p",
  shippingCharged: "s",
  manufacturingCost: "m",
  actualShippingCost: "as",
  country: "c",
  offsiteAdsEnabled: "ads",
  atOrAbove10k: "t10",
} as const;

export function inputsToQuery(inputs: CalculatorInputs): string {
  const params = new URLSearchParams();
  params.set(URL_KEYS.itemPrice, String(inputs.itemPrice));
  params.set(URL_KEYS.shippingCharged, String(inputs.shippingCharged));
  params.set(URL_KEYS.manufacturingCost, String(inputs.manufacturingCost));
  params.set(URL_KEYS.actualShippingCost, String(inputs.actualShippingCost));
  params.set(URL_KEYS.country, inputs.country);
  params.set(URL_KEYS.offsiteAdsEnabled, inputs.offsiteAdsEnabled ? "1" : "0");
  params.set(URL_KEYS.atOrAbove10k, inputs.atOrAbove10k ? "1" : "0");
  return params.toString();
}

const VALID_COUNTRIES: CountryCode[] = ["US", "UK", "CA", "AU", "EU"];

export function inputsFromQuery(
  search: URLSearchParams,
): Partial<CalculatorInputs> {
  const out: Partial<CalculatorInputs> = {};
  const num = (k: string) => {
    const v = search.get(k);
    if (v === null) return undefined;
    const n = parseFloat(v);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  const ip = num(URL_KEYS.itemPrice);
  if (ip !== undefined) out.itemPrice = ip;
  const sh = num(URL_KEYS.shippingCharged);
  if (sh !== undefined) out.shippingCharged = sh;
  const mc = num(URL_KEYS.manufacturingCost);
  if (mc !== undefined) out.manufacturingCost = mc;
  const asc = num(URL_KEYS.actualShippingCost);
  if (asc !== undefined) out.actualShippingCost = asc;
  const c = search.get(URL_KEYS.country);
  if (c && (VALID_COUNTRIES as string[]).includes(c)) out.country = c as CountryCode;
  const ads = search.get(URL_KEYS.offsiteAdsEnabled);
  if (ads === "1") out.offsiteAdsEnabled = true;
  if (ads === "0") out.offsiteAdsEnabled = false;
  const t10 = search.get(URL_KEYS.atOrAbove10k);
  if (t10 === "1") out.atOrAbove10k = true;
  if (t10 === "0") out.atOrAbove10k = false;
  return out;
}
