import Script from "next/script";

type Variant = "compact" | "card" | "inline";
type Source = "calculator" | "recommendations" | "pseo" | "home" | "pillar";

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
  className?: string;
};

// Gumroad's overlay script. Loading it + tagging the link with `gumroad-button`
// makes the checkout open as a modal over our own page instead of sending the
// buyer to Gumroad's product page in a new tab — one fewer context switch, on a
// domain the buyer already trusts. `id` dedupes the script across the multiple
// CTAs a page may render, so it loads exactly once.
const GUMROAD_OVERLAY_SRC = "https://gumroad.com/js/gumroad.js";

function buildHref(rawUrl: string, source: Source, variant: Variant, content?: string) {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", variant);
    url.searchParams.set("utm_campaign", "pricing-bible");
    if (content) url.searchParams.set("utm_content", content);
    // Skip Gumroad's product/description page and land straight on the payment
    // form. With the overlay this opens the modal already on checkout; without
    // JS (the fallback navigation) it still bypasses the redundant re-sell.
    url.searchParams.set("wanted", "true");
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export function GumroadCta({ variant, source, content, className = "" }: Props) {
  const enabled = process.env.NEXT_PUBLIC_GUMROAD_ENABLED === "1";
  const productUrl = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL;
  const price = process.env.NEXT_PUBLIC_GUMROAD_PRICE || "19";

  if (!enabled || !productUrl) return null;
  const href = buildHref(productUrl, source, variant, content);

  // `target`/`rel` are the no-JS fallback; the overlay intercepts the click.
  const overlay = (
    <Script id="gumroad-overlay-js" src={GUMROAD_OVERLAY_SRC} strategy="afterInteractive" />
  );

  if (variant === "compact") {
    return (
      <>
        {overlay}
        <a
          href={href}
          className={`gumroad-button mt-4 inline-flex items-center gap-2 rounded-lg bg-cream-100 px-3 py-2 text-xs font-medium text-patina-900 ring-1 ring-patina-200/60 transition hover:ring-patina-300 ${className}`}
          target="_blank"
          rel="noopener"
        >
          <span className="rounded bg-patina-700 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            ${price}
          </span>
          Audit your whole shop — find every money-losing listing
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
            className="gumroad-button font-semibold text-patina-700 underline underline-offset-2 hover:text-patina-900"
            target="_blank"
            rel="noopener"
          >
            Get the Etsy Profit Audit — ${price}
          </a>
          . <span className="text-patina-muted">7-day money-back guarantee.</span>
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
          Audit tool + downloads · ${price}
        </span>
        <h2 className="mt-3 text-lg font-bold text-patina-900 sm:text-xl">The Etsy Profit Audit</h2>
        <p className="mt-2 text-sm text-patina-800/85 sm:text-base">
          Upload your Etsy export and see exactly which listings lose money — your whole shop
          audited at once, not one listing at a time. Includes the 2026 Pricing Bible PDF and the
          1,200-scenario Master Pricing Matrix. One-time purchase. The math pays for itself the
          first time it catches a mispriced listing.
        </p>
        <a
          href={href}
          className="gumroad-button mt-4 inline-flex items-center gap-1 rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800"
          target="_blank"
          rel="noopener"
        >
          Get it on Gumroad
          <span aria-hidden="true">→</span>
        </a>
        <p className="mt-3 text-xs text-patina-muted">
          Instant access · 7-day money-back guarantee · secure Gumroad checkout
        </p>
      </section>
    </>
  );
}
