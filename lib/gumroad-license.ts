// Gumroad license verification — split into a pure evaluator (unit-testable
// without network) and a thin fetch wrapper. The verify endpoint needs no
// OAuth: just product_id + license_key.  Docs: gumroad.com/help/article/76.

const VERIFY_ENDPOINT = "https://api.gumroad.com/v2/licenses/verify";

export type GumroadPurchase = {
  refunded?: boolean;
  chargebacked?: boolean;
  disputed?: boolean;
  email?: string;
  [key: string]: unknown;
};

export type GumroadVerifyResponse = {
  success?: boolean;
  // Incremented on every verify call (unless increment_uses_count=false). We
  // use it as a cheap sharing signal — past the cap, refuse the unlock.
  uses?: number;
  purchase?: GumroadPurchase;
  message?: string;
};

export type LicenseEvaluation = { ok: true } | { ok: false; reason: string };

// Pure decision: given Gumroad's response and our uses cap, may this buyer in?
// Order matters — a refund/dispute disqualifies regardless of uses count.
export function evaluateLicense(
  data: GumroadVerifyResponse | null | undefined,
  usesCap: number,
): LicenseEvaluation {
  if (!data || !data.success) return { ok: false, reason: "invalid" };
  const p = data.purchase ?? {};
  if (p.refunded) return { ok: false, reason: "refunded" };
  if (p.chargebacked) return { ok: false, reason: "chargebacked" };
  if (p.disputed) return { ok: false, reason: "disputed" };
  if (typeof data.uses === "number" && usesCap > 0 && data.uses > usesCap) {
    return { ok: false, reason: "uses_exceeded" };
  }
  return { ok: true };
}

// Calls Gumroad's verify API. fetchImpl is injectable for tests. Returns null
// on transport/parse failure so the caller can fail closed.
export async function verifyLicenseWithGumroad(
  licenseKey: string,
  productId: string,
  fetchImpl: typeof fetch = fetch,
): Promise<GumroadVerifyResponse | null> {
  try {
    const res = await fetchImpl(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        product_id: productId,
        license_key: licenseKey,
        increment_uses_count: "true",
      }),
    });
    // Gumroad returns 404 with { success:false } for an unknown key — that's a
    // valid "no" answer, so parse the body regardless of status.
    return (await res.json()) as GumroadVerifyResponse;
  } catch {
    return null;
  }
}
