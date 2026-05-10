import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/site-config";

describe("siteConfig keystone", () => {
  it("has populated identity fields", () => {
    expect(siteConfig.name).toBeTruthy();
    expect(siteConfig.shortName.length).toBeLessThanOrEqual(12);
    expect(siteConfig.domain).not.toMatch(/^https?:/);
    expect(siteConfig.url).toMatch(/^https?:\/\//);
    expect(siteConfig.url.endsWith("/"), "url must not end with /").toBe(false);
  });

  it("legal nav has all three required pages", () => {
    const hrefs = siteConfig.nav.footer.legal.map((l) => l.href);
    expect(hrefs).toContain("/privacy");
    expect(hrefs).toContain("/terms");
    expect(hrefs).toContain("/contact");
  });

  it("ad provider is 'none' for this spoke", () => {
    // Etsy Margin deliberately runs no display ads; if this assertion
    // ever fires, someone's flipped a flag without updating the project
    // memory. See memory/project_etsymargin_no_onsite_ads.md.
    expect(siteConfig.features.ads.provider).toBe("none");
  });

  it("supportEmail is a valid mailto target", () => {
    expect(siteConfig.supportEmail).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  it("security expires within reasonable RFC 9116 window", () => {
    const expires = new Date(siteConfig.security.expires).getTime();
    const now = Date.now();
    expect(expires).toBeGreaterThan(now);
    // RFC 9116 recommends ≤ 1y; we set a generous floor of 6mo.
    const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;
    expect(expires - now).toBeGreaterThan(sixMonths);
  });
});
