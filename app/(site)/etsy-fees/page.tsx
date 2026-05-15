import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/Calculator/Calculator";
import { GumroadCta } from "@/components/affiliates/GumroadCta";
import { ArticleJsonLd, FaqJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { TrustStrip } from "@/components/layout/TrustStrip";
import {
  DOLLAR_AMOUNTS,
  FEE_ROWS,
  PILLAR_DATE_PUBLISHED,
  PILLAR_FAQ,
  PILLAR_LAST_UPDATED,
  dollarSlug,
} from "@/lib/etsy-fees/content";
import { siteConfig } from "@/lib/site-config";

const PAGE_PATH = "/etsy-fees";

export const metadata: Metadata = {
  title: "How Much Does Etsy Take Per Sale? Complete 2026 Fee Breakdown",
  description:
    "Etsy takes 10%–28% of every sale depending on Off-Site Ads attribution. Every 2026 fee — listing, transaction, payment processing, Off-Site Ads, regulatory, currency conversion — explained with worked examples and a live calculator.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "How Much Does Etsy Take Per Sale? Complete 2026 Fee Breakdown",
    description:
      "The full 2026 Etsy fee stack: listing, transaction, payment processing, Off-Site Ads, currency, regulatory. Worked examples + live calculator.",
    type: "article",
    publishedTime: PILLAR_DATE_PUBLISHED,
    modifiedTime: PILLAR_LAST_UPDATED,
  },
};

