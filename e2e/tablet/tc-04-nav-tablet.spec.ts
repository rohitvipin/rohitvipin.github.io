import { test, expect } from "@playwright/test";

test.describe("TC-04 · Navigation — Tablet (768px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("04.1 desktop nav not visible at tablet width", async ({ page }) => {
    await expect(page.locator('nav[aria-label="Main navigation"]')).not.toBeVisible();
  });

  test("04.2 hamburger visible and meets 44px minimum", async ({ page }) => {
    const hamburger = page.locator('button[aria-label="Open menu"]');
    await expect(hamburger).toBeVisible();
    const box = await hamburger.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  });

  test("04.3 no nav link overflows 768px viewport", async ({ page }) => {
    const hamburger = page.locator('button[aria-label="Open menu"]');
    await hamburger.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    const links = page.locator('[role="dialog"] a[href]');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox();
      if (!box) continue;
      expect.soft(box.x + box.width, `drawer link[${i}] overflows 768px`).toBeLessThanOrEqual(768);
    }
  });
});
