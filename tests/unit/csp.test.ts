import { describe, expect, it } from "vitest";
import { buildCSP, buildEmbedCSP } from "@/lib/csp";

describe("CSP builder", () => {
  it("locks frame-ancestors to none by default", () => {
    const csp = buildCSP({});
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain("frame-ancestors *");
  });

  it("opens frame-ancestors for the embed variant", () => {
    const csp = buildEmbedCSP({});
    expect(csp).toContain("frame-ancestors *");
    expect(csp).not.toContain("frame-ancestors 'none'");
  });

  it("adds Vercel insight hosts when analytics is on", () => {
    const csp = buildCSP({ vercelAnalytics: true, speedInsights: true });
    expect(csp).toContain("https://va.vercel-scripts.com");
    expect(csp).toContain("https://*.vercel-insights.com");
  });

  it("adds Clarity hosts only when consent is granted upstream", () => {
    const csp = buildCSP({ clarity: true });
    expect(csp).toContain("https://www.clarity.ms");
    const csp2 = buildCSP({});
    expect(csp2).not.toContain("clarity.ms");
  });

  it("does NOT include any ad-network host when provider is none", () => {
    const csp = buildCSP({ vercelAnalytics: true, ga4: true, clarity: true });
    expect(csp).not.toContain("googlesyndication.com");
    expect(csp).not.toContain("mediavine.com");
    expect(csp).not.toContain("carbonads");
  });

  it("includes object-src 'none' (defense-in-depth)", () => {
    expect(buildCSP({})).toContain("object-src 'none'");
  });

  it("frame-src includes 'self' when adsense is on (embed preview must work)", () => {
    // Regression: when adsense flips on in prod, the CSP previously
    // emitted `frame-src https://googleads.g.doubleclick.net` with no
    // 'self', which broke the /embed page's live preview that iframes
    // /embed/widget on the same origin. Pin the fix.
    const csp = buildCSP({ adsense: true });
    expect(csp).toMatch(/frame-src [^;]*'self'/);
    expect(csp).toContain("https://googleads.g.doubleclick.net");
  });
});
