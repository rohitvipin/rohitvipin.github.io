# Non-Functional Test Gap Analysis

Scope: portfolio site (Next.js 16 static export, GitHub Pages). Baseline drawn from `docs/QA_TEST_PLAN.md`, `e2e/`, `src/__tests__/`, `.github/workflows/{ci,deploy}.yml`, `vitest.config.ts`, `src/app/layout.tsx`, `src/__tests__/design/`.

Severity legend: P0 = block merge, P1 = fix this milestone, P2 = backlog.

> **Status:** v3.2 — Wave 1 + G2 shipped (G2, G9, G11, G14, G21, G25, G27). G2 reconciled with actual `lighthouserc.json` (composite category gates ARE enforced; numberOfRuns: 3). Coverage Snapshot rows for Performance / CSP regression / Hash anchors flipped to `covered`. See `## Revision Log`.

---

## Already Shipped (since v1)

Design-system test layer landed across three commits and changes the gap surface:

| Coverage                      | Location                                          | Notes                                                                                                     |
| ----------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Token parity + WCAG contrast  | `src/__tests__/design/tokens.test.ts`             | PostCSS parses `globals.css`; asserts `CONTRAST_PAIRS` from `@/lib/tokens` satisfy WCAG in both themes.   |
| Structural a11y on primitives | `src/__tests__/design/a11y.test.tsx`              | `jest-axe` on TechChip, TagBadge, StatusPill, TabPill, Button, ButtonLink, SectionHeader, SocialLinks.    |
| Hex/rgb/hsl literal ban       | `src/__tests__/design/no-hardcoded-color.test.ts` | Backstop for ESLint `no-restricted-syntax`; scans `src/components` + `src/app`. `layout.tsx` allowlisted. |
| Axe rule scope policy         | `src/__tests__/design/axe-config.ts`              | Disables layout/contrast/focus-order rules at unit layer (those are E2E concerns).                        |
| Component primitives suite    | `src/__tests__/design/primitives.test.tsx`        | Render/visibility/prop tests for design primitives.                                                       |

This closes G4 entirely and partially closes G1 (unit-level structural a11y). E2E full-page WCAG sweep on the integrated page still missing.

---

## Coverage Snapshot

| NFR Domain              | Current Coverage                                                                                                                  | Gap Tier |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Colour contrast         | `src/__tests__/design/tokens.test.ts` (PostCSS + WCAG, both themes); ESLint `no-restricted-syntax` + Vitest backstop              | covered  |
| Structural a11y (units) | `src/__tests__/design/a11y.test.tsx` on shared primitives                                                                         | covered  |
| Accessibility (E2E)     | TC-12 manual rules (skip link, alt, labels, heading order); no integrated full-page axe sweep                                     | P0       |
| Performance             | TC-14 preload + 4xx + render-blocking; Lighthouse CI on `deploy.yml` enforces LCP/CLS/TBT + composite category gates (G2 shipped) | covered  |
| Security                | TC-13 CSP meta + referrer + 3-pattern secret regex; `npm audit --audit-level=high` + GHAS dependency-review + gitleaks (PR-only)  | P1       |
| SEO                     | OG/Twitter/JSON-LD presence; no sitemap/robots/canonical structure tests                                                          | P1       |
| Cross-browser           | Playwright Chromium-only (no Firefox/WebKit)                                                                                      | P2       |
| Reduced motion          | `globals.css:118` has the media block; no test guards it                                                                          | P1       |
| Bundle size             | none                                                                                                                              | P1       |
| Link integrity          | none (external URLs in projects/socials/community/awards)                                                                         | P1       |
| Keyboard nav            | Mobile-drawer focus-trap only (TC-05.6); no full-page Tab order or focus-visible                                                  | P1       |
| Hash anchors            | `SECTION_IDS` registry + `NavLinkSchema` href refinement + lint-data assertions (G9 shipped)                                      | covered  |
| Dependency audit        | `npm audit --audit-level=high` on PR + main; GHAS dependency-review on PRs (G11/G29 shipped)                                      | covered  |
| CSP regression          | `e2e/all-viewports/tc-19-csp.spec.ts` parses + snapshots directives (G14 shipped)                                                 | covered  |
| JSON-LD validity        | `@type` only; no required-prop assertions                                                                                         | P1       |
| Hydration errors        | implicit via TC-00.3 `console.error`; not React 19 wording-robust                                                                 | P1       |
| LCP element             | `fetchPriority="high"` set; no test that avatar IS the LCP element                                                                | P1       |
| Secret detection        | TC-13 3-pattern regex (AKIA/ghp\_/Bearer) + gitleaks PR scan over diff and full history (G25 shipped)                             | covered  |
| Mixed content           | no automated check that `data/*.json` URLs are `https://`                                                                         | P1       |
| Responsive/Touch        | TC-06/07 horizontal-scroll + WCAG 2.5.5 sizes                                                                                     | covered  |
| Reliability             | Vitest unit/integration + 90% coverage threshold                                                                                  | covered  |
| Web manifest            | referenced in layout; not parsed/validated                                                                                        | P2       |
| HTML validity           | none                                                                                                                              | P2       |
| No-JS fallback          | none                                                                                                                              | P2       |
| 404 page                | `out/404.html` generated; untested                                                                                                | P2       |
| Service worker          | none registered; no absence guard                                                                                                 | P2       |
| Details overflow        | mobile clip risk in expanded `<details>`                                                                                          | P2       |
| OG image dim            | `1200x630` declared; not asserted at build time                                                                                   | P2       |
| Print/PDF               | resume PDF generated separately; live page print untested                                                                         | P2       |
| Visual regression       | dropped — font-render flake; manual QA via `portfolio-qa` skill suffices                                                          | dropped  |