const updatedLabel = new Date(PILLAR_LAST_UPDATED).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function EtsyFeesPillarPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:py-16">
      <SoftwareApplicationJsonLd />
      <FaqJsonLd faq={PILLAR_FAQ} />
      <ArticleJsonLd
        url={PAGE_PATH}
        headline="How Much Does Etsy Take Per Sale? Complete 2026 Fee Breakdown"
        description="Every 2026 Etsy fee, layered exactly the way Etsy charges them, with worked examples and a live calculator."
        datePublished={PILLAR_DATE_PUBLISHED}
        dateModified={PILLAR_LAST_UPDATED}
      />
      <BreadcrumbSchema crumbs={[{ name: "Etsy Fees", href: PAGE_PATH }]} />

      <header className="mb-6 sm:mb-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-lime-cream/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-patina-900 ring-1 ring-patina-200/50">
          2026 Edition
        </span>
        <h1 className="mt-3 text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-5xl">
          How much does Etsy take per sale? Complete 2026 fee breakdown.
        </h1>
        <p className="mt-4 max-w-3xl text-base text-patina-800/85 sm:text-lg">
          <strong className="text-patina-900">Etsy takes between 10% and 28% of every sale,</strong>{" "}
          depending on whether Off-Site Ads attributed the order. The baseline fee stack — listing,
          transaction, and payment processing — totals about 10% of a typical $30 sale. Off-Site Ads
          adds 12–15% on top, which is what pushes the realistic ceiling to ~25–28%. This page walks
          through every fee in the order Etsy applies them, with worked examples and a live
          calculator.
        </p>
        <p className="mt-3 text-xs text-patina-muted">
          Updated <time dateTime={PILLAR_LAST_UPDATED}>{updatedLabel}</time> · Rates sourced from{" "}
          <a
            href="https://www.etsy.com/legal/fees/"
            target="_blank"
            rel="noopener nofollow"
            className="underline underline-offset-2 hover:text-patina-800"
          >
            Etsy&apos;s official Fees &amp; Payments policy
          </a>{" "}
          and{" "}
          <a
            href="https://help.etsy.com/hc/en-us/articles/360035902374-Etsy-Fee-Basics"
            target="_blank"
            rel="noopener nofollow"
            className="underline underline-offset-2 hover:text-patina-800"
          >
            Etsy Help: Fee Basics
          </a>
          .
        </p>
        <TrustStrip />
      </header>

      <section aria-labelledby="fee-summary" className="mb-10">
        <h2 id="fee-summary" className="mb-3 text-2xl font-bold text-patina-900 sm:text-3xl">
          The 2026 Etsy fee stack at a glance
        </h2>
        <p className="mb-5 text-patina-800/85">
          Every fee, the rate, when it applies, and what each one costs on a $30, $100, and $200
          sale. Skim it once — the sections below explain each fee in detail.
        </p>
        <div className="overflow-x-auto rounded-2xl ring-1 ring-patina-100">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-cream-100">
              <tr>
                <th className="border-b border-patina-200 px-3 py-3 text-left font-semibold text-patina-900">
                  Fee
                </th>
                <th className="border-b border-patina-200 px-3 py-3 text-left font-semibold text-patina-900">
                  Rate
                </th>
                <th className="border-b border-patina-200 px-3 py-3 text-left font-semibold text-patina-900">
                  When it applies
                </th>
                <th className="border-b border-patina-200 px-3 py-3 text-right font-semibold text-patina-900">
                  On $30
                </th>
                <th className="border-b border-patina-200 px-3 py-3 text-right font-semibold text-patina-900">
                  On $100
                </th>
                <th className="border-b border-patina-200 px-3 py-3 text-right font-semibold text-patina-900">
                  On $200
                </th>
              </tr>
            </thead>
            <tbody>
              {FEE_ROWS.map((row) => (
                <tr key={row.name} className="even:bg-cream-50/40">
                  <td className="border-b border-patina-100 px-3 py-3 font-semibold text-patina-900">
                    <a
                      href={row.anchor}
                      className="text-patina-800 underline underline-offset-2 hover:text-patina-900"
                    >
                      {row.name}
                    </a>
                  </td>
                  <td className="border-b border-patina-100 px-3 py-3 text-patina-800/90">
                    {row.rate}
                  </td>
                  <td className="border-b border-patina-100 px-3 py-3 text-patina-800/85">
                    {row.when}
                  </td>
                  <td className="border-b border-patina-100 px-3 py-3 text-right font-mono text-patina-800/90">
                    {row.on30}
                  </td>
                  <td className="border-b border-patina-100 px-3 py-3 text-right font-mono text-patina-800/90">
                    {row.on100}
                  </td>
                  <td className="border-b border-patina-100 px-3 py-3 text-right font-mono text-patina-800/90">
                    {row.on200}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-patina-muted">
          $30/$100/$200 examples assume item + shipping combined, US seller, Etsy Payments (3% +
          $0.25), Off-Site Ads attribution shown at the under-$10k rate.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-12">
        <h2 id="calculator" className="mb-3 text-2xl font-bold text-patina-900 sm:text-3xl">
          Run your own numbers
        </h2>
        <p className="mb-5 text-patina-800/85">
          Type your item price, shipping, and product cost below. The calculator layers every fee in
          the order Etsy applies them and shows your true net profit at the top.
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

      <section id="listing-fee" className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900 sm:text-3xl">
          1. Listing fee — $0.20 per item, per sale
        </h2>
        <p>
          Etsy charges a flat <strong className="text-patina-900">$0.20 listing fee</strong> each
          time a listing sells, and the listing renews automatically every 4 months whether the item
          sells or not. The $0.20 is identical regardless of price point — which is why it dominates
          the fee structure for low-priced items and barely registers on high-ticket orders.
        </p>
        <p>
          Multi-quantity listings get charged $0.20 per unit sold, not per order. If a buyer
          purchases 4 of the same listing in one order, you pay $0.80 in listing fees on that single
          transaction.
        </p>
        <p>
          <strong className="text-patina-900">Where it hurts most:</strong> sub-$10 physical and
          digital products. At a $4 sticker price the $0.20 listing fee alone is 5% of revenue
          before any percentage-based fee applies. See the math in detail for{" "}
          <Link
            href="/etsy-profit-margin/stickers"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            stickers
          </Link>
          ,{" "}
          <Link
            href="/etsy-profit-margin/svg-files"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            SVG cut files
          </Link>
          ,{" "}
          <Link
            href="/etsy-profit-margin/greeting-cards"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            greeting cards
          </Link>
          , and{" "}
          <Link
            href="/etsy-profit-margin/digital-stickers"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            digital planner stickers
          </Link>
          .
        </p>
        <p>
          <strong className="text-patina-900">The renewal trap:</strong> idle listings still cost
          money. A shop with 200 listings that don&apos;t sell pays $0.20 × 200 × 3 = $120/year in
          auto-renewal fees just to keep them visible. Periodically pruning low-performers is the
          most direct lever on this line item.
        </p>
      </section>

      <section id="transaction-fee" className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900 sm:text-3xl">
          2. Transaction fee — 6.5% of the entire order
        </h2>
        <p>
          The <strong className="text-patina-900">transaction fee is 6.5%</strong> of the total
          order amount — and the &quot;total&quot; is broader than most sellers expect. It includes
          the item price, shipping charged to the buyer, and any gift wrap charges. The 6.5% applies
          to the buyer-facing sum on the receipt.
        </p>
        <p>
          Charging shipping separately means the 6.5% applies to that shipping amount too. Many
          sellers reduce their effective fee rate by folding shipping into the item price and
          offering &quot;free&quot; shipping — same total to the buyer, fewer fee lines.
        </p>
        <p>
          <strong className="text-patina-900">Worked example:</strong> a $48 wood sign with $12
          shipping. Transaction fee = 6.5% × ($48 + $12) = $3.90. If the seller had priced at $60
          with free shipping instead, the transaction fee would still be 6.5% × $60 = $3.90. The
          line items reshuffle but Etsy&apos;s cut on this fee is identical — the difference shows
          up in the payment processing flat-fee and in how Off-Site Ads attribution interacts with
          shipping line items.
        </p>
        <p>
          See category-specific transaction-fee impact in our profit math for{" "}
          <Link
            href="/etsy-profit-margin/wedding-invitations"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            wedding invitations
          </Link>
          ,{" "}
          <Link
            href="/etsy-profit-margin/wood-signs"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            wood signs
          </Link>
          , and{" "}
          <Link
            href="/etsy-profit-margin/leather-goods"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            leather goods
          </Link>
          .
        </p>
      </section>

      <section id="payment-processing" className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900 sm:text-3xl">
          3. Payment processing fee — country-specific
        </h2>
        <p>
          Etsy Payments processes the buyer&apos;s card, and the processing fee varies by where your
          bank account is registered. The rate has two components: a percentage of the gross and a
          flat per-transaction fee. The flat fee is what eats low-priced products alive.
        </p>
        <ul className="my-3 space-y-2 rounded-2xl bg-white p-5 ring-1 ring-patina-100">
          <li>
            <strong className="text-patina-900">United States:</strong> 3% + $0.25
          </li>
          <li>
            <strong className="text-patina-900">United Kingdom:</strong> 4% + £0.20
          </li>
          <li>
            <strong className="text-patina-900">Canada:</strong> 3% + C$0.25
          </li>
          <li>
            <strong className="text-patina-900">Australia:</strong> 3% + A$0.25
          </li>
          <li>
            <strong className="text-patina-900">European Union:</strong> 4% + €0.30
          </li>
        </ul>
        <p>
          On a $4 single sticker, the $0.25 flat fee alone is 6.25% of revenue — meaning the
          effective fee rate for payment processing is 9.25%, not 3%. Bundle to outrun the flat fee:
          a 6-pack sticker set at $18 brings the effective payment-processing rate back down to
          about 4.4%.
        </p>
      </section>

      <section id="offsite-ads" className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900 sm:text-3xl">
          4. Off-Site Ads fee — the one that hurts (12% or 15%)
        </h2>
        <p>
          The Off-Site Ads fee is the single line item that most surprises new sellers. Etsy runs
          paid ads for your listings on external networks (Google, Facebook, Instagram, Pinterest,
          and others). If a buyer clicks one of those ads and purchases from your shop within 30
          days,{" "}
          <strong className="text-patina-900">
            Etsy charges you a 12% or 15% fee on the entire order — including shipping.
          </strong>
        </p>
        <p>The rate depends on your trailing 12-month revenue:</p>
        <ul className="my-3 space-y-2 rounded-2xl bg-white p-5 ring-1 ring-patina-100">
          <li>
            <strong className="text-patina-900">Under $10,000 trailing revenue:</strong> 15% on
            attributed sales. <em>You can opt out</em> in Shop Manager → Marketing → Offsite Ads.
          </li>
          <li>
            <strong className="text-patina-900">At or above $10,000:</strong> 12% on attributed
            sales. <em>Mandatory</em> — no opt-out available.
          </li>
        </ul>
        <p>
          The fee is <strong className="text-patina-900">capped at $100 per order</strong>, which
          matters most for high-ticket sellers. On a $1,500 wedding invitation suite, the uncapped
          15% would be $225; the cap pulls it down to $100. For luxury categories the cap
          effectively becomes a percentage cliff — items above ~$667 see the effective Off-Site Ads
          rate fall below 15%.
        </p>
        <p>
          <strong className="text-patina-900">Where it hurts most:</strong> POD apparel, low-margin
          handmade, and any category with 30%+ raw COGS. Our category profit math shows the bite
          clearly for{" "}
          <Link
            href="/etsy-profit-margin/custom-t-shirts-shipping-costs"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            print-on-demand t-shirts
          </Link>
          ,{" "}
          <Link
            href="/etsy-profit-margin/hoodies-pod"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            POD hoodies
          </Link>
          , and{" "}
          <Link
            href="/etsy-profit-margin/embroidery"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            custom embroidered apparel
          </Link>
          .
        </p>
        <p>
          <strong className="text-patina-900">Strategy:</strong> if you&apos;re under $10k, opt out.
          Etsy&apos;s external traffic is rarely the difference between a viable shop and a failing
          one for shops at that scale — but a 15% mandatory haircut on attributed sales absolutely
          is.
        </p>
      </section>

      <section id="currency-conversion" className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900 sm:text-3xl">
          5. Currency conversion fee — 2.5% when currencies differ
        </h2>
        <p>
          If you list in one currency but receive payouts in another (a US seller listing in EUR,
          say, to optimize discoverability for European buyers), Etsy charges{" "}
          <strong className="text-patina-900">2.5% on the converted amount</strong>. The conversion
          happens at Etsy&apos;s mid-market rate, which is generally fair, but the 2.5% is on top.
        </p>
        <p>
          Most US sellers ignore this fee because they list and bank in USD. International sellers,
          multi-currency shops, and US sellers experimenting with localized pricing should model it
          in the calculator before deciding the strategy is worth it.
        </p>
      </section>

      <section id="regulatory" className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900 sm:text-3xl">
          6. Regulatory operating fee — UK and Canada pass-through
        </h2>
        <p>
          Several jurisdictions levy a digital services tax (DST) on platforms like Etsy, and Etsy
          passes those costs through to sellers as a{" "}
          <strong className="text-patina-900">Regulatory Operating Fee</strong> of 0.25% to 1.1%
          depending on the country. Currently applies to shops in the UK, France, Italy, Spain, and
          Turkey, among others.
        </p>
        <p>
          The fee is calculated on the gross order amount (item + shipping) and appears as a
          separate line item in your Payment account. US, Canadian, and Australian sellers generally
          don&apos;t see this fee.
        </p>
      </section>

      <section className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900 sm:text-3xl">
          How much does Etsy take from a $5, $10, $20, $50, or $100 sale?
        </h2>
        <p>
          The effective fee rate isn&apos;t a fixed percentage — it varies sharply with order size
          because the flat fees ($0.20 listing + $0.25 processing) consume a larger percentage of
          small orders. We&apos;ve built dedicated breakdowns for the price points sellers ask about
          most:
        </p>
        <ul className="my-3 grid gap-2 sm:grid-cols-2">
          {DOLLAR_AMOUNTS.map((amount) => (
            <li key={amount}>
              <Link
                href={`/etsy-fees/${dollarSlug(amount)}`}
                className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
              >
                How much does Etsy take from a ${amount} sale?
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 max-w-3xl space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900 sm:text-3xl">
          How to lower your Etsy fees
        </h2>
        <p>Five levers actually move the needle. Most everything else is theater.</p>
        <ol className="my-3 list-decimal space-y-3 pl-6">
          <li>
            <strong className="text-patina-900">Opt out of Off-Site Ads while under $10k.</strong>{" "}
            This is the single largest lever. A 15-percentage-point fee on attributed sales
            disappears the moment you flip the toggle. Etsy makes this hard to find — Shop Manager →
            Marketing → Offsite Ads → Manage.
          </li>
          <li>
            <strong className="text-patina-900">Fold shipping into the item price.</strong> Same
            total to the buyer, but reduces line-item complexity and aligns with Etsy&apos;s
            &quot;free shipping&quot; preferred-listing weighting.
          </li>
          <li>
            <strong className="text-patina-900">Bundle low-priced items aggressively.</strong> The
            flat fees ($0.20 listing + $0.25 processing) dominate sub-$10 orders. A 4-pack of cards
            at $18 has dramatically better economics than four singles at $4.50.
          </li>
          <li>
            <strong className="text-patina-900">Prune dead listings.</strong> Idle listings renew
            every 4 months. A 200-listing shop with 70% non-sellers is paying $84/year just to keep
            dead inventory visible.
          </li>
          <li>
            <strong className="text-patina-900">Build off-Etsy channels for repeat buyers.</strong>{" "}
            Wholesale, Instagram DMs, your own Shopify — anything that brings a repeat customer back
            outside Etsy&apos;s ecosystem avoids the entire fee stack on subsequent orders.
          </li>
        </ol>
      </section>

      <GumroadCta variant="inline" source="pillar" className="mt-12" />

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-patina-900 sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {PILLAR_FAQ.map((f) => (
            <details key={f.q} className="quiet-card rounded-2xl p-5 ring-1 ring-patina-100/80">
              <summary className="cursor-pointer text-base font-semibold text-patina-900">
                {f.q}
              </summary>
              <p className="mt-3 text-patina-800/85">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-4 text-xl font-bold text-patina-900">Profit math by Etsy category</h2>
        <p className="mb-6 text-patina-800/85">
          Same fee stack, applied to specific seller niches with realistic price points and cost of
          goods. Each page pre-fills the calculator with that category&apos;s scenario.
        </p>
        <Link
          href="/#categories"
          className="inline-flex items-center gap-1 rounded-full bg-patina-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-patina-800"
        >
          Browse all categories
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <p className="mt-16 text-xs text-patina-muted">{siteConfig.trademarkDisclaimer}</p>
    </main>
  );
}
