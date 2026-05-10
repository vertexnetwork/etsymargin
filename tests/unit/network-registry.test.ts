import { describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";

type Site = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  audience: string;
  tags: string[];
  status: "live" | "soon";
};

describe("public/network.json", () => {
  it("matches the canonical Property shape spec §7", async () => {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "network.json"),
      "utf8",
    );
    const manifest = JSON.parse(raw) as {
      version: string;
      brand: string;
      sites: Site[];
    };
    expect(manifest.version).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);
    expect(Array.isArray(manifest.sites)).toBe(true);
    expect(manifest.sites.length).toBeGreaterThan(0);
    for (const s of manifest.sites) {
      expect(s.slug, `slug missing for ${s.name}`).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.domain).not.toMatch(/^https?:/);
      expect(s.url).toMatch(/^https?:\/\//);
      expect(s.tagline.length, `tagline too long: ${s.slug}`).toBeLessThanOrEqual(80);
      expect(s.description.length, `description too long: ${s.slug}`).toBeLessThanOrEqual(160);
      expect(["live", "soon"]).toContain(s.status);
    }
  });

  it("includes etsymargin (the current spoke is registered in the hub)", async () => {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "network.json"),
      "utf8",
    );
    const manifest = JSON.parse(raw) as { sites: Site[] };
    const self = manifest.sites.find((s) => s.slug === "etsymargin");
    expect(self).toBeDefined();
  });
});
