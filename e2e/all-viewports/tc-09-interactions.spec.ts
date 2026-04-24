import { test, expect } from "@playwright/test";

test.describe("TC-09 · Show / Hide Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("09.1 skill cards use details.card-details", async ({ page }) => {
    const count = await page.locator("#skills details.card-details").count();
    expect(count).toBeGreaterThan(0);
  });

  test("09.2 skill card expands on summary click", async ({ page }) => {
    const details = page.locator("#skills details.card-details").first();
    const summary = details.locator("summary").first();
    await details.evaluate((el) => {
      (el as HTMLDetailsElement).open = false;
    });
    await summary.scrollIntoViewIfNeeded();
    await summary.click();
    await expect(details).toHaveJSProperty("open", true);
  });

  test("09.3 skill card collapses on second click", async ({ page }) => {
    const details = page.locator("#skills details.card-details").first();
    const summary = details.locator("summary").first();
    await details.evaluate((el) => {
      (el as HTMLDetailsElement).open = false;
    });
    await summary.scrollIntoViewIfNeeded();
    await summary.click();
    await expect(details).toHaveJSProperty("open", true);
    await summary.click();
    await expect(details).toHaveJSProperty("open", false);
  });

  test("09.4 experience card expands on summary click", async ({ page }) => {
    const allDetails = page.locator("#experience details.card-details");
    const count = await allDetails.count();
    expect(count).toBeGreaterThan(0);

    const details = allDetails.first();
    const summary = details.locator("summary").first();
    await details.evaluate((el) => {
      (el as HTMLDetailsElement).open = false;
    });
    await summary.scrollIntoViewIfNeeded();
    await summary.click();
    await expect(details).toHaveJSProperty("open", true);
  });

  test("09.5 experience card collapses on second click", async ({ page }) => {
    const details = page.locator("#experience details.card-details").first();
    const summary = details.locator("summary").first();
    await details.evaluate((el) => {
      (el as HTMLDetailsElement).open = true;
    });
    await summary.scrollIntoViewIfNeeded();
    await summary.click();
    await expect(details).toHaveJSProperty("open", false);
  });

  test("09.6 projects tab switch shows correct panel", async ({ page }) => {
    await page.locator("#projects").scrollIntoViewIfNeeded();
    const ossTab = page.locator('[role="tab"]').filter({ hasText: /open source/i });
    await ossTab.click();
    await expect(ossTab).toHaveAttribute("aria-selected", "true");
    const ossPanel = page.locator('[role="tabpanel"]:not([hidden])');
    await expect(ossPanel).toBeVisible();
  });

  test("09.7 impact stories — collapsible if present", async ({ page }) => {
    const collapsible = page.locator("#impact details.card-details");
    const count = await collapsible.count();
    if (count === 0) return;
    const summary = collapsible.first().locator("summary");
    await summary.scrollIntoViewIfNeeded();
    await summary.click();
    await expect(collapsible.first()).toHaveJSProperty("open", true);
  });

  test("09.8 projects tab keyboard ArrowRight/ArrowLeft navigation", async ({ page }) => {
    await page.locator("#projects").scrollIntoViewIfNeeded();
    const tabs = page.locator('[role="tablist"] [role="tab"]');
    const firstTab = tabs.first();
    const secondTab = tabs.nth(1);

    await firstTab.focus();
    await expect(firstTab).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(secondTab).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(firstTab).toBeFocused();
  });

  test("09.9 projects tab keyboard Home/End navigation", async ({ page }) => {
    await page.locator("#projects").scrollIntoViewIfNeeded();
    const tabs = page.locator('[role="tablist"] [role="tab"]');
    const firstTab = tabs.first();
    const lastTab = tabs.last();

    await firstTab.focus();

    await page.keyboard.press("End");
    await expect(lastTab).toBeFocused();

    await page.keyboard.press("Home");
    await expect(firstTab).toBeFocused();
  });
});