---

## Gaps + Implementation Research

### G1 - Full-page WCAG 2.1 AA Audit (P0, partial)

**Status.** Unit-layer structural a11y is shipped (`src/__tests__/design/a11y.test.tsx` via `jest-axe` on primitives). `axe-config.ts` deliberately disables layout/contrast/focus-order rules at unit layer — those are E2E concerns.

**Remaining gap.** No full-page axe sweep on the rendered/integrated page. TC-12 covers ~12 hand-rolled rules only.

**Implementation.** `@axe-core/playwright` (MIT, Deque, **>=4.10 required for React 19 hydration timing**). Spec: `e2e/all-viewports/tc-15-axe.spec.ts`.

```ts
import AxeBuilder from "@axe-core/playwright";
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
  .analyze();
expect(results.violations).toEqual([]);
```

**Scope.** Root + `#experience` (most DOM complexity, `<details>` open/closed) + `#projects` (tab interaction). One desktop viewport per theme + one mobile-iPhone-14 viewport on dark-theme only — closes mobile-only a11y bugs (touch-target inside open `<details>`, hamburger drawer focus order). Total: 5 axe runs, ~60s added to E2E.

Theme toggle via `localStorage.setItem("theme", ...)` in `addInitScript` (matches existing TC-10 pattern). Disable rules selectively only with documented exceptions in `.axe-exclusions.json`.

WCAG criteria axe still cannot evaluate (record in spec comment): `2.4.7 Focus Visible` (custom outlines), `1.4.11 Non-text Contrast` (icon buttons), `2.5.3 Label in Name` — covered manually by G5/TC-12.

**Effort.** ~0.5 day.

---

### G2 - Core Web Vitals + Lighthouse Budgets (SHIPPED)

**Status.** Lighthouse CI shipped in `deploy.yml` via `lighthouse: true` input on the reusable workflow `.github/workflows/_lint-test-build.yml`. Runs `npx lhci autorun` against `./out` after the static export, uploads the report on failure.

**Config.** `.github/lighthouse/lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./out",
      "numberOfRuns": 3,
      "settings": { "preset": "desktop", "skipAudits": ["uses-http2", "redirects-http"] }
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "color-contrast": "error",
        "image-alt": "error",
        "label": "error",
        "link-name": "error",
        "button-name": "error",
        "duplicate-id-aria": "error",
        "heading-order": "error",
        "tap-targets": "error",
        "largest-contentful-paint": ["warn", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 300 }]
      }
    }
  }
}
```

