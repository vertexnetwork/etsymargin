import type { Metadata } from "next";
import Link from "next/link";
import { ArticleJsonLd, HowToJsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PILLAR_DATE_PUBLISHED, PILLAR_LAST_UPDATED } from "@/lib/etsy-fees/content";
import { siteConfig } from "@/lib/site-config";
import {
  LISTING_FEE,
  TRANSACTION_FEE_RATE,
  OFFSITE_ADS_RATE_UNDER_10K,
  OFFSITE_ADS_RATE_AT_10K,
  OFFSITE_ADS_FEE_CAP,
} from "@/lib/fees";

const PAGE_PATH = "/methodology";

export const metadata: Metadata = {
  title: `Methodology — How ${siteConfig.name} Calculates Etsy Fees`,
  description:
    "Exact 2026 fee constants used by the calculator, the order in which fees are layered, primary source citations, and how to audit our math against Etsy's published policy.",
  alternates: { canonical: PAGE_PATH },
};

const pct = (n: number) => `${(n * 100).toFixed(1).replace(/\.0$/, "")}%`;

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <ArticleJsonLd
        url={PAGE_PATH}
        headline="Etsy Fee Calculation Methodology"
        description="The 2026 fee constants, layering order, and primary sources behind the Etsy Margin calculator."
        datePublished={PILLAR_DATE_PUBLISHED}
        dateModified={PILLAR_LAST_UPDATED}
      />
      <HowToJsonLd
        name="How to calculate your true Etsy profit"
        description="Layer every 2026 Etsy fee in the order Etsy charges them to find net profit on a sale."
        steps={[
          { name: "Start from gross", text: "Gross = item price + shipping charged to the buyer." },
          { name: "Add the listing fee", text: "Add the flat $0.20 listing fee." },
          { name: "Add the transaction fee", text: "Add 6.5% of gross as the transaction fee." },
          {
            name: "Add payment processing",
            text: "Add the country-specific payment processing rate on gross plus the flat per-transaction fee (US: 3% + $0.25).",
          },
          {
            name: "Add the regulatory operating fee",
            text: "Add the regulatory operating fee where it applies (UK and select EU): a percentage of gross.",
          },
          {
            name: "Add Off-Site Ads if attributed",
            text: "If Off-Site Ads attributed the sale, add 12% or 15% of gross, capped at $100 per order.",
          },
          {
            name: "Subtract costs for net profit",
            text: "Net profit = gross − all fees − manufacturing cost − actual shipping cost.",
          },
        ]}
      />
      <BreadcrumbSchema crumbs={[{ name: "Methodology", href: PAGE_PATH }]} />

      <header className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-patina-600">
          Methodology
        </span>
        <h1 className="mt-2 text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
          How {siteConfig.name} calculates Etsy fees
        </h1>
        <p className="mt-3 text-lg text-patina-800/85" data-speakable>
          Every constant, every layering decision, and the primary source that backs each one. The
          calculator is auditable on purpose — the fee math lives in a single tested pure function,
          and the constants are linked from this page so anyone can verify.
        </p>
        <p className="mt-2 text-xs text-patina-muted">
          Updated{" "}
          <time dateTime={PILLAR_LAST_UPDATED}>
            {new Date(PILLAR_LAST_UPDATED).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>
      </header>

      <section className="space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Primary sources</h2>
        <p>
          Every fee rate the calculator uses is sourced from one of the following Etsy-published
          documents. If a rate drifts in any of them, the change is reflected in our constants and
          noted in the{" "}
          <Link
            href="/changelog"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            changelog
          </Link>
          .
        </p>
        <ul className="my-3 list-disc space-y-2 pl-6">
          <li>
            <a
              href="https://www.etsy.com/legal/fees/"
              target="_blank"
              rel="noopener nofollow"
              className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
            >
              Etsy Fees &amp; Payments Policy
            </a>{" "}
            — the canonical document for transaction fee, listing fee, payment processing rates by
            country, and Off-Site Ads thresholds.
          </li>
          <li>
            <a
              href="https://help.etsy.com/hc/en-us/articles/360035902374-Etsy-Fee-Basics"
              target="_blank"
              rel="noopener nofollow"
              className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
            >
              Etsy Help: Fee Basics
            </a>{" "}
            — the seller-facing summary, also the source for the $10k Off-Site Ads threshold
            language.
          </li>
          <li>
            <a
              href="https://help.etsy.com/hc/en-us/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy"
              target="_blank"
              rel="noopener nofollow"
              className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
            >
              Etsy Help: What are the Fees and Taxes for Selling on Etsy
            </a>{" "}
            — currency conversion and regulatory operating fee details.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Fee constants in use</h2>
        <p>
          These are the exact constants the calculator pure function reads. They live in{" "}
          <code className="rounded bg-patina-50 px-1.5 py-0.5 font-mono text-sm text-patina-900">
            lib/fees.ts
          </code>{" "}
          in our open-source repository.
        </p>
        <ul className="my-3 space-y-2 rounded-2xl bg-white p-5 ring-1 ring-patina-100">
          <li>
            <strong className="text-patina-900">Listing fee:</strong> ${LISTING_FEE.toFixed(2)} flat
            per unit sold.
          </li>
          <li>
            <strong className="text-patina-900">Transaction fee:</strong>{" "}
            {pct(TRANSACTION_FEE_RATE)} of (item price + shipping + gift wrap).
          </li>
          <li>
            <strong className="text-patina-900">Payment processing (US):</strong> 3% + $0.25 per
            transaction.
          </li>
          <li>
            <strong className="text-patina-900">Payment processing (UK):</strong> 4% + £0.20.
          </li>
          <li>
            <strong className="text-patina-900">Payment processing (EU):</strong> 4% + €0.30.
          </li>
          <li>
            <strong className="text-patina-900">Payment processing (CA, AU):</strong> 3% + 0.25 in
            local currency.
          </li>
          <li>
            <strong className="text-patina-900">Off-Site Ads (under $10k):</strong>{" "}
            {pct(OFFSITE_ADS_RATE_UNDER_10K)}, opt-out available, capped at ${OFFSITE_ADS_FEE_CAP}{" "}
            per order.
          </li>
          <li>
            <strong className="text-patina-900">Off-Site Ads (at or above $10k):</strong>{" "}
            {pct(OFFSITE_ADS_RATE_AT_10K)}, mandatory, capped at ${OFFSITE_ADS_FEE_CAP} per order.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Order of layering</h2>
        <p>
          The calculator applies fees in the same order Etsy charges them, which matters because
          Off-Site Ads is calculated on the buyer-facing order total — not on the net after other
          fees. The sequence:
        </p>
        <ol className="my-3 list-decimal space-y-2 pl-6">
          <li>
            <strong className="text-patina-900">Gross</strong> = item price + shipping charged to
            buyer.
          </li>
          <li>Listing fee added: flat $0.20.</li>
          <li>Transaction fee added: 6.5% of gross.</li>
          <li>
            Payment processing added: country-specific rate on gross + flat per-transaction fee.
          </li>
          <li>Regulatory operating fee added (UK and select EU): percentage of gross.</li>
          <li>Off-Site Ads added (if enabled): 12% or 15% of gross, capped at $100 per order.</li>
          <li>
            <strong className="text-patina-900">Net profit</strong> = gross − all fees −
            manufacturing cost − actual shipping cost.
          </li>
        </ol>
      </section>

      <section className="mt-10 space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">What the calculator does not include</h2>
        <p>
          We deliberately omit a few things from the default fee math to keep the headline number
          honest:
        </p>
        <ul className="my-3 list-disc space-y-2 pl-6">
          <li>
            <strong className="text-patina-900">Sales tax remittance.</strong> Etsy collects and
            remits sales tax in most US states on the seller&apos;s behalf — it&apos;s a
            pass-through, not a fee. It does NOT appear in net profit because the buyer pays it
            directly to the tax authority via Etsy.
          </li>
          <li>
            <strong className="text-patina-900">Etsy Ads (on-site).</strong> The cost-per-click ad
            program you opt into separately. It&apos;s a discretionary spend, not a fee on every
            sale, so it&apos;s outside the default calculator scope.
          </li>
          <li>
            <strong className="text-patina-900">Etsy Plus subscription.</strong> $10/month flat
            subscription fee — not a per-sale fee. Sellers who use Plus should subtract $10/month
            from their net manually if modeling annual margin.
          </li>
          <li>
            <strong className="text-patina-900">Shipping label costs.</strong> The calculator
            accepts the seller&apos;s actual shipping cost as an input; we don&apos;t model
            Etsy-discounted label rates because the discount varies by carrier, weight class, and
            seller tier.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Audit the math yourself</h2>
        <p>
          The entire fee calculation is a single pure function in{" "}
          <a
            href={`${siteConfig.repoUrl}/blob/main/lib/fees.ts`}
            target="_blank"
            rel="noopener"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            lib/fees.ts
          </a>{" "}
          — open-source, heavily tested, no telemetry. If you can read TypeScript you can verify
          every number this site reports.
        </p>
        <p>
          Found something that doesn&apos;t match your Etsy seller dashboard? Email{" "}
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            {siteConfig.supportEmail}
          </a>{" "}
          with a reproduction (link to the Etsy help page documenting the rate, the inputs that
          produced the wrong output) and we&apos;ll fix it in a single round trip.
        </p>
      </section>

      <p className="mt-12 text-xs text-patina-muted">{siteConfig.trademarkDisclaimer}</p>
    </main>
  );
}
