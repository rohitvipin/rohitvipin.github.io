import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";

const NAV_COUNT = (
  JSON.parse(readFileSync(resolve(process.cwd(), "data/nav.json"), "utf8")) as unknown[]
).length;

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
    const closeBtn = drawer.locator('button[aria-label="Close navigation menu"]');
    const count = await links.count();

    // Auto-focus lands on first nav link
    await expect(links.first()).toBeFocused();

    // Tab through remaining links
    for (let i = 0; i < count - 1; i++) {
      await page.keyboard.press("Tab");
    }
    await expect(links.last()).toBeFocused();

    // Tab to close button (inside dialog)
    await page.keyboard.press("Tab");
    await expect(closeBtn).toBeFocused();

    // Tab wraps to first link
    await page.keyboard.press("Tab");
    await expect(links.first()).toBeFocused();

    // Shift+Tab from first link → close button
    await page.keyboard.press("Shift+Tab");
    await expect(closeBtn).toBeFocused();

    // Shift+Tab from close button → last link
    await page.keyboard.press("Shift+Tab");
    await expect(links.last()).toBeFocused();
  });

  test("05.7 body scroll locked while drawer open", async ({ page }) => {
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect.soft(overflow).toBe("hidden");
  });

  test("05.8 main element is inert while drawer open", async ({ page }) => {
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    const inert = await page.evaluate(() => document.querySelector("main")?.hasAttribute("inert"));
    expect.soft(inert).toBe(true);
  });

  test("05.9 main element is not inert after drawer closes", async ({ page }) => {
    await page.locator('button[aria-label="Open menu"]').click();
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    const inert = await page.evaluate(() => document.querySelector("main")?.hasAttribute("inert"));
    expect.soft(inert).toBe(false);
  });
});
