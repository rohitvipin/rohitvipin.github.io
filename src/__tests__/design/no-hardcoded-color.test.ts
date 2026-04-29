import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Backstop for the ESLint `no-restricted-syntax` rule. Globs the full
 * components + app trees on every CI run, not just staged files. Catches
 * hex/rgb/hsl literals in JSX className strings, style props, or string
 * literals — same regex the lint rule applies, run as a unit test.
 */

const ROOT = path.resolve(__dirname, "../../..");
const SCAN_DIRS = ["src/components", "src/app", "src/lib"];

/**
 * Browser theme-color meta requires literal hex; CSS vars are not resolved
 * by user-agents reading `<meta name="theme-color">`. Exempt the single
 * file that produces the meta tag.
 */
const FILE_ALLOWLIST = new Set<string>(["src/app/layout.tsx"]);

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FUNC = /\b(?:rgb|rgba|hsl|hsla)\s*\(/g;

/**
 * Mirror the ESLint rule's exemptions: hex-shaped strings inside `id`,
 * `href`, `aria-controls`, `aria-labelledby`, `aria-describedby`, and
 * `data-*` JSXAttributes (e.g. `<a href="#hash">`, `<button aria-controls="t-1">`)
 * are not colours.
 *
 * Quoted-value attributes are easy. JSX expression containers (`{...}`)
 * may contain nested braces (template literals like `` href={`#${id}`} ``);
 * a regex `\{[^}]*\}` would terminate at the inner `}`. Use a brace-balanced
 * scan so nested template literals are stripped cleanly.
 */
const STRIP_ATTR_NAMES = ["href", "id", "aria-controls", "aria-labelledby", "aria-describedby"];
const ATTR_PREFIX = new RegExp(`\\b(?:${STRIP_ATTR_NAMES.join("|")}|data-[\\w-]+)\\s*=\\s*`, "g");

function stripAttributeValues(src: string): string {
  let out = "";
  ATTR_PREFIX.lastIndex = 0;
  let match: RegExpExecArray | null;
  let lastEnd = 0;
  while ((match = ATTR_PREFIX.exec(src)) !== null) {
    out += src.slice(lastEnd, match.index + match[0].length);
    const j = match.index + match[0].length;
    if (j >= src.length) {
      lastEnd = j;
      continue;
    }
    const ch = src[j];
    if (ch === '"' || ch === "'") {
      // Quoted: skip to matching quote.
      const close = src.indexOf(ch, j + 1);
      lastEnd = close === -1 ? src.length : close + 1;
    } else if (ch === "{") {
      // Brace-balanced scan over the JSX expression container.
      let depth = 1;
      let k = j + 1;
      while (k < src.length && depth > 0) {
        if (src[k] === "{") depth++;
        else if (src[k] === "}") depth--;
        k++;
      }
      lastEnd = k;
    } else {
      lastEnd = j;
    }
  }
  out += src.slice(lastEnd);
  return out;
}

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

function scanForOffenders(): Array<{ file: string; matches: string[] }> {
  const offenders: Array<{ file: string; matches: string[] }> = [];
  for (const dir of SCAN_DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const file of walk(abs)) {
      const rel = path.relative(ROOT, file);
      if (FILE_ALLOWLIST.has(rel)) continue;
      const raw = fs.readFileSync(file, "utf8");
      // Strip href/id/aria-/data-* attribute values before scanning so hash
      // links and DOM ids with hex-shaped content are not treated as colour
      // literals. Brace-balanced so `id={`x-${y}`}` does not leak orphan tails.
      const src = stripAttributeValues(raw);
      const hits = [...(src.match(HEX) ?? []), ...(src.match(FUNC) ?? [])];
      if (hits.length > 0) {
        offenders.push({ file: rel, matches: hits });
      }
    }
  }
  return offenders;
}

describe("no-hardcoded-color: source files", () => {
  let offenders: Array<{ file: string; matches: string[] }> = [];

  beforeAll(() => {
    offenders = scanForOffenders();
  });

  it("contains no hex literals or rgb/rgba/hsl/hsla functions", () => {
    expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
  });
});

describe("stripAttributeValues — brace-balanced JSX expression strip", () => {
  it("strips nested template literal in id={`x-${y}`}", () => {
    const src = "<button id={`tab-${id}`}>x</button>";
    expect(stripAttributeValues(src)).not.toContain("`tab");
    // No orphan closing brace artefact:
    expect(stripAttributeValues(src)).not.toMatch(/}>/);
  });

  it("strips quoted href values", () => {
    expect(stripAttributeValues('<a href="#hash">x</a>')).not.toContain("#hash");
  });

  it("strips data-* attribute values", () => {
    expect(stripAttributeValues('<a data-anchor="#3a4b5c">x</a>')).not.toContain("#3a4b5c");
  });

  it("strips aria-controls expression value", () => {
    expect(stripAttributeValues("<button aria-controls={`panel-${id}`}>x</button>")).not.toContain(
      "panel-"
    );
  });

  it("preserves non-attribute content unchanged", () => {
    const src = 'const c = "#abcdef";';
    expect(stripAttributeValues(src)).toBe(src);
  });
});
