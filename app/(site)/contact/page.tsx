import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `How to reach ${siteConfig.name}: feedback, fee corrections, embed questions.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
      <header className="mb-8">
        <h1 className="text-balance text-3xl font-bold leading-tight text-(--color-on-bg) sm:text-4xl">
          Contact
        </h1>
        <p className="mt-3 text-lg text-(--color-on-bg)/80">
          One inbox, no form, no auto-reply queue.
        </p>
      </header>

      <section className="quiet-card rounded-2xl p-6 ring-1 ring-(--color-border)/80 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-(--color-muted)">
          Email
        </p>
        <a
          href={`mailto:${siteConfig.supportEmail}`}
          className="mt-2 inline-flex break-all text-2xl font-bold text-(--color-accent) underline underline-offset-4 hover:text-(--color-on-bg) sm:text-3xl"
        >
          {siteConfig.supportEmail}
        </a>
        <p className="mt-4 text-sm text-(--color-on-bg)/80">
          We typically reply within two business days. Faster if your message contains a
          reproducible fee-math correction with a link to the Etsy help page that documents the rate
          you&apos;re flagging.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-(--color-on-bg)/85">
        <h2 className="text-xl font-bold text-(--color-on-bg)">What we&apos;d love to hear</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Fee math we&apos;re modeling wrong — please link the Etsy help-page URL so we can verify
            and patch in one round trip.
          </li>
          <li>
            A country we should add to the country selector (currently US, UK, Canada, Australia,
            EU).
          </li>
          <li>
            Embed bugs (the iframe at <code>/embed/widget</code> behaves unexpectedly on a host
            theme).
          </li>
          <li>Press, podcast, or syndication requests.</li>
        </ul>
        <h2 className="mt-6 text-xl font-bold text-(--color-on-bg)">Security</h2>
        <p>
          For security reports, use{" "}
          <a
            href={siteConfig.security.contact}
            className="text-(--color-accent) underline underline-offset-2"
          >
            {siteConfig.security.contact.replace(/^mailto:/, "")}
          </a>{" "}
          (RFC 9116 contact at{" "}
          <Link
            href="/.well-known/security.txt"
            className="text-(--color-accent) underline underline-offset-2"
          >
            /.well-known/security.txt
          </Link>
          ).
        </p>
      </section>

      <p className="mt-12 text-xs text-(--color-muted)">{siteConfig.trademarkDisclaimer}</p>
    </main>
  );
}
