import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator } from "@/components/Calculator/Calculator";
import { ArticleJsonLd, FaqJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { TrustStrip } from "@/components/layout/TrustStrip";
import { AuditBuyCta, HowItWorks } from "@/components/audit-landing/parts";
import { GumroadCta } from "@/components/affiliates/GumroadCta";
import { PILLAR_DATE_PUBLISHED, PILLAR_LAST_UPDATED } from "@/lib/etsy-fees/content";
import { siteConfig } from "@/lib/site-config";

const PAGE_PATH = "/bulk-etsy-profit-calculator";

export const metadata: Metadata = {
  title: "Bulk Etsy Profit Calculator — Audit Every Listing (2026)",
  description:
    "Calculate true profit on every Etsy listing at once. Upload your shop export and the bulk calculator runs 2026 fee math across your whole catalog to flag every money-losing listing.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "Bulk Etsy Profit Calculator — Audit Every Listing (2026)",
    description:
      "Run 2026 Etsy fee math across your entire shop at once. See which listings actually make money.",
    type: "website",
  },
};

const FAQ = [
  {
    q: "How is a bulk Etsy profit calculator different from a normal one?",
    a: "A normal calculator checks one listing at a time — you type a price and see one result. The bulk calculator takes your Etsy listings export and runs the same fee math across every listing at once, then ranks them so the money-losers surface immediately. If you have more than a handful of listings, checking them one by one isn't realistic.",
  },
  {
    q: "What does it cost and how do I get it?",
    a: `The bulk audit tool is part of the $${siteConfig.monetization.gumroad.price} Etsy Profit Audit on Gumroad, which also includes the 2026 Pricing Bible PDF and the Master Pricing Matrix. After buying, you paste your Gumroad license key once at /audit to unlock it. The single-listing calculator on this page is free, no signup.`,
  },
  {
    q: "Does my shop data get uploaded anywhere?",
    a: "No. The audit runs entirely in your browser — your listings file never leaves your device and nothing is stored on a server. The fee math is the same client-side model that powers the free calculator.",
  },
  {
    q: "Which fees does it account for?",
    a: "All of them, layered the way Etsy charges in 2026: the $0.20 listing fee, 6.5% transaction fee, country-specific payment processing, the 12–15% Off-Site Ads cut (capped at $100), and regulatory operating fees where they apply.",
  },
];

export default function BulkCalculatorPage() {
  if (!siteConfig.features.audit.enabled) notFound();

  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:py-16">
      <SoftwareApplicationJsonLd />
      <FaqJsonLd faq={FAQ} />
      <ArticleJsonLd
        url={PAGE_PATH}
        headline="Bulk Etsy Profit Calculator: Every Listing at Once"
        description="Run 2026 Etsy fee math across your entire shop export to find every money-losing listing."
        datePublished={PILLAR_DATE_PUBLISHED}
        dateModified={PILLAR_LAST_UPDATED}
      />
      <BreadcrumbSchema crumbs={[{ name: "Bulk Etsy Profit Calculator", href: PAGE_PATH }]} />

      <nav className="mb-4 text-sm sm:mb-6">
        <Link href="/" className="text-patina-700 hover:text-patina-900">
          ← Etsy Margin
        </Link>
      </nav>

      <header className="mb-6 sm:mb-10">
        <h1 className="text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
          Bulk Etsy profit calculator: every listing at once
        </h1>
        <p className="mt-3 max-w-2xl text-base text-patina-800/80 sm:text-lg">
          A single-listing calculator answers one question at a time. If you sell 50, 200, or 2,000
          items, the real question is <em>which</em> of them are quietly losing money after
          Etsy&apos;s 2026 fees — and you can&apos;t answer that one listing at a time. This does it
          for your whole shop at once.
        </p>
        <TrustStrip />
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <GumroadCta variant="button" source="pseo" content="bulk-hero" />
          <a
            href="#try-one"
            className="text-sm font-medium text-patina-700 underline underline-offset-4 hover:text-patina-900"
          >
            Try it free on one listing ↓
          </a>
        </div>
      </header>

      <section aria-labelledby="try-one" className="mb-12">
        <h2 id="try-one" className="mb-2 text-2xl font-bold text-patina-900">
          Try it free on one listing
        </h2>
        <p className="mb-5 max-w-2xl text-patina-800/80">
          Here&apos;s the exact fee math, free, for a single listing. The bulk tool runs this same
          calculation across every row of your Etsy export.
        </p>
        <Calculator />
      </section>

      <section aria-labelledby="how" className="mb-12">
        <h2 id="how" className="text-2xl font-bold text-patina-900">
          How the bulk calculator works
        </h2>
        <HowItWorks />
      </section>

      <section aria-labelledby="why" className="mb-12 max-w-3xl">
        <h2 id="why" className="text-2xl font-bold text-patina-900">
          Why bulk matters: the flat fees punish small listings
        </h2>
        <p className="mt-3 text-patina-800/85">
          Etsy&apos;s two flat fees — the $0.20 listing fee and the ~$0.25 fixed payment-processing
          charge — barely register on a $40 order but dominate a $4 one. Sellers with lots of
          low-priced items almost always have a cluster of listings sitting underwater without
          realizing it, because each one looks fine in isolation. Running the whole catalog at once
          is the only way to see the pattern. For the full fee breakdown behind the math, see{" "}
          <Link
            href="/etsy-fees"
            className="font-medium text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            how much Etsy takes per sale
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

      <p className="mt-12 text-sm text-patina-muted">
        Looking to diagnose a specific problem rather than calculate?{" "}
        <Link
          href="/etsy-shop-audit"
          className="font-medium text-patina-700 underline underline-offset-2 hover:text-patina-900"
        >
          See how the full Etsy shop audit works →
        </Link>
      </p>
    </main>
  );
}
