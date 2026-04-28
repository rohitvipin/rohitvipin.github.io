# Non-Functional Test Gap Analysis

Scope: portfolio site (Next.js 16 static export, GitHub Pages). Baseline drawn from `docs/QA_TEST_PLAN.md`, `e2e/`, `src/__tests__/`, `.github/workflows/{ci,deploy}.yml`, `vitest.config.ts`, `src/app/layout.tsx`.

Severity legend: P0 = block merge, P1 = fix this milestone, P2 = backlog.

> **Status:** v2 — revised after 3-architect review (critic + architect + test-engineer). See `## Revision Log` at end. Verdict: **APPROVE-WITH-CHANGES**, revisions applied below in-line. Risk profile recalibrated for personal-portfolio scope (no PII, no auth, no payments).

---

## Coverage Snapshot

| NFR Domain        | Current Coverage                                                                 | Gap Tier |
| ----------------- | -------------------------------------------------------------------------------- | -------- |
| Accessibility     | TC-12 manual rule checks (skip link, alt, labels, heading order)                 | P0       |
| Performance       | TC-14 preload + 4xx + render-blocking scripts only                               | P0       |
| Security          | TC-13 CSP meta, referrer, secret regex; `npm audit --audit-level=critical`       | P1       |
| SEO               | OG/Twitter/JSON-LD presence; no sitemap/robots/canonical structure tests         | P1       |
| Responsive/Touch  | TC-06/07 horizontal-scroll + WCAG 2.5.5 sizes                                    | covered  |
| Reliability       | Vitest unit/integration + 90% coverage                                           | covered  |
| Cross-browser     | Playwright **Chromium-only** (default project, no `firefox`/`webkit`)            | P1       |
| Reduced motion    | none                                                                             | P1       |
| Bundle size       | none                                                                             | P1       |
| Visual regression | none                                                                             | P2       |
| Link integrity    | none (external URLs in projects/socials/community)                               | P1       |
| Keyboard nav      | Mobile-drawer focus-trap only (TC-05.6); no full-page Tab order or focus-visible | P1       |
| Color contrast    | none                                                                             | P0       |
| Hash anchors      | none — `data/nav.json` hashes never asserted against rendered section IDs        | P1       |
| Dependency audit  | critical-only; no licence/SBOM, no `--audit-level=high`                          | P1       |
| Print/PDF         | resume generator unit-tested; live page print stylesheet untested                | P2       |

---

## Gaps + Implementation Research

### G1 — Automated WCAG 2.1 AA Audit (P0)

**Gap.** TC-12 covers ~12 hand-rolled rules. No axe-core sweep — colour contrast, ARIA misuse, landmark uniqueness, region coverage, list semantics all untested.

**Implementation.** `@axe-core/playwright` (MIT, Deque). Wired per-viewport in `e2e/all-viewports/tc-15-axe.spec.ts`:

```ts
import AxeBuilder from "@axe-core/playwright";
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
  .analyze();
expect(results.violations).toEqual([]);
```

Run on root + each section anchor (`#about`, `#impact`, …) per viewport. Both themes — toggle theme via `addInitScript` (matches existing TC-10 pattern). Disable rules selectively only with documented exceptions in `.axe-exclusions.json`.

**Effort.** ~0.5 day. Adds ~30s to E2E run.

---

### G2 — Core Web Vitals + Lighthouse Budgets (P0)

**Gap.** TC-14 has no LCP/CLS/INP/TBT thresholds. No bundle/asset budget.

**Implementation.** Two layers:

1. **Lighthouse CI** (`@lhci/cli`) in `.github/workflows/ci.yml` with `lighthouserc.json` budget gates:

   ```json
   {
     "ci": {
       "collect": { "staticDistDir": "./out", "numberOfRuns": 3 },
       "assert": {
         "preset": "lighthouse:recommended",
         "assertions": {
           "categories:performance": ["error", { "minScore": 0.95 }],
           "categories:accessibility": ["error", { "minScore": 1.0 }],
           "categories:best-practices": ["error", { "minScore": 0.95 }],
           "categories:seo": ["error", { "minScore": 1.0 }],
           "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
           "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
           "total-blocking-time": ["error", { "maxNumericValue": 200 }],
           "first-contentful-paint": ["error", { "maxNumericValue": 1800 }]
         }
       }
     }
   }
   ```

   Static-export friendly — uses `staticDistDir`, no server.

