import { test, expect } from "@playwright/test";

test.describe("TC-02 · Assets", () => {
  test("02.1 zero failed network requests on load", async ({ page }) => {
    const failures: string[] = [];
    page.on("response", (r) => {
      if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(failures).toHaveLength(0);
  });

  test("02.2 avatar WebP returns 200", async ({ request }) => {
    const res = await request.head("/avatar.webp");
    expect(res.status()).toBeLessThan(400);
  });

  test("02.3 picture element wraps avatar with WebP source", async ({ page }) => {
    await page.goto("/");
    const count = await page.locator("picture source[type='image/webp']").count();
    expect(count).toBeGreaterThan(0);
  });

  test("02.4 avatar image loaded with non-zero dimensions", async ({ page }) => {
    await page.goto("/");
    const loaded = await page.evaluate(() => {
      const img = document.querySelector("picture img") as HTMLImageElement;
      return img ? img.complete && img.naturalWidth > 0 : false;
    });
    expect(loaded).toBe(true);
  });

  test("02.5 PDF resume link returns 200", async ({ request }) => {
    const res = await request.head("/Rohit_Vipin_Mathews_Resume.pdf");
    expect(res.status()).toBeLessThan(400);
  });

  test("02.6 OG image returns 200", async ({ request }) => {
    const res = await request.head("/og-image.jpg");
    expect.soft(res.status()).toBeLessThan(400);
  });

  test("02.7 favicon returns 200", async ({ request }) => {
    const res = await request.head("/favicon.ico");
    expect.soft(res.status()).toBeLessThan(400);
  });

  test("02.8 sitemap.xml returns 200", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBeLessThan(400);
  });

  test("02.9 sitemap.xml contains site URL", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    const body = await res.text();
    expect(body).toContain("rohitvipin.github.io");
  });
});
