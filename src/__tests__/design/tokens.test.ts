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

/** Token values must be hex, rgb()/rgba(), oklch(), hsl()/hsla(), or var(...) */
const VALUE_SHAPE =
  /^(#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla|oklch|color)\([^)]+\)|var\(--[\w-]+\))$/;

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

  it("every token value parses as hex, colour-fn, or var(...) — catches typo'd refs", () => {
    for (const [name, theme] of [
      ["dark", dark],
      ["light", light],
    ] as const) {
      for (const key of TOKEN_KEYS) {
        const value = theme.get(key);
        expect(value, `${name} ${key}`).toBeTruthy();
        expect(value, `${name} ${key} = "${value}"`).toMatch(VALUE_SHAPE);
      }
    }
  });

  it("THEME_SELECTORS is exhaustive — every [data-theme=*] rule in globals.css is listed", () => {
    const found = new Set<string>();
    root.walkRules((rule: Rule) => {
      if (rule.parent?.type !== "root") return;
      // :root counts as the dark/default selector.
      if (rule.selector === ":root") {
        found.add(":root");
        return;
      }
      // Match selectors of the form [data-theme="xxx"] (with single or double quotes).
      if (/^\[data-theme=("|')[\w-]+\1\]$/.test(rule.selector)) {
        found.add(rule.selector);
      }
    });
    expect(Array.from(found).sort(), "selectors found in globals.css").toEqual(
      [...THEME_SELECTORS].sort()
    );
  });
});

describe("design tokens — WCAG contrast", () => {
  function valueFor(theme: Map<string, string>, key: TokenKey): string {
    const value = theme.get(key);
    if (!value) throw new Error(`missing token ${key}`);
    if (CONTRAST_EXEMPT.includes(key)) {
      throw new Error(`token ${key} is contrast-exempt; cannot use in contrast pair`);
    }
    if (!/^#[0-9a-fA-F]{3,8}$/.test(value)) {
      throw new Error(
        `token ${key} = "${value}" is not a hex literal; wcag-contrast.hex() will return NaN`
      );
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
        expect(Number.isFinite(ratio), `ratio for ${pair.fg}/${pair.bg} must be finite`).toBe(true);
        expect(ratio, `${themeName} ${pair.fg}(${fg}) on ${pair.bg}(${bg})`).toBeGreaterThanOrEqual(
          pair.min
        );
      });
    }
  }
});