**Composite category gates ARE enforced.** Accessibility (>=0.95) and SEO (>=0.95) are blocking errors; best-practices (>=0.9) is blocking; performance (>=0.9) is a warning to absorb shared-runner variance. Specific a11y audits (`color-contrast`, `tap-targets`, `image-alt`, etc.) are blocking errors and are deterministic regardless of perf flake.

**`numberOfRuns: 3`** chosen as runtime/signal trade-off. Bump to 5 with median if flake on `largest-contentful-paint` is observed.

**Remaining follow-up.** Bundle/asset size budget (G3) and full-page WCAG E2E sweep (G1 E2E) still open — see those gaps.

**Footgun.** Next 16 `trailingSlash: true` resolves `/` to `out/index.html` under LHCI's static server — verified working in `deploy.yml`.

---

### G3 - Bundle Size Budget (P1)

**Gap.** `out/` size unbounded. Reckless `react-icons` glob import or unminified asset slips through.

**Implementation.** `size-limit` (`.size-limit.json`):

```json
[
  { "path": "out/_next/static/chunks/*.js", "gzip": true, "limit": "TBD" },
  { "path": "out/_next/static/css/*.css", "gzip": true, "limit": "TBD" },
  { "path": "out/index.html", "limit": "TBD" }
]
```

**Set `limit` after measuring baseline.** Add 10% headroom. Sub-second runtime.

**Effort.** ~2 hours (mostly baseline + tuning).

---

### G4 - Colour Contrast (DONE)

**Shipped.** `src/__tests__/design/tokens.test.ts` parses `src/app/globals.css` via PostCSS, walks `:root` and `[data-theme="light"]` blocks, asserts every token in `TOKEN_KEYS` (registry at `src/lib/tokens.ts`) has a non-empty value, asserts theme parity, then iterates `CONTRAST_PAIRS` and applies `wcag-contrast.hex(fg, bg) >= min` per theme.

**Plus belt:** ESLint `no-restricted-syntax` + Vitest `no-hardcoded-color.test.ts` ban hex/rgb/hsl literals across `src/components` + `src/app` (`layout.tsx` allowlisted for theme-color meta). Forces all colour through the token registry.

No further work needed. The earlier v2 R-05 proposal (TS source-of-truth via `contrast-tokens.ts`) was solved differently — CSS remains source of truth, tokens registry typed at `@/lib/tokens`, parser is PostCSS. Cleaner than the proposed generator.

---

### G5 - Keyboard Navigation Sweep (P1)

**Gap.** Only mobile drawer focus-trap (TC-05.6). No Tab-order test for full page, no `:focus-visible` outline assertion, no skip-link jump verification.

**Implementation.** `e2e/all-viewports/tc-16-keyboard.spec.ts`:

- Walk Tab through `document.activeElement`; assert order matches DOM order, no traps, no negative `tabindex` on interactive elements.
- Press Tab once on fresh page → first focus = skip link → Enter → `window.scrollY` jumps and `#main-content` receives focus.
- Snapshot computed `outline`/`box-shadow` on focused element != `none` (focus-visible regression guard).
- Theme toggle, hamburger, scroll-to-top reachable via Tab.

**Effort.** ~0.5 day.

---

### G6 - Reduced Motion Test Guard (P1)

**Gap.** `globals.css:118` HAS the `@media (prefers-reduced-motion: reduce)` block. No test asserts the block exists or that ScrollToTop respects it.

**Implementation.** Two specs:

1. Vitest unit (`src/__tests__/design/reduced-motion.test.ts`): use the existing PostCSS pipeline, walk for an `@media (prefers-reduced-motion: reduce)` AtRule, assert canonical animation-duration / transition-duration declarations are present.
2. Playwright (`e2e/all-viewports/tc-18-reduced-motion.spec.ts`): `page.emulateMedia({ reducedMotion: "reduce" })`, click ScrollToTop, assert scroll completes within one frame (instant, not smooth).

