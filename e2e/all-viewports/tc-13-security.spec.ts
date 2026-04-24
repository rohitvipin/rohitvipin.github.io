import { test, expect } from "@playwright/test";

test.describe("TC-13 · Security & CSP", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("13.1 CSP meta tag present in head", async ({ page }) => {
    await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toBeAttached();
  });

  test("13.2 CSP meta does not contain frame-ancestors", async ({ page }) => {
    const cspEl = page.locator('meta[http-equiv="Content-Security-Policy"]');
    await expect(cspEl).toBeAttached();
    const csp = await cspEl.getAttribute("content");
    expect(csp).not.toBeNull();
    expect(csp ?? "").not.toContain("frame-ancestors");
  });

  test("13.4 referrer policy meta present", async ({ page }) => {
    await expect(page.locator('meta[name="referrer"]')).toBeAttached();
  });

  test("13.5 no credential patterns in rendered HTML", async ({ page }) => {
    const html = await page.content();
    expect(html).not.toMatch(/AKIA[0-9A-Z]{16}/);
    expect(html).not.toMatch(/ghp_[A-Za-z0-9]{36}/);
    expect(html).not.toMatch(/Bearer\s+[A-Za-z0-9\-._~+/]{20,}/);
  });
});
