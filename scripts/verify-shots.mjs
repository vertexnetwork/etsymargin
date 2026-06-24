// Focused verification of the four conversion fixes. Captures: home above-fold
// (consent bar + value-ladder line + craft motif), pSEO above-fold (consent bar
// no longer covering the calculator), and a clip of the category grid (to eyeball
// the hand-drawn craft icons). Writes to .playwright-screenshots/verify/.
import { chromium, devices } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = path.resolve(".playwright-screenshots/verify");
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

// Desktop — fresh context so consent is "unknown" and the bar renders.
const d = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const dp = await d.newPage();
await dp.goto(BASE + "/", { waitUntil: "load" });
await dp.waitForTimeout(1200);
await dp.screenshot({ path: path.join(OUT, "home-desktop-fold.png") });

await dp.goto(BASE + "/etsy-profit-margin/embroidery", { waitUntil: "load" });
await dp.waitForTimeout(1200);
await dp.screenshot({ path: path.join(OUT, "pseo-embroidery-desktop-fold.png") });

// Dismiss consent, then clip the category grid for a clean look at the icons.
await dp.click('button:has-text("Accept")');
await dp.goto(BASE + "/", { waitUntil: "load" });
const cat = dp.locator("#categories");
await cat.scrollIntoViewIfNeeded();
await dp.waitForTimeout(500);
await cat.screenshot({ path: path.join(OUT, "categories-desktop.png") });
await d.close();

// Mobile — fresh context, bar visible over the (now unobstructed) calculator.
const m = await browser.newContext(devices["iPhone 13"]);
const mp = await m.newPage();
await mp.goto(BASE + "/", { waitUntil: "load" });
await mp.waitForTimeout(1200);
await mp.screenshot({ path: path.join(OUT, "home-mobile-fold.png") });
await m.close();

await browser.close();
console.log("verify shots written to", OUT);
