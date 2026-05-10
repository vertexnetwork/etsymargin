import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/about", "/privacy", "/terms", "/contact", "/network"];

// Axe-core a11y scan. Spec §15 PREMIUM tier. Fails the build on any
// "serious" or "critical" violation; warnings on lower severities so
// designers can fix iteratively without blocking deploys.

test.describe("a11y — axe-core", () => {
  for (const path of ROUTES) {
    test(`no critical/serious violations: ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      if (blocking.length) {
        console.error(JSON.stringify(blocking, null, 2));
      }
      expect(blocking).toEqual([]);
    });
  }
});
