import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — Etsy Margin",
  description:
    "What's changed in the Etsy Margin calculator: fee math updates, new categories, UX fixes.",
  alternates: { canonical: "/changelog" },
};

type ChangelogEntry = {
  date: string;
  version: string;
  title: string;
  changes: string[];
};

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-05-07",
    version: "0.2.0",
    title: "UX forensic pass + Microsoft Clarity",
    changes: [
      "Fixed waterfall chart so the negative net-profit bar actually renders when you're losing money on an order.",
      "Replaced Recharts with a hand-rolled SVG waterfall — saved ~90KB gzipped, mobile labels no longer collide.",
      "Synchronously hydrate URL params + localStorage so prefilled pSEO scenarios stop flashing the homepage default.",
      "Number inputs no longer fight a leading zero — select-on-focus + raw string state.",
      "$10k revenue checkbox now disables itself when Off-Site Ads is off.",
      "Mobile hero collapsed so the calculator clears the fold on iPhone SE; added a visible \"see my real profit\" anchor.",
      "Wired Microsoft Clarity for session replay and heatmaps (gated on env var).",
    ],
  },
  {
    date: "2026-05-01",
    version: "0.1.0",
    title: "Initial MVP",
    changes: [
      "First version of the Etsy Margin calculator: deterministic client-side fee math.",
      "20 programmatic-SEO category pages with prefilled scenarios (digital downloads, t-shirts, candles, etc.).",
      "URL share links — every input is in the query string.",
      "GA4 event tracking, JSON-LD for SoftwareApplication and FAQ schemas.",
      "Mediavine ad slots reserved (inactive until traffic threshold).",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <header className="mb-10">
        <h1 className="text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
          Changelog
        </h1>
        <p className="mt-3 text-lg text-patina-800/80">
          What&apos;s changed in the Etsy Margin calculator. Most-recent first.
        </p>
      </header>

      <ol className="space-y-10">
        {CHANGELOG.map((entry) => (
          <li
            key={entry.version}
            className="relative rounded-2xl bg-white p-6 ring-1 ring-patina-100"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="rounded-full bg-patina-50 px-2.5 py-0.5 text-xs font-semibold text-patina-700 ring-1 ring-patina-100">
                v{entry.version}
              </span>
              <time
                dateTime={entry.date}
                className="text-xs text-patina-muted"
              >
                {new Date(entry.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <h2 className="mt-2 text-xl font-bold text-patina-900">
              {entry.title}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-patina-800/85">
              {entry.changes.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </main>
  );
}
