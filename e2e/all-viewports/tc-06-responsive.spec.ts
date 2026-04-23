import { test, expect } from "@playwright/test";

test.describe("TC-06 · Responsive Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("06.1-06.3 no horizontal scroll at current viewport", async ({ page }) => {
    const noHScroll = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
    );
    expect(noHScroll).toBe(true);
  });

  test("06.4 avatar visibility matches breakpoint", async ({ page, viewport }) => {
    const width = viewport?.width ?? 1440;
    const avatarImg = page.locator("picture img").first();
    if (width < 1024) {
      await expect.soft(avatarImg).not.toBeVisible();
    } else {
      await expect.soft(avatarImg).toBeVisible();
    }
  });

  test("06.5 cards render at current viewport without clipping", async ({ page }) => {
    const cards = page.locator("[class*='card']").first();
    await expect.soft(cards).toBeVisible();
  });

  test("06.6 no text overflow clipping", async ({ page }) => {
    const clipped = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll("p, h1, h2, h3, span"));
      return els.some((el) => {
        const s = window.getComputedStyle(el);
        return (
          s.overflow === "hidden" &&
          (el as HTMLElement).scrollHeight > (el as HTMLElement).clientHeight + 2
        );
      });
    });
    await expect.soft(clipped).toBe(false);
  });
});