2. **In-browser Web Vitals probe** as Playwright spec for ad-hoc local runs using `web-vitals` library — captures real INP under interaction (Lighthouse synthesises INP, doesn't measure).

**Effort.** ~1 day. CI adds ~90s (3 runs × Chromium headless on `out/`).

---

### G3 — Bundle Size Budget (P1)

**Gap.** `out/` size unbounded. A reckless `react-icons` glob import or unminified asset slips through.

**Implementation.** Two complementary checks:

1. **Static budget** in CI — fail if `out/_next/static/chunks/*.js` total gzipped > target. Use `size-limit` (`.size-limit.json`):
   ```json
   [
     { "path": "out/_next/static/chunks/*.js", "limit": "180 KB", "gzip": true },
     { "path": "out/_next/static/css/*.css", "limit": "30 KB", "gzip": true },
     { "path": "out/index.html", "limit": "60 KB" }
   ]
   ```
2. **Lighthouse `resource-summary`** assertion already covers per-resource budgets via `lighthouserc.json`.

Reuses build artefact. Sub-second runtime.

---

### G4 — Colour Contrast (P0)

**Gap.** Light + dark theme tokens defined in `globals.css`; no test that text/background pairs hit WCAG AA (4.5:1 normal, 3:1 large, 3:1 UI).

**Implementation.** Covered transitively by G1 (axe `color-contrast` rule). Plus a deterministic unit test in `src/__tests__/contrast.test.ts` using `wcag-contrast` against the token pairs in `globals.css` so theme changes can't pass-through unnoticed:

```ts
import { hex } from "wcag-contrast";
const pairs: Array<[string, string, number]> = [
  [TOKENS.dark.text, TOKENS.dark.bg, 4.5],
  [TOKENS.dark.muted, TOKENS.dark.surface, 4.5],
  [TOKENS.light.text, TOKENS.light.bg, 4.5],
  // …
];
for (const [fg, bg, min] of pairs) expect(hex(fg, bg)).toBeGreaterThanOrEqual(min);
```

Tokens parsed from `globals.css` at test time so the file remains source-of-truth.

---

### G5 — Keyboard Navigation Sweep (P1)

**Gap.** Only mobile drawer focus-trap (TC-05.6). No Tab-order test for full page, no `:focus-visible` outline assertion, no skip-link jump verification.

**Implementation.** `e2e/all-viewports/tc-16-keyboard.spec.ts`:

- Walk Tab through `document.activeElement`, assert order matches DOM order, no traps, no negative `tabindex` on interactive elements.
- Press Tab once on fresh page → first focus = skip link → Enter → `window.scrollY` jumps and `#main-content` receives focus or contains `:target`.
- Snapshot computed `outline`/`box-shadow` on focused element ≠ `none` (focus-visible regression guard).
- Theme toggle, hamburger, scroll-to-top reachable via Tab.

---

### G6 — Reduced Motion (P1)

**Gap.** `ScrollToTop`, theme transition, `:hover` animations untested under `prefers-reduced-motion: reduce`.

**Implementation.** Playwright `emulateMedia({ reducedMotion: "reduce" })` per spec. Assert:

- ScrollToTop click — no `behavior: "smooth"` path; instant scroll.
- Element transitions reduced (CSS rule `@media (prefers-reduced-motion: reduce) { … }` exists in `globals.css` — currently absent → fix needed).

Implementation note: requires adding the media-query block to `globals.css` first; test then locks it in.

---

### G7 — Cross-Browser (P1)

**Gap.** `playwright.config.ts` projects only set viewport, default to Chromium. Real users hit Safari (WebKit) and Firefox.

**Implementation.** Add browser matrix:

```ts
projects: [
  {
    name: "chromium-desktop",
    use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
  },
  {
    name: "webkit-desktop",
    use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
  },
  {
    name: "firefox-desktop",
    use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } },
  },
  // tablet/mobile: keep Chromium + add WebKit (iOS Safari is ~25% of mobile traffic)
];
```

CI install: `npx playwright install --with-deps chromium webkit firefox`. Roughly +60s install + ~3× spec runtime; mitigate by sharding (`--shard 1/3`) in matrix job.

---

### G8 — Broken-Link Audit (P1)

**Gap.** External URLs in `data/projects.json`, `data/socials.json`, `data/community.json`, `data/awards.json` never validated. Stale links erode credibility.

**Implementation.** Scheduled (weekly) workflow `link-check.yml` using `lychee-action`:

```yaml
- uses: lycheeverse/lychee-action@<pinned-sha>
  with:
    args: >-
      --no-progress
      --max-concurrency 8
      --accept 200,206,429
      --exclude-mail
      out/**/*.html data/*.json
    fail: true
```

Run after `npm run build`. Cron: `0 6 * * 1`. Don't gate every PR (flaky on third-party 5xx) — open issue on failure instead. Internal anchors checked separately (G9).

---

### G9 — Hash Anchor Integrity (P1)

**Gap.** `data/nav.json` entries point at `#about`, `#impact`, `#expertise`, etc. If section ID is renamed, nav silently breaks scroll. No test.

**Implementation.** Vitest integration test in `src/__tests__/nav-anchors.test.tsx`:

```ts
import navData from "../../data/nav.json";
render(<Page />);
for (const link of navData) {
  if (!link.href.startsWith("#")) continue;
  const id = link.href.slice(1);
  expect(document.getElementById(id), `nav anchor #${id} unresolved`).toBeTruthy();
}
```

Ten lines, runs in unit suite.

---

### G10 — Sitemap + Robots Structure (P1)

**Gap.** `utils/generate-sitemap.test.ts` covers builder logic but no test asserts `out/sitemap.xml` and `public/robots.txt` are well-formed XML/text and reference each other correctly.

**Implementation.** Post-build Vitest spec:

- `out/sitemap.xml` parses as XML, contains `<urlset xmlns>`, every `<loc>` is a `200 OK` against `out/`.
- `public/robots.txt` contains `Sitemap: https://rohitvipin.github.io/sitemap.xml` and `User-agent: *` block.
- Canonical `<link rel="canonical">` in `out/index.html` matches `BASE_URL`.