**Effort.** ~2 hours.

---

### G7 - Cross-Browser (P2 - optional nightly only)

**Gap.** Playwright projects only set viewport; default to Chromium.

**Plan.** Drop Firefox (~3% global). Drop blocking gate. **Optional nightly cron** running `webkit-desktop` only on `ubuntu-latest`. WebKit on Linux is a partial signal for Safari macOS — catches ~80% of WebKit-class regressions, not 100%. Don't put on PR critical path.

**Effort.** ~2 hours if executed; deferred until a real Safari bug ships.

---

### G8 - Broken-Link Audit (P1)

**Gap.** External URLs in `data/projects.json`, `data/socials.json`, `data/community.json`, `data/awards.json` never validated.

**Implementation.** Scheduled (weekly) workflow `link-check.yml` using `lycheeverse/lychee-action`:

```yaml
- uses: lycheeverse/lychee-action@<pinned-sha>
  with:
    args: >-
      --no-progress --max-concurrency 8 --retry-wait-time 30 --max-retries 3
      --accept 200,206 --exclude-mail
      out/**/*.html data/*.json
    fail: true
```

**Don't `--accept 429`.** Either retry-with-backoff (set above) or fail and triage. Silent acceptance masks rate-limited failures.

Cron `0 6 * * 1` (Mon 06:00 UTC). Open issue on failure; do not gate every PR.

**Effort.** ~1 hour.

---

### G9 - Hash Anchor Integrity (P1)

**Gap.** `data/nav.json` entries point at `#about`, `#impact`, `#expertise`, etc. Section ID rename silently breaks scroll.

**Implementation.** Build-time `lint-data.ts` rule (no browser):

```ts
const SECTION_IDS = [
  "about",
  "impact",
  "experience",
  "expertise",
  "projects",
  "skills",
  "community",
  "awards",
  "education",
] as const;
for (const link of nav) {
  if (!link.href.startsWith("#")) continue;
  const id = link.href.slice(1);
  if (!SECTION_IDS.includes(id as (typeof SECTION_IDS)[number]))
    throw new Error(`nav.json href "#${id}" has no matching section`);
}
```

`SECTION_IDS` becomes the registry — any rename surfaces in `lint-data` failure. Faster, simpler than Playwright DOM probe. Scroll-behaviour interactions remain in TC-09.

**Effort.** ~30 min.

---

### G10 - Sitemap + Robots Structure (P1)

**Gap.** `utils/generate-sitemap.test.ts` covers builder logic but no test asserts `out/sitemap.xml` and `public/robots.txt` are well-formed and reference each other.

**Implementation.** Postbuild Vitest spec (`utils/postbuild.test.ts`):

- `out/sitemap.xml` parses as XML (`fast-xml-parser`), contains `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, every `<loc>` resolves via `fs.existsSync(path.join("out", urlPath, "index.html"))`.
- No `<loc>` contains `localhost`, `127.0.0.1`, or staging hostnames.
- `public/robots.txt` contains `Sitemap: https://rohitvipin.github.io/sitemap.xml` and a `User-agent: *` block.
- `<link rel="canonical">` in `out/index.html` matches `BASE_URL`.

**Required workflow change.** Add `fetch-depth: 0` to `actions/checkout` step in `deploy.yml` so `git log` for sitemap `lastmod` works on what is currently a shallow clone.

**Effort.** ~3 hours.

---

### G11 - Dependency Audit Hardening (P1)

**Gap.** `npm audit --audit-level=critical` lets HIGH-severity advisories through.

**Implementation.** Bump CI step to `--audit-level=high`. No SBOM, no `license-checker`, no `osv-scanner` — six MIT/Apache runtime deps on a personal portfolio is not a supply-chain target. Re-evaluate if dep tree exceeds ~50 transitives. Dependabot already configured (`.github/dependabot.yml`, weekly grouped npm + actions).

