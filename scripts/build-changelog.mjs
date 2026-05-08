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
  const fromGitHashes = new Set(fromGit.map((c) => c.hash));
  // Oldest commit date currently in git's view. On a shallow clone this is
  // recent; on a full clone it's the repo's first commit.
  const oldestGitDate = fromGit.length
    ? fromGit.reduce(
        (min, c) => (c.date && c.date < min ? c.date : min),
        fromGit[0].date,
      ).slice(0, 10)
    : null;

  const merged = new Map();
  // Carry forward existing entries only when (a) git still recognises them,
  // or (b) they predate git's window (shallow-clone fallback). Anything else
  // was rewritten/dropped from history and should not survive.
  for (const e of readExisting()) {
    if (fromGitHashes.has(e.hash)) {
      merged.set(e.hash, e);
    } else if (oldestGitDate && e.date && e.date < oldestGitDate) {
      merged.set(e.hash, e);
    }
  }
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
