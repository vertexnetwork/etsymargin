import type { Metadata } from "next";
import Link from "next/link";
import {
  LISTING_FEE,
  TRANSACTION_FEE_RATE,
  OFFSITE_ADS_RATE_UNDER_10K,
  OFFSITE_ADS_RATE_AT_10K,
  OFFSITE_ADS_FEE_CAP,
} from "@/lib/fees";

export const metadata: Metadata = {
  title: "About — Etsy Margin",
  description:
    "Why we built Etsy Margin, how the fee math works, and why everything runs in your browser.",
  alternates: { canonical: "/about" },
};

const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <header className="mb-10">
        <h1 className="text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
          About Etsy Margin
        </h1>
        <p className="mt-3 text-lg text-patina-800/80">
          A free, accurate, no-signup tool for Etsy sellers who want a clear
          answer to a simple question: <em>after every fee, what do I actually take home?</em>
        </p>
      </header>

      <section className="space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">What this is</h2>
        <p>
          Etsy stacks four to six fees on every sale. Spreadsheets miss them.
          Most calculators online stop at the transaction fee. We go all the
          way through: listing, transaction, payment processing, regulatory
          operating fees where applicable, and the punishing 12–15% Off-Site
          Ads cut.
        </p>
        <p>
          You get a single answer at the top — your true net profit and margin
          — and a waterfall chart showing exactly where every dollar goes.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Why we built it</h2>
        <p>
          Etsy&apos;s fee structure is genuinely deceptive. A seller searching
          for &quot;Etsy fee calculator&quot; or &quot;true profit after 15% off-site
          ad fee&quot; deserves a clear answer, not a lead-capture form. The math
          is simple. The clarity is rare.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">How the math works</h2>
        <p>
          Every fee is layered in the same order Etsy charges them. The current
          rates baked into the calculator:
        </p>
        <ul className="my-2 space-y-2 rounded-2xl bg-white p-5 ring-1 ring-patina-100">
          <li>
            <strong className="text-patina-900">Listing fee:</strong>{" "}
            ${LISTING_FEE.toFixed(2)} flat per listing.
          </li>
          <li>
            <strong className="text-patina-900">Transaction fee:</strong>{" "}
            {pct(TRANSACTION_FEE_RATE)} of (item price + shipping charged).
          </li>
          <li>
            <strong className="text-patina-900">Payment processing:</strong>{" "}
            country-specific. US: 3% + $0.25. UK: 4% + £0.20. EU: 4% + €0.30.
          </li>
          <li>
            <strong className="text-patina-900">Regulatory operating fee:</strong>{" "}
            applies to UK and Canadian shops where Etsy passes through
            digital-services-tax-style fees on the gross.
          </li>
          <li>
            <strong className="text-patina-900">Off-Site Ads:</strong>{" "}
            {pct(OFFSITE_ADS_RATE_UNDER_10K)} for shops under $10k trailing
            12-month revenue (opt-in), {pct(OFFSITE_ADS_RATE_AT_10K)} mandatory
            once you cross the threshold. Capped at ${OFFSITE_ADS_FEE_CAP} per order.
          </li>
        </ul>
        <p>
          Net profit = (item price + shipping charged) − all fees − manufacturing
          cost − actual shipping cost. True margin = net profit / item price.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Privacy</h2>
        <p>
          Every calculation runs in your browser. Your numbers never touch a
          server. There is no signup, no account, and no tracking pixel inside
          the calculator itself. We use Microsoft Clarity and Google Analytics
          for aggregate page-level traffic data on the marketing pages —
          standard, anonymous, and easy to block.
        </p>
        <p>
          Macro defaults (your country, off-site ads preference, $10k flag) are
          saved to your browser&apos;s localStorage so you don&apos;t reset them
          every visit. That data never leaves your device.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Get involved</h2>
        <p>
          Found a fee path we&apos;re modeling wrong? Have a country we should
          add? Email{" "}
          <a
            href="mailto:hello@etsymargin.tools"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            hello@etsymargin.tools
          </a>{" "}
          with a reproduction and we&apos;ll fix it. The fee math lives in a
          single, heavily-tested pure function.
        </p>
        <p>
          Want to embed the calculator on your blog or supplier site?{" "}
          <Link
            href="/embed"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            Grab the snippet here
          </Link>
          .
        </p>
      </section>

      <p className="mt-12 text-xs text-patina-700/60">
        Etsy is a registered trademark of Etsy, Inc. Etsy Margin is an
        independent tool and is not endorsed by, affiliated with, or sponsored
        by Etsy.
      </p>
    </main>
  );
}
