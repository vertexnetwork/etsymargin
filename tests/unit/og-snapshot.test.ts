import { describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";

// OG snapshot — pin the visible copy + brand identifiers in
// app/opengraph-image.tsx so a stray refactor that strips brand strings
// or hardcodes a value over a siteConfig read surfaces in the unit tests
// instead of a Twitter preview a week later.
//
// We assert on source-file content rather than rendering through next/og,
// because next/og's ImageResponse needs the edge runtime + a JSX runtime
// vitest doesn't ship by default.

describe("opengraph-image source", () => {
  it("imports siteConfig and references brand fields by name", async () => {
    const src = await fs.readFile(
      path.join(process.cwd(), "app", "opengraph-image.tsx"),
      "utf8",
    );
    expect(src).toContain('from "@/lib/site-config"');
    expect(src).toMatch(/siteConfig\.name/);
    expect(src).toMatch(/siteConfig\.tagline/);
    expect(src).toMatch(/siteConfig\.domain/);
  });

  it("does not hardcode the etsymargin domain string", async () => {
    const src = await fs.readFile(
      path.join(process.cwd(), "app", "opengraph-image.tsx"),
      "utf8",
    );
    // The domain literal is allowed to appear in comments but not in the
    // visible output. Strip block comments and line comments before grep.
    const stripped = src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    expect(stripped).not.toContain("etsymargin.tools");
  });

  it("the apple-icon and twitter-image follow the same pattern", async () => {
    const apple = await fs.readFile(
      path.join(process.cwd(), "app", "apple-icon.tsx"),
      "utf8",
    );
    expect(apple).toContain('from "@/lib/site-config"');

    const twitter = await fs.readFile(
      path.join(process.cwd(), "app", "twitter-image.tsx"),
      "utf8",
    );
    // Twitter image re-exports the OG image so a single source of truth
    // controls both. The file should be a thin re-export, not a copy.
    expect(twitter.length, "twitter-image should be a re-export").toBeLessThan(500);
    expect(twitter).toContain("./opengraph-image");
  });
});
