import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/Calculator/Calculator";
import { GumroadCta } from "@/components/affiliates/GumroadCta";
import { EmailCapture } from "@/components/email/EmailCapture";
import { SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { TrustStrip } from "@/components/layout/TrustStrip";
import { PSEO_ENTRIES } from "@/lib/pseo/data";
import { siteConfig } from "@/lib/site-config";

// Explicit canonical on the homepage closes the indexation leak GSC was
// surfacing as duplicate `www.` + apex entries. The Vercel www→apex 308
// handles the URL-level consolidation; this tag enforces it at the HTML
// level so Google never sees ambiguous signal regardless of entry point.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:py-16">
      <SoftwareApplicationJsonLd />

      <header className="mb-6 sm:mb-14">
        <span className="inline-flex items-center gap-2 rounded-full bg-lime-cream/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-patina-900 ring-1 ring-patina-200/50">
          <span className="font-display text-sm font-bold">4–6 fees</span>
          <span className="font-medium normal-case tracking-normal text-patina-800">
            stacked per Etsy sale
          </span>
        </span>
        <h1 className="mt-3 text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-5xl">
          Don&apos;t lose money on the mandatory 15% Offsite Ads.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-patina-800/80 sm:mt-4 sm:text-lg">
          Find your true profit before you price. Every Etsy fee, layered exactly the way Etsy
          charges them, with the loss path visible at a glance.
        </p>

        <TrustStrip />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="#results"
            className="inline-flex items-center gap-1 rounded-full bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-patina-800 sm:hidden"
          >
            See my real profit
            <span aria-hidden="true">↓</span>
          </a>
          <Link
            href="/etsy-fees"
            className="text-sm font-medium text-patina-700 underline underline-offset-4 hover:text-patina-900"
          >
            How much does Etsy take per sale? Full 2026 fee breakdown →
          </Link>
        </div>
      </header>

      <Calculator />

      {/* Post-results pitch. The moment after the calculator shows a number is
          peak intent — so this is where the whole-shop hook lives. When the
          audit tool is live we lead with the painkiller card (→ the landing
          page, which explains + sells); otherwise we fall back to the inline
          Gumroad CTA so the page still monetizes. One pitch here, not two. */}
      {siteConfig.features.audit.enabled ? (
        <section className="mt-10 rounded-2xl bg-patina-50 p-6 ring-1 ring-patina-200 sm:mt-12 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-patina-700">
            That was one listing
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-patina-900">
            How many of your <em>other</em> listings lose money?
          </h2>
          <p className="mt-2 max-w-2xl text-patina-800/85">
            Upload your Etsy export and the bulk audit runs this exact fee math across your whole
            shop at once — every listing ranked worst-margin-first, money-losers flagged. It&apos;s
            the thing a one-listing calculator can&apos;t do.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-patina-800/75">
            ${siteConfig.monetization.gumroad.price} one-time — includes the bulk audit tool, the
            2026 Pricing Bible PDF, and the Master Pricing Matrix. 7-day money-back guarantee.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
            <GumroadCta variant="button" source="home" />
            <Link
              href="/etsy-shop-audit"
              className="text-sm font-medium text-patina-700 underline underline-offset-4 hover:text-patina-900"
            >
              See how it works →
            </Link>
          </div>
        </section>
      ) : (
        <GumroadCta variant="inline" source="home" className="mt-10 sm:mt-12" />
      )}

      <section id="categories" className="mt-12 scroll-mt-20 sm:mt-16">
        <h2 className="mb-2 text-2xl font-bold text-patina-900">Profit math by Etsy category</h2>
        <p className="mb-6 text-patina-muted">
          Pre-filled scenarios for the most common Etsy seller niches.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PSEO_ENTRIES.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/etsy-profit-margin/${e.slug}`}
                className="quiet-card block rounded-xl px-4 py-3.5 ring-1 ring-patina-100/80 transition hover:ring-patina-300"
              >
                <span className="inline-flex items-center rounded-full bg-lime-cream/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-patina-900 ring-1 ring-patina-200/40">
                  {e.category}
                </span>
                <span className="mt-2 block font-semibold text-patina-900">
                  {e.title.replace(/\s*\(2026\)$/, "")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {siteConfig.features.email.enabled && (
        <EmailCapture source="home" className="mt-12 sm:mt-16" />
      )}
    </main>
  );
}
