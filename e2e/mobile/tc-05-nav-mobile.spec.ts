import { test, expect } from "@playwright/test";

const NAV_COUNT = 9;

test.describe("TC-05 · Navigation — Mobile (375px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("05.1 hamburger button present", async ({ page }) => {
    await expect(page.locator('button[aria-label="Open menu"]')).toBeVisible();
  });

  test("05.2 mobile drawer opens with role=dialog", async ({ page }) => {
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test("05.3 all nav links rendered in drawer", async ({ page }) => {
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('[role="dialog"] a[href]')).toHaveCount(NAV_COUNT);
  });

  test("05.4 drawer closes after link click", async ({ page }) => {
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.locator('[role="dialog"] a[href]').first().click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test("05.5 Escape key closes drawer", async ({ page }) => {
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test("05.6 focus trap wraps forward and backward", async ({ page }) => {
    await page.locator('button[aria-label="Open menu"]').click();
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer).toBeVisible();

    const links = drawer.locator("a[href]");
    const count = await links.count();

    await expect(links.first()).toBeFocused();

    for (let i = 0; i < count - 1; i++) {
      await page.keyboard.press("Tab");
    }
    await expect(links.last()).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(links.first()).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(links.last()).toBeFocused();
  });

  test("05.7 body scroll locked while drawer open", async ({ page }) => {
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    await expect.soft(overflow).toBe("hidden");
  });
});
