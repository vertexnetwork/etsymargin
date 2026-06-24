import type { AffiliatePartner } from "@/lib/affiliates/partners";

type Props = {
  partner: AffiliatePartner;
  source: string;
  /** Per-page campaign tag (the pSEO slug) for affiliate-side attribution. */
  campaign: string;
  className?: string;
};

function buildHref(rawUrl: string, source: string, campaign: string) {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", "card");
    url.searchParams.set("utm_campaign", campaign);
    return url.toString();
  } catch {
    // Some affiliate redirect links aren't valid absolute URLs to the parser;
    // fall back to the raw link rather than dropping the card entirely.
    return rawUrl;
  }
}

// Generic, data-driven affiliate card for the pSEO bottom slot. Mirrors
// PrintifyCard's "card" variant so a CustomCat/Gelato card sits at the same
// visual weight as Printify on the pages it doesn't cover. Copy + URL come from
// the partner registry (lib/affiliates/partners.ts); this is just the chrome.
export function AffiliateCard({ partner, source, campaign, className = "" }: Props) {
  // Defensive: the registry already filters out link-less partners, but guard
  // here too so a pending partner can never render a dead button.
  if (!partner.affiliateUrl) return null;
  const href = buildHref(partner.affiliateUrl, source, campaign);

  return (
    <section className={`quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80 sm:p-6 ${className}`}>
      <span className="inline-flex items-center rounded-full bg-lime-cream/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-patina-900 ring-1 ring-patina-200/40">
        {partner.eyebrow}
      </span>
      <h2 className="mt-3 text-lg font-bold text-patina-900 sm:text-xl">{partner.headline}</h2>
      <p className="mt-2 text-sm text-patina-800/85 sm:text-base">{partner.body}</p>
      {partner.offer && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-lime-cream/60 px-3 py-2 text-sm font-medium text-patina-900 ring-1 ring-patina-200/50">
          <span className="mt-px shrink-0 rounded bg-patina-700 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            Offer
          </span>
          <span>{partner.offer}</span>
        </p>
      )}
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener"
        className="mt-4 inline-flex items-center gap-1 rounded-lg bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-patina-800"
      >
        {partner.cta}
        <span aria-hidden="true">→</span>
      </a>
      <p className="mt-3 text-[11px] text-patina-muted">
        Affiliate link — we earn a commission at no extra cost to you.
      </p>
    </section>
  );
}
