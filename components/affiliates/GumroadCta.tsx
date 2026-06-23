"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { events } from "@/lib/analytics";

type Variant = "compact" | "card" | "inline" | "button";
type Source = "calculator" | "recommendations" | "pseo" | "home" | "pillar" | "header";

type Props = {
  variant: Variant;
  source: Source;
  /**
   * Optional placement-tier identifier for analytics attribution. Threads
   * through as `utm_content`. Used to differentiate calculator margin tiers
   * (calc-loss / calc-thin / calc-healthy) so we can compare conversion
   * across the cohort that hits each.
   */
  content?: string;
  /** Override the button label (only used by the `button` variant). */
  label?: string;
  className?: string;
};

// Gumroad's overlay script. Loading it + tagging the link with `gumroad-button`
// makes the checkout open as a modal over our own page instead of sending the
// buyer to Gumroad's product page in a new tab — one fewer context switch, on a
// domain the buyer already trusts. `id` dedupes the script across the multiple
// CTAs a page may render, so it loads exactly once.
const GUMROAD_OVERLAY_SRC = "https://gumroad.com/js/gumroad.js";

// --- Founding-price offer (client side) ------------------------------------
// Shape returned by /api/founding-offer. The server owns the truth (live
// sales_count vs the cap); the client just reflects it.
type FoundingOffer = {
  active: boolean;
  remaining: number;
  code: string;
  discountUsd: number;
  discountPct: number;
};

// One fetch per page load, shared across every CTA. Memoizing the promise (not
// just the result) means N simultaneously-mounting CTAs coalesce into a single
// request instead of a thundering herd.
let offerPromise: Promise<FoundingOffer | null> | null = null;
function loadFoundingOffer(): Promise<FoundingOffer | null> {
  if (!offerPromise) {
    offerPromise = fetch("/api/founding-offer")
      .then((r) => (r.ok ? (r.json() as Promise<FoundingOffer>) : null))
      .catch(() => null);
  }
  return offerPromise;
}

function useFoundingOffer(): FoundingOffer | null {
  const [offer, setOffer] = useState<FoundingOffer | null>(null);
  useEffect(() => {
    let alive = true;
    loadFoundingOffer().then((o) => {
      if (alive) setOffer(o);
    });
    return () => {
      alive = false;
    };
  }, []);
  return offer;
}

// "$19" for whole numbers, "$11.97" when a percent-off lands on cents — match
// what Gumroad actually charges rather than rounding to a prettier figure.
function fmtPrice(n: number): string {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

function buildHref(
  rawUrl: string,
  source: Source,
  variant: Variant,
  content?: string,
  offerCode?: string,
) {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", variant);
    url.searchParams.set("utm_campaign", "pricing-bible");
    if (content) url.searchParams.set("utm_content", content);
    // Founding-price code. Gumroad auto-applies a URL `offer_code`, so the
    // overlay opens already discounted. We only attach it while the offer is
    // active (server says spots remain) — once exhausted we drop it in the same
    // render that drops the discounted price, so a buyer never sees a price the
    // checkout won't honor.
    if (offerCode) url.searchParams.set("offer_code", offerCode);
    // NOTE: do NOT add `wanted=true` here. Gumroad's overlay bundle
    // (assets.gumroad.com/js/gumroad-bundle.js) explicitly REFUSES to bind the
    // modal to any link whose href already has `wanted=true` — it just rewrites
    // the href and lets the click navigate away full-page. So `wanted=true` is
    // mutually exclusive with the on-site overlay. We want the overlay, so we
    // leave it off: the script then appends `overlay=true` itself and opens the
    // product in an in-page iframe. The no-JS fallback lands on the product
    // page (one extra click to pay) — an acceptable trade for keeping buyers
    // on our domain.
    return url.toString();
  } catch {
    return rawUrl;
  }
}

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-patina-600)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Inline price: plain when no offer, struck-through original + discounted when
// the founding price is live.
function PriceTag({ full, now }: { full: string; now: string | null }) {
  if (!now) return <>{full}</>;
  return (
    <>
      <s className="opacity-60">{full}</s> {now}
    </>
  );
}

