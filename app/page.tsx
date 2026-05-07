import Link from "next/link";
import { Calculator } from "@/components/Calculator/Calculator";
import { MediavineSlot } from "@/components/ads/MediavineSlot";
import { SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { PSEO_ENTRIES } from "@/lib/pseo/data";

export default function Home() {
  const featured = PSEO_ENTRIES.slice(0, 8);
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:py-16">
      <SoftwareApplicationJsonLd />

      <header className="mb-10 sm:mb-14">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-patina-600">
          Etsy Margin
        </p>
        <h1 className="text-balance text-4xl font-bold leading-tight text-patina-900 sm:text-5xl">
          Don&apos;t lose money on the mandatory 15% Offsite Ads.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-patina-800/80">
          Find your true profit before you price. Every Etsy fee, layered exactly
          the way Etsy charges them, with the loss path visible at a glance.
        </p>
      </header>

      <Calculator />

      <MediavineSlot slot="in-content" className="my-12" />

      <section className="mt-12">
        <h2 className="mb-2 text-2xl font-bold text-patina-900">
          Profit math by Etsy category
        </h2>
        <p className="mb-6 text-patina-800/70">
          Pre-filled scenarios for the most common Etsy seller niches.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {featured.map((e) => (
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

      <footer className="mt-16 border-t border-patina-100 pt-6 text-sm text-patina-700/70">
        <p>
          Numbers reflect Etsy&apos;s 2026 published fee schedule. We are not
          affiliated with Etsy.
        </p>
      </footer>
    </main>
  );
}
