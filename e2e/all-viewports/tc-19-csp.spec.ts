import { test, expect } from "@playwright/test";

/**
 * Parse a CSP `Content-Security-Policy` header/meta value into a sorted
 * directive map so snapshots stay whitespace- and order-insensitive.
 *
 * Returns: { "directive-name": ["value1", "value2"] } with both keys and
 * each value-array sorted ascending.
 *
 * Throws on duplicate directive names — duplicate directives are a real
 * authoring bug that browsers handle inconsistently. Failing loudly is
 * better than silent overwrite.
 */
function parseCSP(content: string): Record<string, string[]> {
  const directives: Record<string, string[]> = {};
  for (const part of content.split(";")) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;
    const [name, ...values] = tokens;
    if (name in directives) {
      throw new Error(`duplicate CSP directive: ${name}`);
    }
    directives[name] = values.slice().sort();
  }
  // Re-key so JSON.stringify / inline snapshots emit sorted keys.
  const sorted: Record<string, string[]> = {};
  for (const key of Object.keys(directives).sort()) sorted[key] = directives[key];
  return sorted;
}

test.describe("TC-19 · CSP directive regression", () => {
  test.beforeAll(() => {
    // The snapshot below locks the production CSP. layout.tsx conditionally
    // appends `'unsafe-eval'` when NODE_ENV === "development"; running the
    // suite against `npm run dev` would produce a misleading snapshot diff.
    // Playwright config builds and serves out/, so this should always be
    // production — guard against accidental dev-server runs.
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "TC-19 requires a production build. NODE_ENV=development indicates " +
          "the dev server is being targeted; CSP includes 'unsafe-eval' there."
      );
    }
  });

  test("19.1 production CSP meta directives match snapshot", async ({ page }) => {
    await page.goto("/");
    const csp = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute("content");
    expect(csp, "CSP meta tag missing").not.toBeNull();
    const directives = parseCSP(csp ?? "");

    // Snapshot intentionally locks the production directive surface. A
    // legitimate CSP change (new hash, new origin, removed directive) should
    // update this snapshot during PR review — never weaken silently.
    expect(directives).toMatchInlineSnapshot(`
      {
        "base-uri": [
          "'self'",
        ],
        "connect-src": [
          "'self'",
        ],
        "default-src": [
          "'self'",
        ],
        "font-src": [
          "'self'",
        ],
        "img-src": [
          "'self'",
          "data:",
        ],
        "object-src": [
          "'none'",
        ],
        "script-src": [
          "'self'",
          "'unsafe-inline'",
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
        ],
      }
    `);
  });

  test("19.2 script-src does not contain unsafe-eval in production build", async ({ page }) => {
    await page.goto("/");
    const csp = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute("content");
    const directives = parseCSP(csp ?? "");
    // unsafe-eval is dev-only per layout.tsx; production must not include it.
    expect(directives["script-src"]).not.toContain("'unsafe-eval'");
  });

  test("19.3 wildcard origins are not present in any directive", async ({ page }) => {
    await page.goto("/");
    const csp = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute("content");
    const directives = parseCSP(csp ?? "");
    for (const [name, values] of Object.entries(directives)) {
      expect(values, `${name} contains wildcard`).not.toContain("*");
    }
  });
});
