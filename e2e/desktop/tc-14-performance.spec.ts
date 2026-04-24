import { test, expect } from "@playwright/test";

test.describe("TC-14 · Performance (desktop only)", () => {
  test("14.1 zero 4xx/5xx network responses", async ({ page }) => {
    const failures: string[] = [];
    page.on("response", (r) => {
      if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(failures).toHaveLength(0);
  });

  test("14.2 avatar preload link present for desktop", async ({ page }) => {
    await page.goto("/");
    const hasPreload = await page.evaluate(
      () => !!document.querySelector('link[rel="preload"][href*="avatar"]')
    );
    expect(hasPreload).toBe(true);
  });

  test("14.3 avatar img has fetchPriority=high", async ({ page }) => {
    await page.goto("/");
    const avatar = page.locator("picture img").first();
    const fetchPriority = await avatar.getAttribute("fetchpriority");
    expect(fetchPriority).toBe("high");
  });

  test("14.4 no external render-blocking scripts in head", async ({ page }) => {
    await page.goto("/");
    const blockingScripts = await page.evaluate(() => {
      const scripts = Array.from(document.head.querySelectorAll<HTMLScriptElement>("script[src]"));
      return scripts.filter((s) => !s.defer && !s.async && !s.src.includes("_next/")).length;
    });
    expect(blockingScripts).toBe(0);
  });
});
