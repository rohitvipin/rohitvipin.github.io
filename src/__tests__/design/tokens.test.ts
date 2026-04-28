import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import postcss, { type Rule, type Declaration } from "postcss";
import { hex } from "wcag-contrast";
import {
  TOKEN_KEYS,
  THEME_SELECTORS,
  CONTRAST_EXEMPT,
  CONTRAST_PAIRS,
  type ThemeSelector,
  type TokenKey,
} from "@/lib/tokens";

const cssPath = path.resolve(__dirname, "../../app/globals.css");
const css = fs.readFileSync(cssPath, "utf8");
const root = postcss.parse(css);

function declarationsForSelector(selector: ThemeSelector): Map<string, string> {
  const map = new Map<string, string>();
  root.walkRules((rule: Rule) => {
    // Scope strictly to top-level token blocks. Skip @theme inline and any nested rule.
    if (rule.parent?.type !== "root") return;
    if (rule.selector !== selector) return;
    rule.walkDecls((decl: Declaration) => {
      if (decl.prop.startsWith("--")) {
        map.set(decl.prop, decl.value.trim());
      }
    });
  });
  return map;
}

const dark = declarationsForSelector(":root");
const light = declarationsForSelector('[data-theme="light"]');

describe("design tokens — globals.css", () => {
  it("dark theme declares exactly the canonical token set", () => {
    expect(new Set(dark.keys())).toEqual(new Set(TOKEN_KEYS));
  });

  it("light theme declares exactly the canonical token set", () => {
    expect(new Set(light.keys())).toEqual(new Set(TOKEN_KEYS));
  });

  it("light and dark declare the same token keys (theme parity)", () => {
    const darkSet = new Set(dark.keys());
    const lightSet = new Set(light.keys());
    expect(Array.from(darkSet).sort()).toEqual(Array.from(lightSet).sort());
  });

  it("every token has a non-empty value in both themes", () => {
    for (const key of TOKEN_KEYS) {
      expect(dark.get(key), `dark ${key}`).toBeTruthy();
      expect(light.get(key), `light ${key}`).toBeTruthy();
    }
  });

  it("THEME_SELECTORS covers exactly the selectors present in the file", () => {
    // Sanity: if globals.css adopts a third theme, this test forces an update.
    expect(THEME_SELECTORS).toEqual([":root", '[data-theme="light"]']);
  });
});

describe("design tokens — WCAG contrast", () => {
  function valueFor(theme: Map<string, string>, key: TokenKey): string {
    const value = theme.get(key);
    if (!value) throw new Error(`missing token ${key}`);
    if (CONTRAST_EXEMPT.includes(key)) {
      throw new Error(`token ${key} is contrast-exempt; cannot use in contrast pair`);
    }
    return value;
  }

  for (const pair of CONTRAST_PAIRS) {
    for (const [themeName, theme] of [
      ["dark", dark],
      ["light", light],
    ] as const) {
      it(`${themeName}: ${pair.fg} on ${pair.bg} >= ${pair.min} (${pair.reason})`, () => {
        const fg = valueFor(theme, pair.fg);
        const bg = valueFor(theme, pair.bg);
        const ratio = hex(fg, bg);
        expect(ratio, `${themeName} ${pair.fg}(${fg}) on ${pair.bg}(${bg})`).toBeGreaterThanOrEqual(
          pair.min
        );
      });
    }
  }
});