export function GumroadCta({ variant, source, content, label, className = "" }: Props) {
  const enabled = process.env.NEXT_PUBLIC_GUMROAD_ENABLED === "1";
  const productUrl = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL;
  const price = process.env.NEXT_PUBLIC_GUMROAD_PRICE || "19";

  const offer = useFoundingOffer();
  const showOffer = Boolean(offer?.active);

  if (!enabled || !productUrl) return null;

  const offerCode = showOffer ? offer!.code : undefined;
  const href = buildHref(productUrl, source, variant, content, offerCode);

  // Pricing: full vs founding. A flat dollars-off discount (not a percentage)
  // so the displayed price lands on a clean $12 and exactly matches the
  // checkout. fmtPrice still handles cents if the discount ever isn't whole.
  const fullPriceNum = Number(price) || 19;
  const fullPriceStr = `$${price}`;
  const nowPriceStr = showOffer
    ? fmtPrice(Math.max(0, fullPriceNum - (offer!.discountUsd ?? 0)))
    : null;
  // "X left" — no denominator on purpose: it removes the first-buyer tell, so a
  // fresh promo reads identically whether 0 or 9 have sold.
  // Two composable scraps so every variant frames the deal the same way:
  // a percentage (rule of 100 — below $100 "37% off" reads bigger than "$7
  // off") plus denominator-free scarcity ("only X left", no "/37" tell). pctOff
  // is driven by discountPct so it tracks the dashboard even though the coupon
  // is a flat $7.
  const pctOff = showOffer ? `${offer!.discountPct}% off` : null;
  const spotsLeft = showOffer ? `only ${offer!.remaining} left` : null;

  // Purchase-intent signal: fired when the buyer opens the overlay / navigates
  // to checkout. `placement` is the variant so we can compare which surface
  // converts; `tier` carries the content tag (calculator margin band, etc.).
  const track = () => events.auditCtaClicked({ source, placement: variant, tier: content });

  // `target`/`rel` are the no-JS fallback; the overlay intercepts the click.
  const overlay = (
    <Script id="gumroad-overlay-js" src={GUMROAD_OVERLAY_SRC} strategy="afterInteractive" />
  );

  // Bare overlay button for custom layouts (sticky header, homepage offer).
  // The caller owns the surrounding copy; this is just the trigger.
  if (variant === "button") {
    const baseLabel = label ?? `Audit your shop — ${showOffer ? nowPriceStr : fullPriceStr}`;
    return (
      <>
        {overlay}
        <a
          href={href}
          onClick={track}
          className={`gumroad-button inline-flex items-center gap-1 rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800 ${className}`}
          target="_blank"
          rel="noopener"
        >
          {baseLabel}
          <span aria-hidden="true">→</span>
        </a>
        {showOffer && (
          <p className="mt-2 text-xs font-semibold text-patina-700">
            Founding price — {pctOff}{" "}
            <span className="font-normal text-patina-muted">· {spotsLeft}</span>
          </p>
        )}
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        {overlay}
        <a
          href={href}
          onClick={track}
          className={`gumroad-button mt-4 inline-flex items-center gap-2 rounded-lg bg-cream-100 px-3 py-2 text-xs font-medium text-patina-900 ring-1 ring-patina-200/60 transition hover:ring-patina-300 ${className}`}
          target="_blank"
          rel="noopener"
        >
          <span className="rounded bg-patina-700 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            <PriceTag full={fullPriceStr} now={nowPriceStr} />
          </span>
          {showOffer
            ? `Audit your whole shop — ${pctOff}, ${spotsLeft}`
            : "Audit your whole shop — find every money-losing listing"}
          <span aria-hidden="true">→</span>
        </a>
      </>
    );
  }

  if (variant === "inline") {
    return (
      <>
        {overlay}
        <p
          className={`mt-8 rounded-xl bg-cream-100 px-4 py-3 text-sm text-patina-800/90 ring-1 ring-patina-100/80 ${className}`}
        >
          Want to audit your <em>whole</em> shop at once and find every money-losing listing? Plus
          the 2026 Pricing Bible PDF + Master Pricing Matrix.{" "}
          <a
            href={href}
            onClick={track}
            className="gumroad-button font-semibold text-patina-700 underline underline-offset-2 hover:text-patina-900"
            target="_blank"
            rel="noopener"
          >
            Get the Etsy Profit Audit — <PriceTag full={fullPriceStr} now={nowPriceStr} />
          </a>
          .{" "}
          {showOffer ? (
            <span className="font-semibold text-patina-700">
              Founding price — {pctOff}, {spotsLeft}.
            </span>
          ) : (
            <span className="text-patina-muted">7-day money-back guarantee.</span>
          )}
        </p>
      </>
    );
  }

  return (
    <>
      {overlay}
      <section
        className={`quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80 sm:p-6 ${className}`}
      >
        <span className="inline-flex items-center rounded-full bg-lime-cream/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-patina-900 ring-1 ring-patina-200/40">
          Audit tool + downloads · <PriceTag full={fullPriceStr} now={nowPriceStr} />
        </span>
        {showOffer && (
          <span className="ml-2 inline-flex items-center rounded-full bg-patina-700 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            {pctOff} · {spotsLeft}
          </span>
        )}
        <h2 className="mt-3 text-lg font-bold text-patina-900 sm:text-xl">The Etsy Profit Audit</h2>
        <p className="mt-2 text-sm text-patina-800/85 sm:text-base">
          Upload your Etsy export and see exactly which listings lose money — your whole shop
          audited at once, not one listing at a time. The math pays for itself the first time it
          catches a mispriced listing.
        </p>
        {/* Scannable "what you get" — answers the objection right at the button. */}
        <ul className="mt-4 space-y-1.5 text-sm text-patina-800/90">
          <li className="flex gap-2">
            <Check />
            Every listing audited and ranked worst-margin-first
          </li>
          <li className="flex gap-2">
            <Check />
            The 2026 Pricing Bible PDF
          </li>
          <li className="flex gap-2">
            <Check />
            The 1,200-scenario Master Pricing Matrix
          </li>
        </ul>
        <a
          href={href}
          onClick={track}
          className="gumroad-button mt-4 inline-flex items-center gap-1 rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800"
          target="_blank"
          rel="noopener"
        >
          {showOffer ? `Get it for ${nowPriceStr} — founding price` : "Get it on Gumroad"}
          <span aria-hidden="true">→</span>
        </a>
        <p className="mt-3 text-xs text-patina-muted">
          Instant access · works for any shop size · 7-day money-back guarantee · secure Gumroad
          checkout
        </p>
      </section>
    </>
  );
}