Add **GHAS Dependency Review action** on PRs (one line in `ci.yml`, `actions/dependency-review-action@<sha>`) — free for public repos; blocks PRs introducing known-vulnerable deps.

**Effort.** ~10 min.

---

### G12 - Visual Regression (dropped)

Font-render flake on shared GitHub runners + maintenance burden not justified. `portfolio-qa` skill covers manual visual checks. Re-evaluate only if a CSS regression actually ships.

---

### G13 - Print Stylesheet (P2)

**Gap.** Live page printed via browser produces unstyled output; PDF resume is generated separately.

**Implementation.** Add `@media print` suppression block to `globals.css` redirecting to PDF:

```css
@media print {
  body > * {
    display: none !important;
  }
  body::before {
    content: "Use the PDF resume linked at https://rohitvipin.github.io/Rohit_Vipin_Mathews_Resume.pdf";
    display: block;
    padding: 1rem;
  }
}
```

Test via `page.emulateMedia({ media: "print" })` + assert visible text equals the suppression message.

**Effort.** ~1 hour.

---

### G14 - CSP Regression Test (P1)

**Gap.** `<meta http-equiv="Content-Security-Policy">` exists at `src/app/layout.tsx:108-110`. No test asserts directives haven't been weakened.

**Implementation.** Spec `e2e/all-viewports/tc-19-csp.spec.ts`. Parse meta `content` into a `Record<string, string[]>` (sorted), use `toMatchInlineSnapshot`:

```ts
const csp = await page
  .locator('meta[http-equiv="Content-Security-Policy"]')
  .getAttribute("content");
const directives = parseCSP(csp); // returns sorted directive map
expect(directives).toMatchInlineSnapshot(`{ ... }`);
```

Whitespace/order changes don't trip the test; legitimate directive changes update the inline snapshot intentionally.

**Effort.** ~2 hours.

---

### G15 - JSON-LD Validity Beyond `@type` (P1)

**Gap.** TC-12.4 only checks `@type === "Person"` (`e2e/all-viewports/tc-12-accessibility.spec.ts:27-34`).

**Implementation.** Extend or add `tc-20-jsonld.spec.ts`:

- Required props: `name`, `url`, `jobTitle`, `image`, `sameAs[]` (length > 0).
- `sameAs` entries are valid `https://` URLs.
- Optional structural validation via `schema-dts` TS types.

**Effort.** ~1 hour.

---

### G16 - Hydration Mismatch Detection (P1)

**Gap.** TC-00.3 captures `console.error` for network errors; no explicit React 19 hydration assertion.

**Implementation.** Capture `page.on("console")` filtering `msg.type() === "error" || msg.type() === "warning"`, match against React-version-robust regex:

```ts
const HYDRATION_RE =
  /hydration|did not match|server.{0,40}(html|render)|client.{0,40}(html|render)/i;
const messages: string[] = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") messages.push(msg.text());
});
await page.goto("/");
expect(messages.filter((m) => HYDRATION_RE.test(m))).toEqual([]);
```

**Effort.** ~30 min.

---

### G17 - Web App Manifest Validity (P2)

**Gap.** `site.webmanifest` referenced in `layout.tsx`. No parse/validation test.

**Implementation.** Postbuild Vitest spec: parse `out/site.webmanifest` as JSON, assert required fields (`name`, `short_name`, `start_url`, `display`, `icons[]`); each icon `src` resolves.

**Effort.** ~30 min.

---

### G18 - HTML Validation (P2)

**Gap.** No structural HTML validation.

**Implementation.** `html-validate` against `out/**/*.html` as a postbuild Vitest spec or CI step. Catches malformed markup invisible to axe and Lighthouse. Adds ~5s in CI. Deterministic.

**Effort.** ~30 min.

---

### G19 - No-JS Fallback (P2)

**Gap.** Static export should render core content without JS. Untested.

**Implementation.** Playwright spec with `javaScriptEnabled: false`: assert hero, sections, social links visible; nav hash links navigate; theme defaults to system via CSS `prefers-color-scheme`.

**Effort.** ~30 min.

---

### G20 - 404 Page (P2)

