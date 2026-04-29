import { test, expect } from "@playwright/test";

test.describe("TC-00 · Smoke", () => {
  test("page loads and renders h1 with name", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Rohit Vipin Mathews");
  });

  test("00.4 no service worker is registered (G21)", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const registrations = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return 0;
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.length;
    });
    // Static export to GitHub Pages registers no SW. An accidental
    // next-pwa / workbox install would cause stale-cache issues — this
    // guard fails fast if a SW shows up.
    expect(registrations).toBe(0);
  });
});
