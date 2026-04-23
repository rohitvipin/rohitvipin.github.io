import { test, expect } from "@playwright/test";

test.describe("TC-00 · Smoke", () => {
  test("page loads and renders h1 with name", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Rohit Vipin Mathews");
  });
});
