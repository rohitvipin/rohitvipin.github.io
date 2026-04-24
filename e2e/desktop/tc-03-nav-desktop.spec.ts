import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

const _dir = dirname(fileURLToPath(import.meta.url));
const NAV_COUNT = (
  JSON.parse(readFileSync(resolve(_dir, "../../data/nav.json"), "utf8")) as unknown[]
).length;

test.describe("TC-03 · Navigation — Desktop (1440px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("03.1 desktop nav visible", async ({ page }) => {
    await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
  });

  test("03.2 hamburger hidden at desktop width", async ({ page }) => {
    const hamburger = page.locator(
      'button[aria-label="Open menu"], button[aria-label="Close menu"]'
    );
    await expect(hamburger).not.toBeVisible();
  });

  test("03.3 all nav links present", async ({ page }) => {
    await expect(page.locator('nav[aria-label="Main navigation"] a')).toHaveCount(NAV_COUNT);
  });

  test("03.4 no nav link overflows viewport", async ({ page }) => {
    const links = page.locator('nav[aria-label="Main navigation"] a');
    const count = await links.count();
    const viewportWidth = 1440;
    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox();
      if (!box) continue;
      expect.soft(box.x + box.width, `nav link[${i}] overflows`).toBeLessThanOrEqual(viewportWidth);
    }
  });

  test("03.5 aria-current set on active link when section intersects", async ({ page }) => {
    await page.locator("#about").scrollIntoViewIfNeeded();
    const activeLink = page.locator('nav[aria-label="Main navigation"] a[aria-current="location"]');
    await expect.soft(activeLink).toHaveCount(1, { timeout: 2000 });
  });

  test("03.6 home logo link with aria-label=Home present", async ({ page }) => {
    await expect(page.locator('a[aria-label="Home"]')).toBeVisible();
  });

  test("03.7 theme toggle in header", async ({ page }) => {
    await expect(
      page.locator('header button[aria-label*="theme"], header button[aria-label*="Theme"]')
    ).toBeVisible();
  });
});
