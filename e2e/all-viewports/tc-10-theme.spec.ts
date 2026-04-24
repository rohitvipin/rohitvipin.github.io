import { test, expect } from "@playwright/test";

test.describe("TC-10 · Theme Toggle", () => {
  test("10.1 data-theme attribute present on html", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", /.+/);
  });

  test("10.2 toggle sets dark theme", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/");
    const toggle = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"]').first();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("10.3 toggle sets light theme", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/");
    const toggle = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"]').first();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("10.4 button aria-label updates after toggle", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"]').first();
    const labelBefore = await toggle.getAttribute("aria-label");
    await toggle.click();
    const labelAfter = await toggle.getAttribute("aria-label");
    expect(labelBefore).not.toEqual(labelAfter);
  });
});
