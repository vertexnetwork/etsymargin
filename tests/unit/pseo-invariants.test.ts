import { describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PSEO_ENTRIES } from "@/lib/pseo/data";

// Build-time invariants for the pSEO catalog. Spec §8 — every entry must
// satisfy the SEO/quality contract before it ships.

describe("pSEO catalog invariants", () => {
  it("meta titles are ≤ 60 chars", () => {
    for (const e of PSEO_ENTRIES) {
      expect(e.title.length, `slug: ${e.slug}`).toBeLessThanOrEqual(60);
    }
  });

  it("meta descriptions are ≤ 155 chars", () => {
    for (const e of PSEO_ENTRIES) {
      expect(e.metaDescription.length, `slug: ${e.slug}`).toBeLessThanOrEqual(
        155,
      );
    }
  });

  it("FAQ questions are unique within an entry", () => {
    for (const e of PSEO_ENTRIES) {
      const seen = new Set<string>();
      for (const f of e.faq) {
        const key = f.q.trim().toLowerCase();
        expect(seen.has(key), `dup FAQ q in ${e.slug}: ${f.q}`).toBe(false);
        seen.add(key);
      }
    }
  });

  it("slugs are unique across the catalog", () => {
    const seen = new Set<string>();
    for (const e of PSEO_ENTRIES) {
      expect(seen.has(e.slug), `duplicate slug: ${e.slug}`).toBe(false);
      seen.add(e.slug);
    }
  });

  it("each MDX body that exists is ≥ 250 words (long-tail slugs may ship hero-only)", async () => {
    const dir = path.join(process.cwd(), "content", "pseo");
    let checked = 0;
    for (const e of PSEO_ENTRIES) {
      const file = path.join(dir, `${e.slug}.mdx`);
      let raw: string;
      try {
        raw = await fs.readFile(file, "utf8");
      } catch {
        // Long-tail entries are allowed to ship without an MDX body;
        // the slug page renders calculator + FAQ + breadcrumb regardless.
        continue;
      }
      checked += 1;
      const words = raw
        .replace(/```[\s\S]*?```/g, "")
        .replace(/[#*_`>~|\[\]()-]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
      expect(words.length, `slug: ${e.slug}`).toBeGreaterThanOrEqual(250);
    }
    // Sanity floor — at least the original 20 long-form entries should
    // still have MDX bodies.
    expect(checked, "at least 20 long-form pSEO entries should have MDX").toBeGreaterThanOrEqual(20);
  });
});
