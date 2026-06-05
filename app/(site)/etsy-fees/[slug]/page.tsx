import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator/Calculator";
import { ArticleJsonLd, FaqJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { TrustStrip } from "@/components/layout/TrustStrip";
import {
  ANSWER_PAGES,
  DOLLAR_AMOUNTS,
  PILLAR_DATE_PUBLISHED,
  PILLAR_LAST_UPDATED,
  dollarSlug,
  getAnswerPage,
  parseDollarSlug,
  type AnswerPage,
} from "@/lib/etsy-fees/content";
import { LISTING_FEE, TRANSACTION_FEE_RATE, OFFSITE_ADS_RATE_UNDER_10K } from "@/lib/fees";
import { getPseoEntry } from "@/lib/pseo/data";

// `/etsy-fees/[slug]` serves two route shapes from one file:
//   1. Dollar-amount programmatics — slug = `{N}-dollar-sale`
//   2. PAA answer pages — slug = explicit kebab-case phrase
//
// Dollar slugs are pure numeric prefixes; answer slugs are word-prefixed,
// so the two namespaces don't collide. We try answer-page first, then
// dollar-slug, then 404.

export function generateStaticParams() {
  return [
    ...DOLLAR_AMOUNTS.map((amount) => ({ slug: dollarSlug(amount) })),
    ...ANSWER_PAGES.map((p) => ({ slug: p.slug })),
  ];
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
  const answer = getAnswerPage(slug);
  if (answer) {
    return {
      title: answer.metaTitle,
      description: answer.metaDescription,
      alternates: { canonical: `/etsy-fees/${answer.slug}` },
      openGraph: {
        title: answer.metaTitle,
        description: answer.metaDescription,
        type: "article",
        publishedTime: PILLAR_DATE_PUBLISHED,
        modifiedTime: PILLAR_LAST_UPDATED,
      },
    };
  }
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

export default async function EtsyFeesSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const answer = getAnswerPage(slug);
  if (answer) return <AnswerPageView page={answer} />;
  const amount = parseDollarSlug(slug);
  if (amount === null) notFound();
  return <DollarAmountPage amount={amount} slug={slug} />;
}

function AnswerPageView({ page }: { page: AnswerPage }) {
  const url = `/etsy-fees/${page.slug}`;
  const faq = [{ q: page.title, a: page.shortAnswer }];
  return (
    <main className="mx-auto max-w-3xl px-5 py-6 sm:py-16">
      <SoftwareApplicationJsonLd />
      <FaqJsonLd faq={faq} />
      <ArticleJsonLd
        url={url}
        headline={page.title}
        description={page.metaDescription}
        datePublished={PILLAR_DATE_PUBLISHED}
        dateModified={PILLAR_LAST_UPDATED}
      />
      <BreadcrumbSchema
        crumbs={[
          { name: "Etsy Fees", href: "/etsy-fees" },
          { name: page.title, href: url },
        ]}
      />

      <nav className="mb-4 text-sm sm:mb-6">
        <Link href="/etsy-fees" className="text-patina-700 hover:text-patina-900">
          ← Complete Etsy fees breakdown
        </Link>
      </nav>

      <header className="mb-8 sm:mb-10">
        <h1 className="text-balance text-2xl font-bold leading-tight text-patina-900 sm:text-4xl">
          {page.title}
        </h1>
        <p className="mt-4 text-base text-patina-800/90 sm:text-lg" data-speakable>
          {page.shortAnswer}
        </p>
        <p className="mt-3 text-xs text-patina-muted">
          Updated{" "}
          <time dateTime={PILLAR_LAST_UPDATED}>
            {new Date(PILLAR_LAST_UPDATED).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>{" "}
          · 2026 fee rates from{" "}
          <a
            href="https://www.etsy.com/legal/fees/"
            target="_blank"
            rel="noopener nofollow"
            className="underline underline-offset-2 hover:text-patina-800"
          >
            Etsy&apos;s Fees &amp; Payments policy
          </a>
          .
        </p>
        <TrustStrip />
      </header>

      <article className="space-y-10 text-patina-800/90">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-xl font-bold text-patina-900 sm:text-2xl">
              {section.heading}
            </h2>
            <div className="space-y-3">
              {section.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {page.relatedSpokes && page.relatedSpokes.length > 0 && (
        <section className="mt-12 rounded-2xl bg-patina-50 p-5 ring-1 ring-patina-100 sm:p-6">
          <h2 className="mb-3 text-lg font-bold text-patina-900">Category-specific math</h2>
          <p className="mb-4 text-sm text-patina-800/85">
            See how the answer above plays out in real seller scenarios with pre-filled calculators.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {page.relatedSpokes.map((s) => {
              const entry = getPseoEntry(s.slug);
              if (!entry) return null;
              return (
                <li key={s.slug}>
                  <Link
                    href={`/etsy-profit-margin/${s.slug}`}
                    className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
                  >
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="mb-3 text-xl font-bold text-patina-900 sm:text-2xl">Run your numbers</h2>
        <p className="mb-5 text-patina-800/85">
          Plug in your item price, shipping, and product cost. The calculator layers every fee in
          the order Etsy applies them.
        </p>
        <Calculator
          initialInputs={{
            itemPrice: 30,
            shippingCharged: 5,
            manufacturingCost: 4,
            actualShippingCost: 5,
          }}
        />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-patina-900">More fee questions answered</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {ANSWER_PAGES.filter((p) => p.slug !== page.slug).map((p) => (
            <li key={p.slug}>
              <Link
                href={`/etsy-fees/${p.slug}`}
                className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-patina-900">Specific sale amounts</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {DOLLAR_AMOUNTS.map((a) => (
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

function DollarAmountPage({ amount, slug }: { amount: number; slug: string }) {
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
        <p
          className="mt-3 max-w-2xl text-base text-patina-800/85 sm:mt-4 sm:text-lg"
          data-speakable
        >
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

      <section className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Related fee questions</h2>
        <ul className="my-3 grid gap-2 sm:grid-cols-2">
          {ANSWER_PAGES.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/etsy-fees/${p.slug}`}
                className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
