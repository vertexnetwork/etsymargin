import type { Metadata } from "next";
import changelogData from "@/content/changelog.json";

export const metadata: Metadata = {
  title: "What's shipped — Etsy Margin",
  description:
    "Every commit landed on main, in order. Auto-generated from git history.",
  alternates: { canonical: "/changelog" },
};

type Entry = {
  hash: string;
  date: string;
  title: string;
};

const entries = changelogData as Entry[];

const monthLabel = (iso: string) => {
  // iso is YYYY-MM-DD; build a stable key + label without timezone drift.
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d
    .toLocaleDateString("en-US", { year: "numeric", month: "long" })
    .toUpperCase();
};

const dayLabel = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  );
};

function groupByMonth(rows: Entry[]) {
  const groups: Array<{ key: string; label: string; rows: Entry[] }> = [];
  for (const row of rows) {
    if (!row.date) continue;
    const key = row.date.slice(0, 7);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.rows.push(row);
    } else {
      groups.push({ key, label: monthLabel(row.date), rows: [row] });
    }
  }
  return groups;
}

export default function ChangelogPage() {
  const groups = groupByMonth(entries);

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <header className="mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-patina-muted">
          Changelog
        </span>
        <h1 className="mt-2 text-balance text-4xl font-bold leading-tight text-patina-900 sm:text-5xl">
          What&apos;s shipped
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-patina-800/80">
          Every commit landed on{" "}
          <code className="rounded bg-patina-50 px-1.5 py-0.5 font-mono text-base text-patina-800">
            main
          </code>
          , in order. Generated from git history at build time so it stays in
          sync with the repo without anyone hand-curating release notes.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.key} className="mb-10">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-patina-muted">
            {group.label}
          </h2>
          <ol className="border-t border-patina-100/70">
            {group.rows.map((entry) => (
              <li
                key={entry.hash}
                className="grid grid-cols-[max-content_1fr] items-baseline gap-x-5 border-b border-patina-100/70 py-3 sm:grid-cols-[max-content_1fr_max-content] sm:gap-x-8"
              >
                <time
                  dateTime={entry.date}
                  className="font-mono text-xs text-patina-muted"
                >
                  {dayLabel(entry.date)}
                </time>
                <span className="text-sm text-patina-900 sm:text-base">
                  {entry.title}
                </span>
                <code className="col-span-2 -mt-1 font-mono text-[11px] text-patina-muted sm:col-span-1 sm:mt-0 sm:text-right">
                  {entry.hash.slice(0, 7)}
                </code>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}
