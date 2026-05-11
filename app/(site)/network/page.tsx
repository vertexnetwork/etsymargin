import type { Metadata } from "next";
import { NetworkCollectionJsonLd } from "@/components/seo/JsonLd";
import { loadSisterSites } from "@/lib/network";
import { siteConfig } from "@/lib/site-config";
import { VertexFooterLink } from "@/components/analytics/VertexFooterLink";

export const metadata: Metadata = {
  title: `The Vertex Network — ${siteConfig.name}`,
  description: `A small family of independent web tools. ${siteConfig.name} is one of them.`,
  alternates: { canonical: "/network" },
  openGraph: {
    title: "The Vertex Network",
    description: `A small family of independent web tools. ${siteConfig.name} is one of them.`,
    type: "website",
  },
};

export default async function NetworkPage() {
  const sisters = await loadSisterSites();
  const liveSisters = sisters.filter((s) => s.status === "live");

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <NetworkCollectionJsonLd tools={sisters} />

      <header className="mb-10">
        <span className="inline-flex items-center rounded-full bg-lime-cream/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-(--color-on-bg) ring-1 ring-(--color-border)/50">
          Vertex Network
        </span>
        <h1 className="mt-3 text-balance text-3xl font-bold leading-tight text-(--color-on-bg) sm:text-4xl">
          A small family of tools we&apos;ve built.
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-(--color-on-bg)/80">
          {siteConfig.name} is one of {liveSisters.length + 1} independent web tools we operate.
          Each one solves a single, specific problem for the people using it. No accounts, no
          upsells, no shared infrastructure — just standalone calculators and utilities.
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-(--color-muted)">
          Tools in the network
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {sisters.map((tool) => (
            <li key={tool.domain}>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener"
                className="quiet-card group block rounded-xl px-4 py-4 ring-1 ring-(--color-border)/80 transition hover:ring-(--color-accent)"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-lg font-bold text-(--color-on-bg)">
                    {tool.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-(--color-muted) transition group-hover:text-(--color-accent)"
                  >
                    ↗
                  </span>
                </div>
                <span className="mt-1 block text-xs uppercase tracking-wider text-(--color-muted)">
                  {tool.domain}
                </span>
                <p className="mt-2 text-sm text-(--color-on-bg)/85">{tool.tagline}</p>
                {tool.status === "soon" && (
                  <span className="mt-2 inline-block rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-(--color-muted)">
                    Coming soon
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4 text-(--color-on-bg)/85">
        <h2 className="text-2xl font-bold text-(--color-on-bg)">Why a network?</h2>
        <p>
          Each tool runs as its own product on its own domain. We don&apos;t force a unified login
          or pretend they&apos;re a suite — they aren&apos;t. The network page exists so you can
          find the others if one of them is useful to you.
        </p>
        <p>
          New tools get added here as we ship them. If you want to know when that happens, the{" "}
          <VertexFooterLink
            href="/changelog"
            className="text-(--color-accent) underline underline-offset-2 hover:text-(--color-on-bg)"
          >
            changelog
          </VertexFooterLink>{" "}
          is the canonical record for this site.
        </p>
      </section>
    </main>
  );
}
