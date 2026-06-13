import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { VertexFooterLink } from "@/components/analytics/VertexFooterLink";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { company, legal } = siteConfig.nav.footer;
  // Drop the audit landing link until the feature flag is on (page 404s otherwise).
  const product = siteConfig.nav.footer.product.filter(
    (l) => siteConfig.features.audit.enabled || l.href !== "/etsy-shop-audit",
  );
  const showAffiliateDisclosure = siteConfig.features.affiliate.enabled;

  return (
    <footer className="mt-12 border-t border-(--color-border) bg-(--color-surface)/40 sm:mt-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-6 px-5 pb-5 pt-8 sm:grid-cols-4 sm:gap-8 sm:pb-6 sm:pt-10">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="text-(--color-on-bg)">
            <Wordmark size={22} />
          </Link>
          <p className="mt-2 max-w-xs text-sm text-(--color-muted) sm:mt-3">
            {siteConfig.tagline} 2026 fee schedule, math runs in your browser.
          </p>
          {showAffiliateDisclosure && (
            <p className="mt-3 text-xs text-(--color-muted)">
              Some outbound links are affiliate links — clearly disclosed wherever they appear.
            </p>
          )}
        </div>

        <FooterColumn label="Tool" links={product} />
        <FooterColumn label="About" links={company} />
        <FooterColumn label="Legal" links={legal} />
      </div>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-(--color-border)/60 px-5 py-3 text-center text-[11px] text-(--color-muted) sm:py-4 sm:text-xs">
        <span>
          © {year} {siteConfig.name} · {siteConfig.nav.disclaimer}
        </span>
        <span aria-hidden="true">·</span>
        <VertexFooterLink href="/network" className="transition hover:text-(--color-accent)">
          Part of the Vertex Network
        </VertexFooterLink>
      </div>
    </footer>
  );
}

function FooterColumn({
  label,
  links,
}: {
  label: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-(--color-accent)">
        {label}
      </h2>
      <ul className="mt-2 space-y-1.5 text-sm sm:mt-3 sm:space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-(--color-on-bg)/85 hover:text-(--color-accent)">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
