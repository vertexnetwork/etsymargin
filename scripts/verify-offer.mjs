// Clips the CustomCat affiliate card on the embroidery pSEO page to confirm the
// promotional offer callout renders. Writes to .playwright-screenshots/verify/.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = path.resolve(".playwright-screenshots/verify");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/etsy-profit-margin/embroidery", { waitUntil: "load" });
await page.waitForTimeout(1000);
const card = page.locator('section:has-text("Lower your embroidery cost with CustomCat")').first();
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await card.screenshot({ path: path.join(OUT, "customcat-card.png") });
await browser.close();
console.log("customcat-card.png written");