Use `fast-xml-parser` (already permissive, no DOM) and `node:fs`. Runs in `scripts/test:postbuild`.

---

### G11 — Dependency Audit Hardening (P1)

**Gap.** `npm audit --audit-level=critical` lets HIGH-severity advisories through. No licence policy, no SBOM.

**Implementation.**

1. Bump CI to `--audit-level=high`. Document exceptions via `.npmrc` `audit-exclude` or `npm audit signatures` allowlist.
2. Add `license-checker --failOn 'GPL-3.0;AGPL-3.0;SSPL-1.0'` step (portfolio is closed-source-style, copyleft would be a problem if pulled in).
3. SBOM: `npm sbom --sbom-format=cyclonedx > sbom.json` archived as CI artefact.
4. Optional: `osv-scanner` (Google, OSS) for supply-chain CVE coverage broader than `npm audit`.

---

### G12 — Visual Regression (P2)

**Gap.** No baseline screenshot diffing. CSS regressions only caught manually.

**Implementation.** Playwright built-in `toHaveScreenshot()` per section per theme per viewport. Baseline stored in `e2e/__screenshots__/` and gitignored from PR runs by default — promote via dedicated `update-snapshots` workflow. Use `maxDiffPixelRatio: 0.01`. Risk: flaky on font-rendering differences across CI runners — pin to single OS image (`ubuntu-22.04`) and disable animations (`use: { reducedMotion: "reduce" }`).

---

### G13 — Print Stylesheet (P2)

**Gap.** Resume PDF generated separately via `@react-pdf/renderer`, but live page printed via browser produces unstyled output.

**Implementation.** Either (a) add `@media print` block to `globals.css` collapsing nav/cta/scroll-to-top and verify via `page.emulateMedia({ media: "print" })` + `toHaveScreenshot`, or (b) explicitly suppress print with `@media print { html { display: none } body::before { content: "Use the PDF resume linked above" } }` and test the suppression message.

---

## Suggested Roll-Out

| Wave | Items           | Why first                                                          |
| ---- | --------------- | ------------------------------------------------------------------ |
| 1    | G1, G2, G4, G9  | Cheap, P0, no infra change. Catch most a11y/perf regressions today |
| 2    | G3, G5, G6, G10 | Tightens budgets and hidden interactions before they regress       |
| 3    | G7, G8, G11     | Broader supply-chain + browser coverage; needs CI matrix work      |
| 4    | G12, G13        | Polish; high noise risk, defer until baselines stable              |

---

## Tooling Summary

| Need              | Pick                            | Reason                                       |
| ----------------- | ------------------------------- | -------------------------------------------- |
| A11y sweep        | `@axe-core/playwright`          | WCAG 2.1 mapping, MIT, Playwright-native     |
| Perf budgets      | `@lhci/cli`                     | Static-export support, GitHub Action ready   |
| Bundle budgets    | `size-limit`                    | gzip-aware, fast, framework-agnostic         |
| Contrast unit     | `wcag-contrast`                 | Pure-fn, deterministic, 5KB                  |
| Link audit        | `lycheeverse/lychee-action`     | Concurrent, accepts allow-list, action-ready |
| Visual regression | Playwright `toHaveScreenshot()` | No new dep; same runner                      |
| SBOM              | `npm sbom` + `osv-scanner`      | First-party + Google OSS; no signup          |

All tools support pinned-SHA actions and reproducible CI.
