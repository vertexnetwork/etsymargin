import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  // Hide the audit landing link until the feature is live (the page 404s when
  // the flag is off, so we don't want a dead nav entry on preview/local).
  const auditOn = siteConfig.features.audit.enabled;
  const navLinks = siteConfig.nav.primary.filter((l) => auditOn || l.href !== "/etsy-shop-audit");
  const price = siteConfig.monetization.gumroad.price;

  // Persistent buy lever. Points at the offer page (which carries the overlay
  // checkout + full value stack) rather than firing payment from a cold header
  // click. Stays visible on mobile so the funnel survives any scroll depth.
  const auditCta = auditOn ? (
    <Link
      href="/etsy-shop-audit"
      className="inline-flex items-center gap-1.5 rounded-full bg-patina-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-patina-800 sm:px-4 sm:py-2 sm:text-sm"
    >
      Audit your shop
      <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
        ${price}
      </span>
    </Link>
  ) : null;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-(--color-border) bg-(--color-bg)/85 backdrop-blur supports-[backdrop-filter]:bg-(--color-bg)/70">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:h-16">
        <Link href="/" className="text-(--color-on-bg) transition hover:text-(--color-accent)">
          <Wordmark size={22} />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Desktop nav (≥640px) */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 text-sm font-medium text-(--color-on-bg)/85 sm:flex"
          >
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-(--color-accent)">
                {l.label}
              </Link>
            ))}
          </nav>

          {auditCta}

          {/* Mobile nav: zero-JS disclosure with 44px touch target */}
          <details className="relative sm:hidden">
            <summary
              aria-label="Open menu"
              className="flex h-(--spacing-touch) w-(--spacing-touch) -mr-2 cursor-pointer list-none items-center justify-center rounded-md text-(--color-on-bg) [&::-webkit-details-marker]:hidden"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </summary>
            <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-(--color-border) bg-(--color-bg) p-2 shadow-lg">
              <ul className="flex flex-col text-sm font-medium text-(--color-on-bg)/85">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block rounded-md px-3 py-2 transition hover:bg-patina-50 hover:text-(--color-on-bg)"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
