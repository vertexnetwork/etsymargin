// Build content/changelog.json from `git log`. Idempotent + merge-safe:
// re-running on a shallow clone (e.g., Vercel) won't drop entries the
// committed JSON already has — we union by commit hash.
//
// Usage: `node scripts/build-changelog.mjs` (also wired as `prebuild`).

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const OUT = resolve("content/changelog.json");

const FIELD = "\x1f";
const RECORD = "\x1e";

function readGitLog() {
  const fmt = `%H${FIELD}%aI${FIELD}%s${FIELD}%b${RECORD}`;
  let raw;
  try {
    raw = execSync(
      `git log --no-merges --pretty=format:"${fmt}"`,
      { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
    );
  } catch {
    return [];
  }
  return raw
    .split(RECORD)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((rec) => {
      const [hash, date, subject, body = ""] = rec.split(FIELD);
      return { hash, date, subject, body };
    });
}

function parseBody(body) {
  const lines = body
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s && !/^Co-Authored-By:/i.test(s));
  const bullets = lines
    .filter((l) => /^[-*•]\s+/.test(l))
    .map((l) => l.replace(/^[-*•]\s+/, ""));
  if (bullets.length) return { summary: "", changes: bullets };
  return { summary: lines.join(" "), changes: [] };
}

function readExisting() {
  if (!existsSync(OUT)) return [];
  try {
    const data = JSON.parse(readFileSync(OUT, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function build() {
  const fromGit = readGitLog();
  const merged = new Map();
  for (const e of readExisting()) merged.set(e.hash, e);
  for (const c of fromGit) {
    const { summary, changes } = parseBody(c.body);
    merged.set(c.hash, {
      hash: c.hash,
      date: (c.date || "").slice(0, 10),
      title: c.subject,
      summary,
      changes,
    });
  }
  return Array.from(merged.values()).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

const entries = build();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(entries, null, 2) + "\n", "utf8");
console.log(`changelog: wrote ${entries.length} entries → ${OUT}`);
