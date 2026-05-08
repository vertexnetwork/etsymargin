const AFFILIATE_URL = "https://try.printify.com/j8xm11chwojf";

type Source = "recommendations" | "pseo" | "embed";

type Props = {
  source: Source;
  campaign?: string;
  className?: string;
  variant?: "card" | "inline";
};

function buildHref(source: Source, campaign: string) {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: "card",
    utm_campaign: campaign,
  });
  return `${AFFILIATE_URL}?${params.toString()}`;
}

export function PrintifyCard({
  source,
  campaign = "printify",
  className = "",
  variant = "card",
}: Props) {
  const href = buildHref(source, campaign);
  const headline =
    variant === "inline"
      ? "Cut manufacturing cost with print-on-demand"
      : "Lower your manufacturing cost with Printify";
  const body =
    variant === "inline"
      ? "If your waterfall above shows manufacturing eating most of the gross, Printify's per-unit pricing on POD apparel, mugs, and accessories often runs 15–30% under the typical Etsy seller's blended cost."
      : "If manufacturing cost is what's eating your margin in the waterfall above, Printify is the cheapest entry point we've seen for POD apparel, mugs, and accessories. Free to start, per-unit pricing visible up front.";

  return (
    <section
      className={`quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80 sm:p-6 ${className}`}
    >
      <span className="inline-flex items-center rounded-full bg-lime-cream/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-patina-900 ring-1 ring-patina-200/40">
        Recommended · Print-on-demand
      </span>
      <h2 className="mt-3 text-lg font-bold text-patina-900 sm:text-xl">
        {headline}
      </h2>
      <p className="mt-2 text-sm text-patina-800/85 sm:text-base">{body}</p>
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener"
        className="mt-4 inline-flex items-center gap-1 rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800"
      >
        See Printify pricing
        <span aria-hidden="true">→</span>
      </a>
      <p className="mt-3 text-[11px] text-patina-muted">
        Affiliate link — we earn a commission at no extra cost to you.
      </p>
    </section>
  );
}
