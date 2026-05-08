import type { Metadata } from "next";
import { NetworkCollectionJsonLd } from "@/components/seo/JsonLd";
import { NETWORK_TOOLS } from "@/lib/network";

export const metadata: Metadata = {
  title: "The Vertex Network — Etsy Margin",
  description:
    "A small family of independent web tools we build. Etsy Margin is one. Here are the others.",
  alternates: { canonical: "/network" },
  openGraph: {
    title: "The Vertex Network",
    description:
      "A small family of independent web tools. Etsy Margin is one of them.",
    type: "website",
  },
};

export default function NetworkPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <NetworkCollectionJsonLd tools={NETWORK_TOOLS} />

      <header className="mb-10">
        <span className="inline-flex items-center rounded-full bg-lime-cream/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-patina-900 ring-1 ring-patina-200/50">
          Vertex Network
        </span>
        <h1 className="mt-3 text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
          A small family of tools we&apos;ve built.
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-patina-800/80">
          Etsy Margin is one of several independent web tools we operate. Each
          one solves a single, specific problem for the people using it. No
          accounts, no upsells, no shared infrastructure — just standalone
          calculators and utilities.
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-patina-muted">
          Tools in the network
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {NETWORK_TOOLS.map((tool) => (
            <li key={tool.domain}>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener"
                className="quiet-card group block rounded-xl px-4 py-4 ring-1 ring-patina-100/80 transition hover:ring-patina-300"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-lg font-bold text-patina-900">
                    {tool.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-patina-muted transition group-hover:text-patina-700"
                  >
                    ↗
                  </span>
                </div>
                <span className="mt-1 block text-xs uppercase tracking-wider text-patina-muted">
                  {tool.domain}
                </span>
                <p className="mt-2 text-sm text-patina-800/85">
                  {tool.tagline}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4 text-patina-800/85">
        <h2 className="text-2xl font-bold text-patina-900">Why a network?</h2>
        <p>
          Each tool runs as its own product on its own domain. We don&apos;t
          force a unified login or pretend they&apos;re a suite — they
          aren&apos;t. The network page exists so you can find the others if
          one of them is useful to you.
        </p>
        <p>
          New tools get added here as we ship them. If you want to know when
          that happens, the{" "}
          <a
            href="/changelog"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            changelog
          </a>{" "}
          is the canonical record for this site.
        </p>
      </section>
    </main>
  );
}
