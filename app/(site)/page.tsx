import Link from "next/link";
import { Calculator } from "@/components/Calculator/Calculator";
import { GumroadCta } from "@/components/affiliates/GumroadCta";
import { SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { TrustStrip } from "@/components/layout/TrustStrip";
import { PSEO_ENTRIES } from "@/lib/pseo/data";

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

        <a
          href="#results"
          className="mt-5 inline-flex items-center gap-1 rounded-full bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-patina-800 sm:hidden"
        >
          See my real profit
          <span aria-hidden="true">↓</span>
        </a>
      </header>

      <Calculator />

      {/* Inline Pricing Bible CTA — between the calculator and the
          categories grid, where the eye has just finished processing
          numbers and is scanning for "what's next". The compact CTA
          inside the results card alone was too easy to miss.
          Attribution: utm_source=home so we can compare home-inline
          vs in-calculator compact tiers. */}
      <GumroadCta variant="inline" source="home" className="mt-10 sm:mt-12" />

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
    </main>
  );
}
