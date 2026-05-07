import Link from "next/link";
import { Calculator } from "@/components/Calculator/Calculator";
import { MediavineSlot } from "@/components/ads/MediavineSlot";
import { SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { PSEO_ENTRIES } from "@/lib/pseo/data";

const adsEnabled = process.env.NEXT_PUBLIC_MEDIAVINE_ENABLED === "1";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:py-16">
      <SoftwareApplicationJsonLd />

      <header className="mb-6 sm:mb-14">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-patina-600 sm:text-sm">
          Etsy Margin
        </p>
        <h1 className="text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-5xl">
          Don&apos;t lose money on the mandatory 15% Offsite Ads.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-patina-800/80 sm:mt-4 sm:text-lg">
          Find your true profit before you price. Every Etsy fee, layered exactly
          the way Etsy charges them, with the loss path visible at a glance.
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-patina-700/75 sm:text-sm">
          <li>2026 fee schedule</li>
          <li aria-hidden="true" className="opacity-40">·</li>
          <li>Math runs in your browser — nothing is sent anywhere</li>
          <li aria-hidden="true" className="opacity-40">·</li>
          <li>Not affiliated with Etsy</li>
        </ul>

        <a
          href="#results"
          className="mt-5 inline-flex items-center gap-1 rounded-full bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-patina-800 sm:hidden"
        >
          See my real profit
          <span aria-hidden="true">↓</span>
        </a>
      </header>

      <Calculator />

      <section className="mt-12 sm:mt-16">
        <h2 className="mb-2 text-2xl font-bold text-patina-900">
          Profit math by Etsy category
        </h2>
        <p className="mb-6 text-patina-800/70">
          Pre-filled scenarios for the most common Etsy seller niches.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PSEO_ENTRIES.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/etsy-profit-margin/${e.slug}`}
                className="block rounded-xl bg-white px-4 py-3 ring-1 ring-patina-100 transition hover:ring-patina-300"
              >
                <span className="block text-xs uppercase tracking-wider text-patina-600">
                  {e.category}
                </span>
                <span className="mt-1 block font-semibold text-patina-900">
                  {e.title.replace(/\s*\(2026\)$/, "")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {adsEnabled && <MediavineSlot slot="in-content" className="my-12" />}

      <footer className="mt-16 border-t border-patina-100 pt-6 text-sm text-patina-700/70">
        <p>
          Numbers reflect Etsy&apos;s 2026 published fee schedule. We are not
          affiliated with Etsy.
        </p>
      </footer>
    </main>
  );
}
