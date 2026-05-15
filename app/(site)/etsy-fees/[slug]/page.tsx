import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator/Calculator";
import { ArticleJsonLd, FaqJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { TrustStrip } from "@/components/layout/TrustStrip";
import {
  DOLLAR_AMOUNTS,
  PILLAR_DATE_PUBLISHED,
  PILLAR_LAST_UPDATED,
  dollarSlug,
  parseDollarSlug,
} from "@/lib/etsy-fees/content";
import { LISTING_FEE, TRANSACTION_FEE_RATE, OFFSITE_ADS_RATE_UNDER_10K } from "@/lib/fees";

// Programmatic surface for the PAA query "how much does Etsy take from a
// $N sale". Each renders a single-question QAPage shape via the existing
// FaqJsonLd component (one FAQ item = one Question/Answer) — that's the
// schema Google parses for direct PAA citation. The calculator is
// pre-filled to the dollar amount so the visitor lands on the exact
// scenario they searched for.

export function generateStaticParams() {
  return DOLLAR_AMOUNTS.map((amount) => ({ slug: dollarSlug(amount) }));
}

const US_PAYMENT_FLAT = 0.25;
const US_PAYMENT_PERCENT = 0.03;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function feeBreakdown(amount: number) {
  const listing = LISTING_FEE;
  const transaction = round2(amount * TRANSACTION_FEE_RATE);
  const processing = round2(amount * US_PAYMENT_PERCENT + US_PAYMENT_FLAT);
  const baseline = round2(listing + transaction + processing);
  const offsiteAds = round2(amount * OFFSITE_ADS_RATE_UNDER_10K);
  const withAds = round2(baseline + offsiteAds);
  return {
    listing,
    transaction,
    processing,
    baseline,
    offsiteAds,
    withAds,
    baselinePct: round2((baseline / amount) * 100),
    withAdsPct: round2((withAds / amount) * 100),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const amount = parseDollarSlug(slug);
  if (amount === null) return {};
  const fees = feeBreakdown(amount);
  return {
    title: `How Much Does Etsy Take From a $${amount} Sale? (2026)`,
    description: `On a $${amount} Etsy sale: baseline fees are $${fees.baseline.toFixed(2)} (~${fees.baselinePct}%). With Off-Site Ads at 15%, total fees rise to $${fees.withAds.toFixed(2)} (~${fees.withAdsPct}%). Full 2026 fee breakdown with calculator.`,
    alternates: { canonical: `/etsy-fees/${slug}` },
    openGraph: {
      title: `How Much Does Etsy Take From a $${amount} Sale? (2026)`,
      description: `Real 2026 numbers: baseline fees, Off-Site Ads scenario, and net profit on a $${amount} Etsy sale.`,
      type: "article",
      publishedTime: PILLAR_DATE_PUBLISHED,
      modifiedTime: PILLAR_LAST_UPDATED,
    },
  };
}

export default async function DollarAmountPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const amount = parseDollarSlug(slug);
  if (amount === null) notFound();

  const fees = feeBreakdown(amount);
  const url = `/etsy-fees/${slug}`;

  const faq = [
    {
      q: `How much does Etsy take from a $${amount} sale?`,
      a: `Baseline fees on a $${amount} US sale total $${fees.baseline.toFixed(2)} — that's the $0.20 listing fee, the $${fees.transaction.toFixed(2)} transaction fee (6.5% of $${amount}), and the $${fees.processing.toFixed(2)} payment processing fee (3% + $0.25). That's ~${fees.baselinePct}% of revenue. If Off-Site Ads attribute the sale at 15%, add $${fees.offsiteAds.toFixed(2)} — total fees rise to $${fees.withAds.toFixed(2)}, or ~${fees.withAdsPct}% of revenue.`,
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:py-16">
      <SoftwareApplicationJsonLd />
      <FaqJsonLd faq={faq} />
      <ArticleJsonLd
        url={url}
        headline={`How Much Does Etsy Take From a $${amount} Sale?`}
        description={`Baseline fees, Off-Site Ads scenario, and net profit on a $${amount} Etsy sale in 2026.`}
        datePublished={PILLAR_DATE_PUBLISHED}
        dateModified={PILLAR_LAST_UPDATED}
      />
      <BreadcrumbSchema
        crumbs={[
          { name: "Etsy Fees", href: "/etsy-fees" },
          { name: `$${amount} sale`, href: url },
        ]}
      />

      <nav className="mb-4 text-sm sm:mb-6">
        <Link href="/etsy-fees" className="text-patina-700 hover:text-patina-900">
          ← Complete Etsy fees breakdown
        </Link>
      </nav>

      <header className="mb-6 sm:mb-10">
        <h1 className="text-balance text-2xl font-bold leading-tight text-patina-900 sm:text-4xl">
          How much does Etsy take from a ${amount} sale?
        </h1>
        <p className="mt-3 max-w-2xl text-base text-patina-800/85 sm:mt-4 sm:text-lg">
          <strong className="text-patina-900">
            Baseline: ${fees.baseline.toFixed(2)} (~{fees.baselinePct}%).
          </strong>{" "}
          <strong className="text-patina-900">
            With Off-Site Ads at 15%: ${fees.withAds.toFixed(2)} (~{fees.withAdsPct}%).
          </strong>{" "}
          Worked line-by-line below, with a calculator pre-filled to ${amount}.
        </p>
        <p className="mt-2 text-xs text-patina-muted">
          Updated{" "}
          <time dateTime={PILLAR_LAST_UPDATED}>
            {new Date(PILLAR_LAST_UPDATED).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>{" "}
          · US seller, item + shipping combined.
        </p>
        <TrustStrip />
      </header>

      <section className="mb-10 rounded-2xl bg-cream-50 p-5 ring-1 ring-patina-100 sm:p-6">
        <h2 className="mb-3 text-lg font-bold text-patina-900">
          Line-by-line breakdown on ${amount}
        </h2>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="py-2 text-patina-800/90">Listing fee</td>
              <td className="py-2 text-right font-mono text-patina-900">
                ${fees.listing.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-patina-800/90">Transaction fee (6.5%)</td>
              <td className="py-2 text-right font-mono text-patina-900">
                ${fees.transaction.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-patina-800/90">Payment processing (3% + $0.25)</td>
              <td className="py-2 text-right font-mono text-patina-900">
                ${fees.processing.toFixed(2)}
              </td>
            </tr>
            <tr className="border-t border-patina-200">
              <td className="py-2 font-semibold text-patina-900">Baseline total</td>
              <td className="py-2 text-right font-mono font-semibold text-patina-900">
                ${fees.baseline.toFixed(2)} ({fees.baselinePct}%)
              </td>
            </tr>
            <tr>
              <td className="py-2 text-patina-800/90">+ Off-Site Ads (15%, if attributed)</td>
              <td className="py-2 text-right font-mono text-patina-900">
                ${fees.offsiteAds.toFixed(2)}
              </td>
            </tr>
            <tr className="border-t border-patina-200">
              <td className="py-2 font-semibold text-patina-900">With Off-Site Ads</td>
              <td className="py-2 text-right font-mono font-semibold text-patina-900">
                ${fees.withAds.toFixed(2)} ({fees.withAdsPct}%)
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-xs text-patina-muted">
          Off-Site Ads is opt-out under $10k trailing revenue and mandatory at 12% above. Currency
          conversion (2.5%) and regulatory operating fees apply in additional jurisdictions.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-3 text-2xl font-bold text-patina-900 sm:text-3xl">
          Try your real numbers
        </h2>
        <p className="mb-5 text-patina-800/85">
          Calculator pre-set to a ${amount} item. Add your actual shipping, manufacturing cost, and
          country to see your net profit.
        </p>
        <Calculator
          initialInputs={{
            itemPrice: amount,
            shippingCharged: 0,
            manufacturingCost: 0,
            actualShippingCost: 0,
          }}
        />
      </section>

      <section className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">What changes the answer</h2>
        <p>
          The numbers above assume a US seller, the item + shipping combined into a single line
          item, and Etsy Payments at the standard US rate (3% + $0.25). Three things change the math
          materially:
        </p>
        <ul className="my-3 list-disc space-y-2 pl-6">
          <li>
            <strong className="text-patina-900">Off-Site Ads attribution.</strong> The single
            biggest variable. Adds 12% (≥$10k seller) or 15% (under $10k) on attributed orders.
            Capped at $100 per order.
          </li>
          <li>
            <strong className="text-patina-900">Country.</strong> UK sellers pay 4% + £0.20 for
            payment processing; EU sellers 4% + €0.30. UK also adds the Regulatory Operating Fee.
          </li>
          <li>
            <strong className="text-patina-900">Currency conversion.</strong> 2.5% if your listing
            and payout currencies differ.
          </li>
        </ul>
        <p>
          For the full mechanics of each fee, read the{" "}
          <Link
            href="/etsy-fees"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            complete 2026 Etsy fee breakdown
          </Link>
          .
        </p>
      </section>

      <section className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Other order sizes</h2>
        <p>
          The effective fee rate shifts sharply with order size because the flat fees ($0.20 +
          $0.25) consume a larger share of small orders.
        </p>
        <ul className="my-3 grid gap-2 sm:grid-cols-2">
          {DOLLAR_AMOUNTS.filter((a) => a !== amount).map((a) => (
            <li key={a}>
              <Link
                href={`/etsy-fees/${dollarSlug(a)}`}
                className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
              >
                How much does Etsy take from a ${a} sale?
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
