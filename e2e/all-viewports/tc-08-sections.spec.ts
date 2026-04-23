import { test, expect } from "@playwright/test";

test.describe("TC-08 · Section Presence & Data", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("08.1 hero h1 with name", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Rohit Vipin Mathews");
  });

  test("08.2 about section has heading and content", async ({ page }) => {
    const section = page.locator("#about");
    await expect(section).toBeVisible();
    await expect(section.locator("h2, h3").first()).toBeVisible();
    await expect(section.locator("p").first()).toBeVisible();
  });

  test("08.3 impact section has at least one card", async ({ page }) => {
    const section = page.locator("#impact");
    await expect(section).toBeVisible();
    await expect(section.locator("article, [class*='card'], li").first()).toBeVisible();
  });

  test("08.4 experience section has at least one entry", async ({ page }) => {
    const section = page.locator("#experience");
    await expect(section).toBeVisible();
    await expect(section.locator("article, details, li").first()).toBeVisible();
  });

  test("08.5 expertise section heading present", async ({ page }) => {
    const section = page.locator("#expertise");
    await expect(section).toBeVisible();
    await expect(section.locator("h2, h3").first()).toBeVisible();
  });

  test("08.6 projects section has at least one card", async ({ page }) => {
    const section = page.locator("#projects");
    await expect(section).toBeVisible();
    await expect(section.locator("article, details, li").first()).toBeVisible();
  });

  test("08.7 skills section has at least one category", async ({ page }) => {
    const section = page.locator("#skills");
    await expect(section).toBeVisible();
    await expect(section.locator("article, details, li").first()).toBeVisible();
  });

  test("08.8 community section has at least one entry", async ({ page }) => {
    const section = page.locator("#community");
    await expect(section).toBeVisible();
    await expect.soft(section.locator("article, details, li").first()).toBeVisible();
  });

  test("08.9 awards section has at least one entry", async ({ page }) => {
    const section = page.locator("#awards");
    await expect(section).toBeVisible();
    await expect.soft(section.locator("div.card, [class*='card']").first()).toBeVisible();
  });

  test("08.10 education section has at least one entry", async ({ page }) => {
    const section = page.locator("#education");
    await expect(section).toBeVisible();
    await expect.soft(section.locator("div.card, [class*='card'], article").first()).toBeVisible();
  });
});
