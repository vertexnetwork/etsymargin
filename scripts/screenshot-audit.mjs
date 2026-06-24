// One-off conversion-audit screenshotter. Captures the home page, every
// header/footer link target, and a few pSEO spokes (one per affiliate variant)
// at desktop + mobile, full-page, into .playwright-screenshots/ (gitignored).
//
//   BASE_URL=http://localhost:3100 node scripts/screenshot-audit.mjs
//
// Not wired into CI — it's an ad-hoc visual-audit tool.
import { chromium, devices } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = path.resolve(".playwright-screenshots");

// Home + all header links + all footer links + 3 pSEO spokes (CustomCat /
// Printify / Gumroad-fallback affiliate variants). /#categories is just the
// home anchor, so it's covered by "home".
const PAGES = [
  { name: "home", path: "/" },
  { name: "audit-landing", path: "/etsy-shop-audit" },
  { name: "embed", path: "/embed" },
  { name: "about", path: "/about" },
  { name: "recommendations", path: "/recommendations" },
  { name: "changelog", path: "/changelog" },
  { name: "privacy", path: "/privacy" },
  { name: "terms", path: "/terms" },
  { name: "contact", path: "/contact" },
  { name: "network", path: "/network" },
  { name: "pseo-embroidery", path: "/etsy-profit-margin/embroidery" }, // CustomCat card
  { name: "pseo-mugs", path: "/etsy-profit-margin/mugs-and-drinkware" }, // Printify card
  { name: "pseo-bath-bombs", path: "/etsy-profit-margin/bath-bombs" }, // Gumroad fallback
];

const TARGETS = [
  { device: "desktop", context: { viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 } },
  { device: "mobile", context: devices["iPhone 13"] },
];

// FOLD=1 → above-the-fold viewport shots (legible for reading copy/CTAs);
// default → full-page shots (whole-flow overview).
const FOLD = !!process.env.FOLD;
const browser = await chromium.launch();
const log = [];
for (const t of TARGETS) {
  const dir = path.join(OUT, t.device + (FOLD ? "-fold" : ""));
  await mkdir(dir, { recursive: true });
  const context = await browser.newContext(t.context);
  const page = await context.newPage();
  for (const p of PAGES) {
    const url = BASE + p.path;
    try {
      const resp = await page.goto(url, { waitUntil: "load", timeout: 60000 });
      // Let client-side offer fetch, fonts, and the prefilled calculator settle.
      await page.waitForTimeout(1500);
      const file = path.join(dir, `${p.name}.png`);
      await page.screenshot({ path: file, fullPage: !FOLD });
      log.push(`[${t.device}] ${p.name.padEnd(16)} ${resp?.status() ?? "??"}  ${p.path}`);
    } catch (e) {
      log.push(`[${t.device}] ${p.name.padEnd(16)} ERROR  ${e.message.split("\n")[0]}`);
    }
  }
  await context.close();
}
await browser.close();
console.log(log.join("\n"));
