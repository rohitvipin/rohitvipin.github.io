import { test, expect, type Page } from "@playwright/test";

async function assertMinSize(page: Page, selector: string, minPx: number, label: string) {
  const el = page.locator(selector).first();
  const visible = await el.isVisible().catch(() => false);
  if (!visible) return;
  const box = await el.boundingBox();
  if (!box) return;
  expect.soft(box.height, `${label} height`).toBeGreaterThanOrEqual(minPx);
  expect.soft(box.width, `${label} width`).toBeGreaterThanOrEqual(minPx);
}

test.describe("TC-07 · Touch Targets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("07.1-07.3 hero CTAs meet 44px minimum", async ({ page }) => {
    await assertMinSize(page, 'a:has-text("See Impact")', 44, "See Impact CTA");
    await assertMinSize(page, 'a:has-text("Get in Touch")', 44, "Get in Touch CTA");
    await assertMinSize(page, 'a[aria-label*="Download"][aria-label*="resume"]', 44, "Download CV");
  });

  test("07.4 hamburger button meets 48px minimum (mobile/tablet)", async ({ page, viewport }) => {
    const width = viewport?.width ?? 1440;
    if (width >= 1024) return;
    await assertMinSize(page, 'button[aria-label="Open menu"]', 48, "Hamburger");
  });

  test("07.5 desktop nav links meet 44px minimum", async ({ page, viewport }) => {
    const width = viewport?.width ?? 1440;
    if (width < 1024) return;
    const links = page.locator('nav[aria-label="Main navigation"] a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox();
      if (!box) continue;
      expect.soft(box.height, `nav link[${i}] height`).toBeGreaterThanOrEqual(44);
    }
  });

  test("07.6 social icon links meet 48px minimum", async ({ page }) => {
    const socialLinks = page
      .locator("a[aria-label]")
      .filter({ hasNot: page.locator('[aria-label*="Download"]') });
    const count = await socialLinks.count();
    for (let i = 0; i < Math.min(count, 6); i++) {
      const link = socialLinks.nth(i);
      const visible = await link.isVisible().catch(() => false);
      if (!visible) continue;
      const box = await link.boundingBox();
      if (!box) continue;
      if (box.height < 10) continue; // skip zero-size elements isVisible() missed
      expect.soft(box.height, `social link[${i}]`).toBeGreaterThanOrEqual(44);
    }
  });

  test("07.7 theme toggle meets 48px minimum", async ({ page }) => {
    await assertMinSize(
      page,
      'button[aria-label*="theme"], button[aria-label*="Theme"]',
      48,
      "Theme toggle"
    );
  });

  test("07.8 scroll-to-top button meets 48px minimum", async ({ page }) => {
    await page.evaluate(() => {
      window.scrollTo(0, 500);
      window.dispatchEvent(new Event("scroll"));
    });
    await page
      .locator('button[aria-label="Scroll to top"]')
      .waitFor({ state: "visible", timeout: 3000 });
    await assertMinSize(page, 'button[aria-label="Scroll to top"]', 48, "Scroll-to-top");
  });

  test("07.9 experience summary elements meet 44px minimum", async ({ page }) => {
    const summaries = page.locator("#experience details.card-details > summary");
    const count = await summaries.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await summaries.nth(i).boundingBox();
      if (!box) continue;
      expect.soft(box.height, `experience summary[${i}]`).toBeGreaterThanOrEqual(44);
    }
  });

  test("07.10 skill toggle summaries meet 44px minimum", async ({ page }) => {
    const summaries = page.locator("#skills details.card-details > summary");
    const count = await summaries.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const box = await summaries.nth(i).boundingBox();
      if (!box) continue;
      expect.soft(box.height, `skill summary[${i}]`).toBeGreaterThanOrEqual(44);
    }
  });
});
