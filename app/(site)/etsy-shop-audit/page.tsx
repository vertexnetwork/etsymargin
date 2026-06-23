import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleJsonLd, FaqJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { AuditBuyCta, HowItWorks, SampleAuditTable } from "@/components/audit-landing/parts";
import { GumroadCta } from "@/components/affiliates/GumroadCta";
import { PILLAR_DATE_PUBLISHED, PILLAR_LAST_UPDATED } from "@/lib/etsy-fees/content";
import { siteConfig } from "@/lib/site-config";

const PAGE_PATH = "/etsy-shop-audit";

export const metadata: Metadata = {
  title: "Etsy Shop Audit — Find Every Money-Losing Listing (2026)",
  description:
    "Audit your entire Etsy shop in minutes. See exactly which listings lose money after 2026 fees, ranked worst-first, from your own shop export — no listing-by-listing guesswork.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "Etsy Shop Audit — Find Every Money-Losing Listing (2026)",
    description:
      "See which Etsy listings actually lose money after 2026 fees, ranked worst-first, from your own export.",
    type: "website",
  },
};

const FAQ = [
  {
    q: "What is an Etsy shop audit?",
    a: "It's a profitability sweep of your entire catalog: you upload your Etsy listings export, and every listing is run through Etsy's full 2026 fee stack to reveal its true net profit and margin. Instead of trusting that your prices work, you see exactly which listings lose money, which run dangerously thin, and which are healthy.",
  },
  {
    q: "Why can't I just check my listings myself?",
    a: "You can — one at a time. But a shop with 200 listings is 200 separate calculations, each needing the fee stack applied correctly, and the money-losers are rarely the ones you'd guess. The audit does all of them at once and ranks them worst-first, so you fix the listings that are actively bleeding before anything else.",
  },
  {
    q: "What do I need to run it?",
    a: "Your Etsy listings export (Shop Manager → Settings → Options → Download Data) and a rough idea of your product costs. You set a shop-wide cost estimate once, then refine individual listings with exact per-SKU costs if you want tighter numbers.",
  },
  {
    q: "Is my shop data safe?",
    a: "Yes. The audit runs entirely in your browser — your export never leaves your device and nothing is stored on a server. It's the same client-side fee model behind the free single-listing calculator.",
  },
  {
    q: "How do I get the audit tool?",
    a: `It's included in the $${siteConfig.monetization.gumroad.price} Etsy Profit Audit on Gumroad, alongside the 2026 Pricing Bible PDF and the Master Pricing Matrix. You unlock the tool by pasting your Gumroad license key once at /audit — no account, no password.`,
  },
];

export default function ShopAuditPage() {
  if (!siteConfig.features.audit.enabled) notFound();

  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:py-16">
      <SoftwareApplicationJsonLd />
      <FaqJsonLd faq={FAQ} />
      <ArticleJsonLd
        url={PAGE_PATH}
        headline="Etsy Shop Audit: Find Every Money-Losing Listing"
        description="Audit your whole Etsy shop against 2026 fees and rank every listing by true profit."
        datePublished={PILLAR_DATE_PUBLISHED}
        dateModified={PILLAR_LAST_UPDATED}
      />
      <BreadcrumbSchema crumbs={[{ name: "Etsy Shop Audit", href: PAGE_PATH }]} />

      <nav className="mb-4 text-sm sm:mb-6">
        <Link href="/" className="text-patina-700 hover:text-patina-900">
          ← Etsy Margin
        </Link>
      </nav>

      <header className="mb-6 sm:mb-10">
        <h1 className="text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
          Etsy shop audit: find every money-losing listing
        </h1>
        <p className="mt-3 max-w-2xl text-base text-patina-800/80 sm:text-lg">
          Most shops have listings that lose money after Etsy&apos;s fees — and the owner has no
          idea which ones, because every listing looks fine on its own. An audit runs your entire
          catalog through the 2026 fee stack at once and shows you, ranked worst-first, exactly
          where you&apos;re bleeding.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <GumroadCta variant="button" source="pseo" content="audit-hero" />
          <a
            href="#example"
            className="text-sm font-medium text-patina-700 underline underline-offset-4 hover:text-patina-900"
          >
            See a sample audit ↓
          </a>
        </div>
      </header>

      <section aria-labelledby="example" className="mb-12 max-w-3xl">
        <h2 id="example" className="text-2xl font-bold text-patina-900">
          What an audit reveals
        </h2>
        <p className="mt-3 text-patina-800/85">
          The same four listings a seller would call &quot;fine&quot; — until the fees are layered
          in. Two of them lose money on every order:
        </p>
        <SampleAuditTable />
      </section>

      <section aria-labelledby="how" className="mb-12">
        <h2 id="how" className="text-2xl font-bold text-patina-900">
          How the Etsy shop audit works
        </h2>
        <HowItWorks />
      </section>

      <section aria-labelledby="fix" className="mb-12 max-w-3xl">
        <h2 id="fix" className="text-2xl font-bold text-patina-900">
          What to do with the results
        </h2>
        <p className="mt-3 text-patina-800/85">
          The worst offenders usually share a cause: low price points where Etsy&apos;s flat fees
          eat the margin, or Off-Site Ads pushing an already-thin listing underwater. The fix is
          almost always a price adjustment or bundling, not deleting the listing. For the mechanics
          of each fee behind the numbers, read{" "}
          <Link
            href="/etsy-fees"
            className="font-medium text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            how much Etsy takes per sale
          </Link>
          , or run a single listing in the{" "}
          <Link
            href="/bulk-etsy-profit-calculator"
            className="font-medium text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            bulk profit calculator
          </Link>
          .
        </p>
      </section>

      <AuditBuyCta source="pseo" />

      <section aria-labelledby="faq" className="mt-16">
        <h2 id="faq" className="mb-6 text-2xl font-bold text-patina-900">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <details key={f.q} className="quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80">
              <summary className="cursor-pointer text-base font-semibold text-patina-900">
                {f.q}
              </summary>
              <p className="mt-3 text-patina-800/80">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
