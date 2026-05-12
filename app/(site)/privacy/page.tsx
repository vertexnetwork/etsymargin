import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const LAST_UPDATED = "2026-05-10";

export const metadata: Metadata = {
  title: `Privacy Policy — ${siteConfig.name}`,
  description: `How ${siteConfig.name} handles data, analytics, and your privacy.`,
  alternates: { canonical: "/privacy" },
};

const adProvider = siteConfig.features.ads.provider;
const adsEnabled = adProvider !== "none";
const proEnabled = siteConfig.features.proEnabled;
const emailEnabled = siteConfig.features.email.enabled;
const affiliateEnabled = siteConfig.features.affiliate.enabled;

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <header className="mb-10">
        <h1 className="text-balance text-3xl font-bold leading-tight text-(--color-on-bg) sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-(--color-muted)">
          Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
        </p>
      </header>

      <section className="space-y-4 text-(--color-on-bg)/85">
        <p>
          This Privacy Policy describes how <strong>{siteConfig.name}</strong> (
          <a href={siteConfig.url} className="text-(--color-accent) underline underline-offset-2">
            {siteConfig.url}
          </a>
          ) handles information when you use the site. {siteConfig.name} is operated independently
          as part of the Vertex Network.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-(--color-on-bg)">What we collect</h2>
        <p>
          <strong>By default, nothing.</strong> {siteConfig.name} is a tool, not an account-based
          service. You can use the entire site without signing in, providing an email, or otherwise
          identifying yourself. The calculator runs entirely in your browser — your inputs never
          reach our server.
        </p>

        <h3 className="mt-6 text-xl font-semibold text-(--color-on-bg)">Analytics</h3>
        <ul className="my-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Vercel Analytics</strong> — anonymous, cookieless page-view counts. No
            cross-site tracking.{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener"
              className="text-(--color-accent) underline underline-offset-2"
            >
              Vercel&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Vercel Speed Insights</strong> — aggregate Core Web Vitals telemetry. No
            personal data.
          </li>
          <li>
            <strong>Microsoft Clarity</strong> — session recordings and heatmaps. Loads{" "}
            <strong>only after you accept the cookie banner</strong>.{" "}
            <a
              href="https://privacy.microsoft.com"
              target="_blank"
              rel="noopener"
              className="text-(--color-accent) underline underline-offset-2"
            >
              Microsoft&apos;s privacy notice
            </a>
            .
          </li>
          <li>
            <strong>Google Analytics 4</strong> (when enabled) — aggregate traffic patterns. Loads
            only after consent. Anonymized IPs.
          </li>
        </ul>

        {emailEnabled && (
          <>
            <h3 className="mt-6 text-xl font-semibold text-(--color-on-bg)">Email capture</h3>
            <p>
              <strong>Resend</strong> — if you choose to subscribe to updates, your email address is
              forwarded to Resend.{" "}
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener"
                className="text-(--color-accent) underline underline-offset-2"
              >
                Resend&apos;s privacy policy
              </a>
              .
            </p>
          </>
        )}

        {proEnabled && (
          <>
            <h3 className="mt-6 text-xl font-semibold text-(--color-on-bg)">Payments</h3>
            <p>
              <strong>Stripe</strong> — if you upgrade to a paid tier, payment processing is handled
              by Stripe. {siteConfig.name} never sees your full card number.{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener"
                className="text-(--color-accent) underline underline-offset-2"
              >
                Stripe&apos;s privacy policy
              </a>
              .
            </p>
          </>
        )}

        {adsEnabled ? (
          <>
            <h3 className="mt-6 text-xl font-semibold text-(--color-on-bg)">Advertising</h3>
            <p>
              <strong>{adProvider}</strong> — third-party ads may be served on this site. The ad
              provider may set cookies for ad personalization. You can opt out of personalized
              advertising at{" "}
              <a
                href="https://www.aboutads.info/choices"
                target="_blank"
                rel="noopener"
                className="text-(--color-accent) underline underline-offset-2"
              >
                aboutads.info/choices
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <h3 className="mt-6 text-xl font-semibold text-(--color-on-bg)">Advertising</h3>
            <p>
              {siteConfig.name} runs <strong>no third-party display ads</strong>. We monetize via
              the optional <em>2026 Etsy Pricing Bible</em> PDF on Gumroad, and via
              clearly-disclosed affiliate links to tools that lower your Etsy fees.
            </p>
          </>
        )}

        {affiliateEnabled && (
          <>
            <h3 className="mt-6 text-xl font-semibold text-(--color-on-bg)">Affiliate links</h3>
            <p>
              Some outbound links — currently to Printify, our recommended print-on-demand supplier
              — are affiliate links. If you make a purchase through one of those links,{" "}
              {siteConfig.name} may earn a commission at no extra cost to you. Affiliate status is
              disclosed inline on every page where these links appear.
            </p>
          </>
        )}

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">What we don&apos;t do</h2>
        <ul className="my-3 list-disc space-y-2 pl-6">
          <li>
            <strong>No selling data.</strong> We don&apos;t sell, lease, or transfer information
            about visitors to anyone.
          </li>
          <li>
            <strong>No cross-site tracking on calculator inputs.</strong> What you type into the
            calculator stays in your browser unless you explicitly share or save it.
          </li>
          <li>
            <strong>No fingerprinting.</strong> No device fingerprinting libraries; no canvas/font
            fingerprinting.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">Cookies</h2>
        <p>{siteConfig.name} uses cookies only for:</p>
        <ol className="my-3 list-decimal space-y-2 pl-6">
          <li>Remembering your cookie-banner choice (so we don&apos;t ask you again).</li>
          <li>Loading Microsoft Clarity (only if you accepted).</li>
          <li>
            Calculator macro defaults (country, off-site ads preference, $10k flag) — stored in{" "}
            <code>localStorage</code>, not cookies.
          </li>
        </ol>

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">Your rights</h2>
        <p>
          You can clear all site data at any time via your browser&apos;s site settings. There is no
          account to delete.
        </p>
        <p>
          If you have a privacy question, email{" "}
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="text-(--color-accent) underline underline-offset-2"
          >
            {siteConfig.supportEmail}
          </a>
          .
        </p>

        <h2 className="mt-10 text-2xl font-bold text-(--color-on-bg)">Changes to this policy</h2>
        <p>
          If we materially change how data is handled, we&apos;ll update this page and the
          &quot;Last updated&quot; date above. Substantive changes will also be noted in the{" "}
          <Link href="/changelog" className="text-(--color-accent) underline underline-offset-2">
            changelog
          </Link>
          .
        </p>

        <p className="mt-12 text-xs text-(--color-muted)">
          {siteConfig.name} is part of the Vertex Network. Each site in the network publishes its
          own privacy policy.
        </p>
      </section>
    </main>
  );
}
