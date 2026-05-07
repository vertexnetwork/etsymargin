import type { Metadata } from "next";
import changelogData from "@/content/changelog.json";

export const metadata: Metadata = {
  title: "Changelog — Etsy Margin",
  description:
    "What's changed in the Etsy Margin calculator: fee math updates, new categories, UX fixes.",
  alternates: { canonical: "/changelog" },
};

type Entry = {
  hash: string;
  date: string;
  title: string;
  summary: string;
  changes: string[];
};

const entries = changelogData as Entry[];

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <header className="mb-10">
        <h1 className="text-balance text-3xl font-bold leading-tight text-patina-900 sm:text-4xl">
          Changelog
        </h1>
        <p className="mt-3 text-lg text-patina-800/80">
          What&apos;s changed in the Etsy Margin calculator. Most recent first.
        </p>
      </header>

      <ol className="space-y-10">
        {entries.map((entry) => (
          <li
            key={entry.hash}
            className="quiet-card relative rounded-2xl p-6 ring-1 ring-patina-100/80"
          >
            <time
              dateTime={entry.date}
              className="text-xs font-medium uppercase tracking-wider text-patina-muted"
            >
              {new Date(entry.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h2 className="mt-2 text-xl font-bold text-patina-900">
              {entry.title}
            </h2>
            {entry.summary && (
              <p className="mt-3 text-patina-800/85">{entry.summary}</p>
            )}
            {entry.changes.length > 0 && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-patina-800/85">
                {entry.changes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}