**Gap.** Next.js generates `out/404.html`. Untested.

**Implementation.** Postbuild Vitest spec: file exists, contains brand link to `/`, theme tokens load, no broken asset references.

**Effort.** ~30 min.

---

### G21 - Service Worker Absence (P2)

**Gap.** No SW registered today. Accidental `next-pwa`/`workbox` install would cause stale-cache issues.

**Implementation.** One-line in TC-00 smoke:

```ts
const regs = await page.evaluate(() => navigator.serviceWorker?.getRegistrations() ?? []);
expect(regs).toHaveLength(0);
```

**Effort.** ~5 min.

---

### G22 - `<details>` Content-Clip on Mobile (P2)

**Gap.** TC-09 covers expand/collapse but not overflow. Long skill-chip lists may clip silently in mobile-viewport open `<details>`.

**Implementation.** Playwright (mobile viewport): for each opened `<details>`, assert `scrollHeight === clientHeight` on the content container.

**Effort.** ~30 min.

---

### G23 - LCP Element Identification (P1)

**Gap.** `fetchPriority="high"` set on avatar preload (`layout.tsx:122`); no test verifies the avatar IS the LCP element.

**Implementation.** Covered by G2's LHCI assertion `largest-contentful-paint-element` (warn level, details: true). On a desktop-only spec, inspect LHCI JSON output and assert the LCP node selector matches `picture img`.

**Effort.** built into G2.

---

### G24 - OG Image Dimension Assertion (P2)

**Gap.** `og-image.jpg` referenced as `1200x630` in `layout.tsx:65-67`. Not asserted at build time.

**Implementation.** Postbuild Vitest spec using `sharp`:

```ts
const meta = await sharp("public/og-image.jpg").metadata();
expect(meta).toMatchObject({ width: 1200, height: 630, format: "jpeg" });
```

**Effort.** ~15 min.

---

### G25 - Modern Secret Detection (P1, security)

**Gap.** TC-13.5 regex covers AKIA/ghp*/Bearer only. Missing `github_pat*`, `sk-ant-`, `sk-proj-`, `AIza`, `xox[bp]-`, JWT, PEM private keys.

**Implementation.** Replace bespoke regex with `gitleaks-action` in CI. Pre-built ruleset, scans git history, ~5s runtime. Pin to a commit SHA.

**Effort.** ~15 min.

---

### G26 - JSON-LD Escape Integration Test (P1, security)

**Gap.** `escapeForJsonLdScript` (`src/lib/escape.ts`) is invoked at `layout.tsx:127`. Existing layout test mocks the escape function (`src/__tests__/app/layout.test.tsx:64`); end-to-end escape behaviour unverified.

**Implementation.** New integration spec — render real layout with a malicious `profile.name` like `</script><script>alert(1)</script>`, assert rendered HTML contains `<` (escaped) and not raw `<` characters.

**Effort.** ~30 min.

---

### G27 - `https://`-only Link Refinement (P1, security)

**Gap.** `data/*.json` link fields validated via Zod URL schema; no protocol enforcement. A `http://` URL would be a mixed-content warning.

**Implementation.** Refinement to URL schemas in `src/lib/schemas.ts` for `socials`, `projects`, `community`, `awards`:

```ts
z.string()
  .url()
  .refine((u) => u.startsWith("https://"), { message: "must be https://" });
```

Caught by `npm run lint:data`.

**Effort.** ~15 min.

---

### G28 - PII Allowlist on Data Files (P1, security)

**Gap.** Future content edits could leak unintended emails/phones in `data/*.json`. `profile.json` contains real name/location intentionally; the rest should not contain PII.

**Implementation.** `lint-data.ts` rule: regex-scan `data/*.json` (excluding `profile.json` allowlisted fields). Email pattern `[\w.+-]+@[\w-]+\.[\w.-]+`, E.164 phone `\+?[\d -]{10,15}`. Fail on match outside allowlist.

**Effort.** ~30 min.

---

### G29 - GHAS Dependency Review Action (covered by G11)

