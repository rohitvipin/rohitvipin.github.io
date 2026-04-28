import { test, expect } from "@playwright/test";

/**
 * WCAG 2.5.5 (AAA) and DESIGN.md §Accessibility require interactive
 * elements to expose at least a 48x48 CSS-pixel hit target. jsdom cannot
 * compute layout, so this contract lives in the real-browser e2e suite.
 *
 * Runs on every viewport project (desktop, tablet, mobile) via the
 * shared `all-viewports/` test match in playwright.config.ts.
 */

const MIN = 48;

test.describe("touch target sizes (WCAG 2.5.5)", () => {
  test("every visible interactive element is at least 48x48 CSS px", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const offenders = await page.evaluate((min) => {
      const interactiveSelector = [
        "button:not([disabled])",
        'a[href]:not([href=""])',
        "input:not([type='hidden']):not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[role='button']:not([aria-disabled='true'])",
        "[role='tab']:not([aria-disabled='true'])",
      ].join(", ");

      const isVisible = (el: Element): boolean => {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") return false;
        if (parseFloat(style.opacity) === 0) return false;
        const rect = (el as HTMLElement).getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      };

      const out: Array<{ selector: string; w: number; h: number; text: string }> = [];
      document.querySelectorAll<HTMLElement>(interactiveSelector).forEach((el) => {
        if (!isVisible(el)) return;
        const rect = el.getBoundingClientRect();
        if (rect.width < min || rect.height < min) {
          const text = (el.textContent ?? "").trim().slice(0, 60);
          const id = el.id ? `#${el.id}` : "";
          const cls = el.className.toString().split(/\s+/).slice(0, 2).join(".");
          out.push({
            selector: `${el.tagName.toLowerCase()}${id}${cls ? "." + cls : ""}`,
            w: Math.round(rect.width),
            h: Math.round(rect.height),
            text,
          });
        }
      });
      return out;
    }, MIN);

    expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
  });
});
