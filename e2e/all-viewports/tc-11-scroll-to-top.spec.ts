import { test, expect } from "@playwright/test";

test.describe("TC-11 · Scroll-to-Top", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("11.1 button hidden at top of page", async ({ page }) => {
    const btn = page.locator('button[aria-label="Scroll to top"]');
    const visible = await btn.isVisible().catch(() => false);
    await expect.soft(visible).toBe(false);
  });

  test("11.2 button appears after scrolling past 400px", async ({ page }) => {
    await page.evaluate(() => {
      window.scrollTo(0, 500);
      window.dispatchEvent(new Event("scroll"));
    });
    const btn = page.locator('button[aria-label="Scroll to top"]');
    await btn.waitFor({ state: "visible", timeout: 3000 });
    await expect.soft(btn).toBeVisible();
  });

  test("11.4 click returns to top", async ({ page }) => {
    await page.evaluate(() => {
      window.scrollTo(0, 500);
      window.dispatchEvent(new Event("scroll"));
    });
    const btn = page.locator('button[aria-label="Scroll to top"]');
    await btn.waitFor({ state: "visible", timeout: 3000 });
    await btn.click();
    await page.waitForFunction(() => window.scrollY < 50, { timeout: 3000 });
    const scrollY = await page.evaluate(() => window.scrollY);
    await expect.soft(scrollY).toBeLessThan(50);
  });
});
