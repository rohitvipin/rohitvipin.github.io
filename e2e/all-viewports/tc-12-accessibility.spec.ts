import { test, expect } from "@playwright/test";

test.describe("TC-12 · Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("12.1 skip link present in DOM", async ({ page }) => {
    await expect(page.locator('a[href="#main-content"]')).toBeAttached();
  });

  test("12.2 main#main-content present", async ({ page }) => {
    await expect(page.locator("main#main-content")).toBeAttached();
  });

  test("12.3 sections have aria-labelledby pointing to heading", async ({ page }) => {
    const sections = page.locator("section[aria-labelledby]");
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const id = await sections.nth(i).getAttribute("aria-labelledby");
      if (!id) continue;
      await expect.soft(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("12.4 JSON-LD structured data with Person type", async ({ page }) => {
    const script = page.locator('script[type="application/ld+json"]');
    await expect(script).toBeAttached();
    const text = await script.textContent();
    if (!text) return;
    const ld = JSON.parse(text);
    expect(ld["@type"]).toBe("Person");
  });

  test("12.5 meta description length 50-160 chars", async ({ page }) => {
    const meta = page.locator('meta[name="description"]');
    await expect.soft(meta).toBeAttached();
    const content = await meta.getAttribute("content");
    if (content) {
      expect.soft(content.length).toBeGreaterThanOrEqual(50);
      expect.soft(content.length).toBeLessThanOrEqual(160);
    }
  });

  test("12.6 OG tags present", async ({ page }) => {
    await expect.soft(page.locator('meta[property="og:title"]')).toBeAttached();
    await expect.soft(page.locator('meta[property="og:description"]')).toBeAttached();
    await expect.soft(page.locator('meta[property="og:image"]')).toBeAttached();
  });

  test("12.7 Twitter card tags present", async ({ page }) => {
    await expect.soft(page.locator('meta[name="twitter:card"]')).toBeAttached();
    await expect.soft(page.locator('meta[name="twitter:title"]')).toBeAttached();
  });

  test("12.8 all images have alt text", async ({ page }) => {
    const imgs = page.locator("img");
    const count = await imgs.count();
    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute("alt");
      expect(alt, `img[${i}] missing alt`).not.toBeNull();
    }
  });

  test("12.9 no buttons with empty accessible name", async ({ page }) => {
    const buttons = page.locator("button");
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const ariaLabel = await btn.getAttribute("aria-label");
      const text = (await btn.textContent())?.trim();
      const ariaLabelledby = await btn.getAttribute("aria-labelledby");
      const hasLabel = !!(ariaLabel || text || ariaLabelledby);
      expect(hasLabel, `button[${i}] has no accessible name`).toBe(true);
    }
  });

  test("12.10 no links with empty accessible name", async ({ page }) => {
    const anchors = page.locator("a[href]");
    const count = await anchors.count();
    for (let i = 0; i < count; i++) {
      const a = anchors.nth(i);
      const ariaLabel = await a.getAttribute("aria-label");
      const text = (await a.textContent())?.trim();
      const ariaLabelledby = await a.getAttribute("aria-labelledby");
      const hasLabel = !!(ariaLabel || text || ariaLabelledby);
      expect.soft(hasLabel, `a[${i}] has no accessible name`).toBe(true);
    }
  });

  test("12.11 no skipped heading levels", async ({ page }) => {
    const levels = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      return headings.map((h) => parseInt(h.tagName[1]));
    });
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1];
      expect
        .soft(diff, `heading skip at index ${i}: h${levels[i - 1]}→h${levels[i]}`)
        .toBeLessThanOrEqual(1);
    }
  });

  test("12.12 html element has lang=en", async ({ page }) => {
    await expect.soft(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("12.13 JSON-LD Person has hasOccupation with name", async ({ page }) => {
    const script = page.locator('script[type="application/ld+json"]');
    await expect(script).toBeAttached();
    const text = await script.textContent();
    if (!text) return;
    const ld = JSON.parse(text);
    expect.soft(ld.hasOccupation).toBeDefined();
    expect.soft(ld.hasOccupation?.["@type"]).toBe("Occupation");
    expect.soft(typeof ld.hasOccupation?.name).toBe("string");
  });
});
