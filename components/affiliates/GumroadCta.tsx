type Variant = "compact" | "card" | "inline";
type Source = "calculator" | "recommendations" | "pseo";

type Props = {
  variant: Variant;
  source: Source;
  className?: string;
};

function buildHref(rawUrl: string, source: Source, variant: Variant) {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", variant);
    url.searchParams.set("utm_campaign", "pricing-bible");
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export function GumroadCta({ variant, source, className = "" }: Props) {
  const enabled = process.env.NEXT_PUBLIC_GUMROAD_ENABLED === "1";
  const productUrl = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL;
  const price = process.env.NEXT_PUBLIC_GUMROAD_PRICE || "9";

  if (!enabled || !productUrl) return null;
  const href = buildHref(productUrl, source, variant);

  if (variant === "compact") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className={`mt-4 inline-flex items-center gap-2 rounded-lg bg-cream-100 px-3 py-2 text-xs font-medium text-patina-900 ring-1 ring-patina-200/60 transition hover:ring-patina-300 ${className}`}
      >
        <span className="rounded bg-patina-700 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          ${price}
        </span>
        Get every fee scenario pre-modeled — Etsy Pricing Bible
        <span aria-hidden="true">→</span>
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <p
        className={`mt-8 rounded-xl bg-cream-100 px-4 py-3 text-sm text-patina-800/90 ring-1 ring-patina-100/80 ${className}`}
      >
        Want every Etsy fee scenario pre-modeled in one PDF + spreadsheet?{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="font-semibold text-patina-700 underline underline-offset-2 hover:text-patina-900"
        >
          Get the 2026 Etsy Pricing Bible — ${price}
        </a>
        .
      </p>
    );
  }

  return (
    <section
      className={`quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80 sm:p-6 ${className}`}
    >
      <span className="inline-flex items-center rounded-full bg-lime-cream/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-patina-900 ring-1 ring-patina-200/40">
        Digital download · ${price}
      </span>
      <h2 className="mt-3 text-lg font-bold text-patina-900 sm:text-xl">
        The 2026 Etsy Pricing Bible
      </h2>
      <p className="mt-2 text-sm text-patina-800/85 sm:text-base">
        Every fee scenario pre-modeled in one PDF and spreadsheet — by category,
        by country, with the offsite-ads tipping point flagged for each. One-time
        purchase. Instant download.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="mt-4 inline-flex items-center gap-1 rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800"
      >
        Get it on Gumroad
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
