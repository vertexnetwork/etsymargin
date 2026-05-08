import type { Metadata } from "next";
import Link from "next/link";
import { PrintifyCard } from "@/components/affiliates/PrintifyCard";
import { GumroadCta } from "@/components/affiliates/GumroadCta";

export const metadata: Metadata = {
  title: "Recommended tools for Etsy sellers — Etsy Margin",
  description:
    "The handful of tools we'd point an Etsy seller at to actually move their margin. Short list, honest commentary, no upsells.",
  alternates: { canonical: "/recommendations" },
  openGraph: {
    title: "Recommended tools for Etsy sellers",
    description:
      "A short, honest list of tools that move the margin needle for Etsy sellers.",
    type: "website",
  },
};

export default function RecommendationsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <header className="mb-8">
        <span className="inline-flex items-center rounded-full bg-lime-cream/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-patina-900 ring-1 ring-patina-200/50">
          Recommendations
        </span>
        <h1 className="mt-3 text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
          Tools we&apos;d point an Etsy seller at.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-patina-800/80 sm:text-lg">
          Short list. We only include tools that change the math the calculator
          shows. If something doesn&apos;t move your margin, it isn&apos;t here.
        </p>
      </header>

      <section className="mb-10 rounded-2xl bg-cream-100 p-5 ring-1 ring-patina-100/80 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-patina-700">
          Disclosure
        </h2>
        <p className="mt-2 text-sm text-patina-800/85">
          Some links on this page earn us a commission at no extra cost to you.
          We only list tools we&apos;d use ourselves. The math on the calculator
          never changes based on who pays us.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-patina-600">
          Print-on-demand
        </h2>
        <PrintifyCard source="recommendations" />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-patina-600">
          Pricing reference
        </h2>
        <GumroadCta variant="card" source="recommendations" />
      </section>

      <section className="mt-12 border-t border-patina-100 pt-8 text-sm text-patina-muted">
        <p>
          Want to see how a specific tool changes your numbers?{" "}
          <Link
            href="/"
            className="text-patina-700 underline underline-offset-2 hover:text-patina-900"
          >
            Open the calculator
          </Link>{" "}
          and run a before/after.
        </p>
      </section>
    </main>
  );
}