Folded into G11. One-line workflow add: `actions/dependency-review-action@<sha>` on PRs. Free for public repos; PR-time blocking.

---

## Roll-Out Wave Plan

| Wave    | Items                                                  | Effort    | Why                                                                                                                                |
| ------- | ------------------------------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| done    | G4 (entire), G1 (unit-level)                           | shipped   | Design-system test layer (commits `b01634c`, `565554d`, `e2619dd`).                                                                |
| done    | G9, G11, G14, G21, G25, G27 (Wave 1)                   | shipped   | SECTION_IDS registry + Zod refinement; gitleaks-action + dep-review; npm audit high; CSP regression snapshot; SW absence guard.    |
| done    | G2 (Lighthouse CI)                                     | shipped   | `.github/lighthouse/lighthouserc.json` + `lighthouse: true` in `deploy.yml`; composite category gates + numeric metric assertions. |
| 2       | G1 (E2E sweep), G3, G10, G23                           | ~2 days   | Full-page WCAG via @axe-core/playwright; bundle baseline; sitemap structure.                                                       |
| 3       | G5, G6, G15, G16, G18, G26, G28                        | ~1.5 days | Keyboard sweep, reduced-motion test, JSON-LD validity, hydration regex, html-validate, JSON-LD escape integration, PII allowlist.  |
| 4       | G8, G13, G17, G19, G20, G22, G24                       | ~1 day    | Polish: link audit (cron), print suppression, manifest, no-JS, 404, details overflow, OG dim.                                      |
| dropped | G7 (WebKit nightly, optional), G12 (visual regression) | —         | Re-evaluate only on demonstrated need.                                                                                             |

**Total remaining:** ~4.5 days across 15 gaps + 5 dropped/deferred + 9 shipped.

---

## CI Runtime Projection

- Current PR critical path: ~5 min.
- After Wave 1: +<1 min.
- After Wave 2 (G1 E2E axe ~60s + G3 size-limit ~30s): ~7 min on PR; deploy already runs LHCI 3-run (~90s).
- After Wave 3 (+ G18 html-validate ~5s, G5/G6/G16 specs ~30s): ~10-11 min.
- Wave 4 link-check is cron, off PR path.

Confirm at end of each wave; adjust budgets if drift.

---

## Tooling Summary (canonical)

| Need                | Pick                                           | Reason                                                                   |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| A11y unit (shipped) | `jest-axe` + `@/lib/tokens` registry           | Structural a11y on primitives; layout/contrast deferred to E2E.          |
| A11y E2E sweep      | `@axe-core/playwright` (>=4.10)                | WCAG 2.1 mapping; React 19 hydration timing fixed in 4.10+.              |
| Perf budgets        | `@lhci/cli`                                    | `staticDistDir` support; numeric metric assertions only.                 |
| Bundle budgets      | `size-limit`                                   | gzip-aware; framework-agnostic; budgets after baseline.                  |
| Contrast (shipped)  | `wcag-contrast` + `postcss` + `@/lib/tokens`   | CSS source-of-truth, parser-driven. Belt: ESLint `no-restricted-syntax`. |
| Link audit          | `lycheeverse/lychee-action`                    | Concurrent; retry-with-backoff; weekly cron.                             |
| Secret detection    | `gitleaks-action`                              | Modern token formats + git-history scan.                                 |
| HTML validation     | `html-validate`                                | Catches malformed markup invisible to axe/LH.                            |
| JSON-LD validity    | `schema-dts` types + assertions                | Catches required-prop regressions for SEO/Person schema.                 |
| Reduced motion      | `postcss` (Vitest) + Playwright `emulateMedia` | Reuse design-system PostCSS pipeline.                                    |
| CSP snapshot        | Vitest `toMatchInlineSnapshot`                 | Sorted directive map; whitespace-insensitive.                            |
| Dep review          | `actions/dependency-review-action`             | Free for public repos; PR-time blocking.                                 |

All tools support pinned-SHA actions and reproducible CI.

---

## Footguns (record once, prevent later)

