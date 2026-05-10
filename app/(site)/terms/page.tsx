import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const LAST_UPDATED = "2026-05-10";

export const metadata: Metadata = {
  title: `Terms of Use — ${siteConfig.name}`,
  description: `Terms governing your use of ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

const affiliateEnabled = siteConfig.features.affiliate.enabled;
const proEnabled = siteConfig.features.proEnabled;
const embedEnabled = siteConfig.features.embed.enabled;

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <header className="mb-10">
        <h1 className="text-balance text-3xl font-bold leading-tight text-(--color-on-bg) sm:text-4xl">
          Terms of Use
        </h1>
        <p className="mt-3 text-sm text-(--color-muted)">
          Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
        </p>
      </header>

      <section className="space-y-4 text-(--color-on-bg)/85">
        <p>
          By using <strong>{siteConfig.name}</strong> (
          <a
            href={siteConfig.url}
            className="text-(--color-accent) underline underline-offset-2"
          >
            {siteConfig.url}
          </a>
          ), you agree to these terms. {siteConfig.name} is provided as-is by
          an independent maintainer as part of the Vertex Network.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-(--color-on-bg)">
          What this site is
        </h2>
        <p>
          {siteConfig.name} is a <strong>tool</strong>. It produces calculations
          based on the inputs you provide and Etsy&apos;s published 2026 fee
          schedule. Outputs are best-effort and intended as guidance, not
          authoritative pricing or accounting advice.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">
          What this site isn&apos;t
        </h2>
        <ul className="my-3 list-disc space-y-2 pl-6">
          <li>
            Affiliated with, endorsed by, or partnered with Etsy, Inc. or any
            other platform or trademark referenced on the site.
          </li>
          <li>
            A substitute for professional advice (legal, financial, accounting,
            or otherwise). Verify with a qualified human before making material
            pricing or business decisions.
          </li>
          <li>A guaranteed-uptime service. Best-effort hosting on Vercel.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">
          Trademarks
        </h2>
        <p>{siteConfig.trademarkDisclaimer}</p>
        <p>
          Any other third-party brand names, logos, or trademarks referenced on
          {" "}
          {siteConfig.name} are the property of their respective owners. Their
          use here is for descriptive or interoperability purposes only and
          does not imply endorsement.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">
          Acceptable use
        </h2>
        <p>Use {siteConfig.name} for any lawful purpose. Don&apos;t:</p>
        <ul className="my-3 list-disc space-y-2 pl-6">
          <li>Attempt to break, abuse, or overload the service.</li>
          <li>
            Scrape or re-host the site&apos;s content in bulk without
            permission.
          </li>
          {embedEnabled && (
            <li>
              Use the embeddable calculator widget in a way that misrepresents
              the calculator&apos;s outputs or this site&apos;s independence
              from Etsy.
            </li>
          )}
        </ul>

        {affiliateEnabled && (
          <>
            <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">
              Affiliate links
            </h2>
            <p>
              Some outbound links on {siteConfig.name} are affiliate links. If
              you make a purchase via one of those links, the site may receive
              a small commission <strong>at no additional cost to you</strong>.
              We only link to products we&apos;d recommend independent of the
              affiliate relationship. See our{" "}
              <Link
                href="/privacy"
                className="text-(--color-accent) underline underline-offset-2"
              >
                Privacy Policy
              </Link>{" "}
              for the full disclosure.
            </p>
          </>
        )}

        {proEnabled && (
          <>
            <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">
              Paid plans
            </h2>
            <p>
              If you purchase a paid tier, billing is handled by Stripe.
              Refunds are governed by Stripe&apos;s processing rules and our
              refund policy at {siteConfig.url}/refund. Cancel anytime via the
              account portal; cancellation takes effect at the end of the
              current billing period.
            </p>
          </>
        )}

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">
          Calculator accuracy
        </h2>
        <p>
          The fee math reflects Etsy&apos;s published 2026 fee schedule as of
          the &quot;Last updated&quot; date at the top of this page. Etsy can
          change fee rates, country-specific charges, regulatory operating
          fees, and Off-Site Ads thresholds at any time. We update the
          calculator when we learn of changes; we don&apos;t guarantee
          real-time accuracy. Always cross-check critical pricing decisions
          against your Etsy seller dashboard.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">
          Disclaimer of warranties
        </h2>
        <p>
          {siteConfig.name} is provided <strong>&quot;as is&quot;</strong>{" "}
          without warranties of any kind, express or implied. The maintainer
          makes no representation that the calculations or any other output is
          accurate, complete, or fit for any particular purpose.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">
          Limitation of liability
        </h2>
        <p>
          To the fullest extent permitted by law, the maintainer is not liable
          for any indirect, incidental, consequential, or special damages
          arising out of or related to your use of {siteConfig.name}.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">
          Changes to these terms
        </h2>
        <p>
          If these terms materially change, we&apos;ll update this page and
          the &quot;Last updated&quot; date above. Material changes will also
          be noted in the{" "}
          <Link
            href="/changelog"
            className="text-(--color-accent) underline underline-offset-2"
          >
            changelog
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">
          Contact
        </h2>
        <p>
          Questions about these terms:{" "}
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="text-(--color-accent) underline underline-offset-2"
          >
            {siteConfig.supportEmail}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
