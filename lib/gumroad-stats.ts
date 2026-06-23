// Founding-price launch promo. One source of truth: the product's live
// sales_count from Gumroad's API drives the public "X left" counter, the
// struck-through price, AND whether we attach the `offer_code` to checkout
// links. Tying all three to the same number means buyers never see a discount
// on our page that the checkout then refuses (an exhausted code) — when the
// cap is hit, the counter, the price, and the code all drop together.
//
// Server-only: imports serverConfig (which reads non-public env). Never import
// from a client component — reach it through /api/founding-offer instead.

import { serverConfig } from "@/lib/server-config";

// The Gumroad offer code is "FOUNDER", 37% off, capped at 37 uses (configured
// in the Gumroad dashboard — Gumroad enforces the real cap; these constants
// just mirror it so our UI matches). Keep CODE/CAP/PCT in sync with the
// dashboard if any of them change.
export const FOUNDER_CODE = "FOUNDER";
export const FOUNDER_CAP = 37;
// The coupon is a FLAT $7 off (not a percentage), so $19 → a clean $12.00 at
// checkout instead of the $11.97 a 37% code would produce. We still *advertise*
// it as "37% off" because below $100 a percentage reads bigger than the dollar
// figure (rule of 100: 37 > 7) — and $7/$19 = 36.8%, so 37% is honest. The
// displayed price is computed from discountUsd so the page always matches the
// charge; discountPct is label-only. Keep both in sync with the Gumroad coupon.
export const FOUNDER_DISCOUNT_USD = 7;
export const FOUNDER_DISCOUNT_PCT = 37;

export type FoundingOffer = {
  /** True → attach `offer_code` and show the discounted price. */
  active: boolean;
  /** Spots left at the founding price. Only meaningful when active. */
  remaining: number;
  code: string;
  /** Flat dollars off — drives the displayed price (matches the checkout). */
  discountUsd: number;
  /** Label only — what we advertise ("37% off"). Not used for the math. */
  discountPct: number;
};

const PRODUCT_ENDPOINT = "https://api.gumroad.com/v2/products";

// Live total sales for the product, or null if we can't read it (no token, API
// error). sales_count counts ALL sales, not just code redemptions — at launch
// essentially every sale comes through our funnel with the code, and once we
// pass the cap we want to stop regardless, so it's the right number to gate on.
export async function fetchSalesCount(
  fetchImpl: typeof fetch = fetch,
): Promise<number | null> {
  const id = serverConfig.gumroadProductId;
  const token = serverConfig.gumroadAccessToken;
  if (!id || !token) return null;
  try {
    const url = `${PRODUCT_ENDPOINT}/${encodeURIComponent(id)}?access_token=${encodeURIComponent(token)}`;
    // Cache the upstream call for 5 min so the counter is live-ish without
    // hitting Gumroad on every page view.
    const res = await fetchImpl(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { success?: boolean; product?: { sales_count?: number } };
    const n = data?.product?.sales_count;
    return typeof n === "number" ? n : null;
  } catch {
    return null;
  }
}

// Pure decision (unit-testable). Fail CLOSED: if the count is unknown we show
// full price rather than advertise a discount we can't bound — that keeps the
// promise on our page honest with whatever the checkout actually charges.
export function computeFoundingOffer(salesCount: number | null): FoundingOffer {
  const base = {
    code: FOUNDER_CODE,
    discountUsd: FOUNDER_DISCOUNT_USD,
    discountPct: FOUNDER_DISCOUNT_PCT,
  };
  if (salesCount === null) {
    return { active: false, remaining: 0, ...base };
  }
  const remaining = Math.max(0, FOUNDER_CAP - salesCount);
  return { active: remaining > 0, remaining, ...base };
}

export async function getFoundingOffer(): Promise<FoundingOffer> {
  return computeFoundingOffer(await fetchSalesCount());
}
