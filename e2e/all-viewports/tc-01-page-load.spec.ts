import { test, expect } from "@playwright/test";

test.describe("TC-01 · Page Load", () => {
  test("01.1 HTTP status 200", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
  });

  test("01.2 page title contains name", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Rohit Vipin Mathews/);
  });

  test("01.3 no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });

  test("01.4 no console warnings on load", async ({ page }) => {
    const warnings: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "warning") warnings.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    if (warnings.length > 0) {
      console.warn("Console warnings:", warnings);
    }
    expect(warnings).toHaveLength(0);
  });

  test("01.5 html lang attribute is en", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});
