import type { Metadata } from "next";
import changelogData from "@/content/changelog.json";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `What's shipped — ${siteConfig.name}`,
  description: "Every commit landed on main, in order. Auto-generated from git history.",
  alternates: { canonical: "/changelog" },
};

// Build-internal shape — `hash` is kept in JSON for idempotent merge in
// scripts/build-changelog.mjs but is never rendered to the page (Vertex
// spec §7: changelog must show date + title only, full notes link to
// GitHub Releases).
type Entry = {
  hash: string;
  date: string;
  title: string;
};

const entries = changelogData as Entry[];

const monthLabel = (iso: string) => {
  const [y, m] = iso.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" }).toUpperCase();
};

const dayLabel = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
        <span className="text-xs font-semibold uppercase tracking-widest text-(--color-muted)">
          Changelog
        </span>
        <h1 className="mt-2 text-balance text-4xl font-bold leading-tight text-(--color-on-bg) sm:text-5xl">
          What&apos;s shipped
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-(--color-on-bg)/80">
          Every commit landed on{" "}
          <code className="rounded bg-patina-50 px-1.5 py-0.5 font-mono text-base text-(--color-on-bg)">
            main
          </code>
          , in order. Generated from git history at build time so it stays in sync with the repo
          without anyone hand-curating release notes.{" "}
          <a
            href={`${siteConfig.repoUrl}/releases`}
            target="_blank"
            rel="noopener"
            className="text-(--color-accent) underline underline-offset-2 hover:text-(--color-on-bg)"
          >
            Long-form notes live on GitHub Releases →
          </a>
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.key} className="mb-10">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-(--color-muted)">
            {group.label}
          </h2>
          <ol className="border-t border-(--color-border)/70">
            {group.rows.map((entry) => (
              <li
                key={entry.hash}
                className="grid grid-cols-[max-content_1fr] items-baseline gap-x-5 border-b border-(--color-border)/70 py-3 sm:gap-x-8"
              >
                <time dateTime={entry.date} className="font-mono text-xs text-(--color-muted)">
                  {dayLabel(entry.date)}
                </time>
                <span className="text-sm text-(--color-on-bg) sm:text-base">{entry.title}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}
