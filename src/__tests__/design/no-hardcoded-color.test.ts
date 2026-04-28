import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Backstop for the ESLint `no-restricted-syntax` rule. Globs the full
 * components + app trees on every CI run, not just staged files. Catches
 * hex/rgb/hsl literals in JSX className strings, style props, or string
 * literals — same regex the lint rule applies, run as a unit test.
 */

const ROOT = path.resolve(__dirname, "../../..");
const SCAN_DIRS = ["src/components", "src/app"];

/**
 * Browser theme-color meta requires literal hex; CSS vars are not resolved
 * by user-agents reading `<meta name="theme-color">`. Exempt the single
 * file that produces the meta tag.
 */
const FILE_ALLOWLIST = new Set<string>(["src/app/layout.tsx"]);

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FUNC = /\b(?:rgb|rgba|hsl|hsla)\s*\(/g;

/**
 * Mirror the ESLint rule's exemptions: hex-shaped strings inside `id` and
 * `href` JSXAttributes (e.g. `<a href="#hash">`) are not colours. Strip
 * matches inside attributes named `id=` / `href=` before scanning.
 */
const HREF_OR_ID_ATTR = /(?:href|id)=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g;

// `.tsx` files only; CSS lives in globals.css and is allowed there.
function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

describe("no-hardcoded-color: source files", () => {
  const offenders: Array<{ file: string; matches: string[] }> = [];

  for (const dir of SCAN_DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const file of walk(abs)) {
      const rel = path.relative(ROOT, file);
      if (FILE_ALLOWLIST.has(rel)) continue;
      const raw = fs.readFileSync(file, "utf8");
      // Strip href/id attributes before scanning so hash links and DOM ids
      // with hex-shaped content are not treated as colour literals.
      const src = raw.replace(HREF_OR_ID_ATTR, "");
      const hits = [...(src.match(HEX) ?? []), ...(src.match(FUNC) ?? [])];
      if (hits.length > 0) {
        offenders.push({ file: rel, matches: hits });
      }
    }
  }

  it("contains no hex literals or rgb/rgba/hsl/hsla functions", () => {
    expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
  });
});