- **`@axe-core/playwright` >=4.10** required for React 19 hydration timing.
- **LHCI `staticDistDir` + `trailingSlash: true`**: verify `/` resolves to `out/index.html` (not `out/index.html/index.html`) before merging budget gates.
- **`size-limit` budgets**: set after baseline measurement, never guess.
- **Sitemap `lastmod` from `git log`**: requires `fetch-depth: 0` in `actions/checkout`. Add to `deploy.yml`.
- **`page.on("console")`** must capture **both** `error` AND `warning` levels for React hydration regressions (G16).
- **CSP snapshot** must serialise directives as **sorted parsed map**, not raw string, to avoid whitespace flake (G14).
- **No-JS test (G19)** depends on CSS `prefers-color-scheme` working without `next-themes` JS hydration. If next-themes is later configured to require JS for any theme decision, the test breaks.
- **External font CDN** would require SRI + CSP `font-src` update — currently N/A because Inter is self-hosted via `next/font`.
- **Don't add hex/rgb/hsl literals** to `src/components` or `src/app` — ESLint `no-restricted-syntax` + `no-hardcoded-color.test.ts` will fail. Use tokens. `layout.tsx` allowlisted only because `<meta name="theme-color">` requires literal hex.

---

## Revision Log

- **v3.2** (current): Doc-validator drift fix. G2 (Lighthouse CI) recognised as shipped — actual `.github/lighthouse/lighthouserc.json` enforces composite category gates (accessibility >=0.95 error, best-practices >=0.9 error, seo >=0.95 error, performance >=0.9 warn) + LCP/CLS/TBT numeric assertions + a11y audits, run via `lighthouse: true` input on `_lint-test-build.yml` from `deploy.yml`. Doc previously claimed "no composite category gates" and `numberOfRuns: 5` — both contradicted reality. Wave plan moved G2 from Wave 2 to done. Coverage Snapshot rows for Performance, CSP regression, and Hash anchors flipped to `covered` to reflect shipped G2/G14/G9.
- **v3.1**: Wave 1 shipped. G9 (SECTION_IDS + NavLinkSchema href refinement + tests), G11 (npm audit critical -> high; GHAS dependency-review-action pinned to v4.9.0 SHA), G14 (tc-19-csp.spec.ts: parseCSP with sorted directive map, toMatchInlineSnapshot, NODE_ENV guard, duplicate-directive throw, unsafe-eval + wildcard guards), G21 (tc-00-smoke 00.4 SW absence with networkidle wait), G25 (gitleaks-action pinned to v2.3.9 SHA + fetch-depth: 0 on checkout), G27 (already enforced by existing socialUrl + .startsWith schemas — no code change needed). Two reviewer rounds (code-reviewer REQUEST_CHANGES, security-reviewer APPROVE_WITH_CHANGES); both must-fix items addressed: pinned action SHAs, fetch-depth, pull-requests: write permission, parseCSP duplicate detection, NODE_ENV guard. CI runtime delta: +<1 min.
- **v3**: flattened layered v1+v2 into canonical sections. Re-grounded against shipped design-system test layer (`src/__tests__/design/`, commits `b01634c`, `565554d`, `e2619dd`). Verifier corrected two false v2 premises: tokens are hex/rgba (not `oklch()`); `globals.css:118` already has the reduced-motion block. G4 marked DONE — actual implementation uses PostCSS + `@/lib/tokens` registry, cleaner than v2's proposed `contrast-tokens.ts` generator. G1 split into "unit-level shipped" + "E2E full-page sweep remaining". Coverage Snapshot rebuilt. Tooling Summary unified. Added G25-G29 from security review.
- **v2**: 3-architect review (critic + architect + test-engineer). Demoted G7 to P2; dropped G12; trimmed G11 to audit-bump only; LHCI category gates dropped in favour of numeric metric assertions; added G14-G24 (CSP regression, JSON-LD validity, hydration, manifest, html-validate, no-JS, 404, SW, details overflow, LCP element, OG dim).
- **v1**: initial 13-gap analysis from baseline review.
