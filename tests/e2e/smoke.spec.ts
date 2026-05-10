import { expect, test } from "@playwright/test";

const REQUIRED_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/changelog",
  "/network",
  "/embed",
  "/recommendations",
];

test.describe("required pages render with status 200", () => {
  for (const path of REQUIRED_ROUTES) {
    test(`GET ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      // Each page must surface the brand wordmark.
      await expect(page.getByText("Etsy Margin").first()).toBeVisible();
    });
  }
});

test("footer Vertex Network link points at /network", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: /Part of the Vertex Network/i });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/network");
});

test("calculator updates URL with a share link", async ({ page }) => {
  await page.goto("/");
  // Type into the item-price field, then click "Copy share link" — we don't
  // need the clipboard payload, just the URL replaceState side effect.
  const priceInput = page.getByLabel(/item price/i);
  await priceInput.fill("32");
  await expect(page).toHaveURL(/p=32/);
});
