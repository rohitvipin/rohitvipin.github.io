import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  reporter: [
    ["html", { open: "never" }],
    ["json", { outputFile: "playwright-report/results.json" }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "off",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run preview",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 900 } },
      testMatch: ["desktop/**/*.spec.ts", "all-viewports/**/*.spec.ts"],
    },
    {
      name: "tablet",
      use: { viewport: { width: 768, height: 1024 } },
      testMatch: ["tablet/**/*.spec.ts", "all-viewports/**/*.spec.ts"],
    },
    {
      name: "mobile",
      use: { viewport: { width: 375, height: 812 } },
      testMatch: ["mobile/**/*.spec.ts", "all-viewports/**/*.spec.ts"],
    },
  ],
});
