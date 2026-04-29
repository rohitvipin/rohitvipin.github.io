# QA Test Plan — Portfolio Site

Covers `http://localhost:3000` (local) and `https://rohitvipin.github.io` (live).  
Run via `/portfolio-qa` skill. Artifacts saved to `.qa-reports/` (gitignored).

---

## Targets

| Target | URL                            | When                  |
| ------ | ------------------------------ | --------------------- |
| Local  | `http://localhost:3000`        | Before every PR merge |
| Live   | `https://rohitvipin.github.io` | After every deploy    |

---

## Viewports

| Name    | Width | Height | Represents                         |
| ------- | ----- | ------ | ---------------------------------- |
| Desktop | 1440  | 900    | Standard laptop/monitor            |
| Tablet  | 768   | 1024   | iPad portrait — hamburger boundary |
| Mobile  | 375   | 812    | iPhone SE / small Android          |

---

## Test Cases

### TC-00 · Smoke

Minimal liveness check — full page-load assertions live in TC-01.

| #    | Check                   | Expected                                                                     | Severity |
| ---- | ----------------------- | ---------------------------------------------------------------------------- | -------- |
| 00.1 | h1 renders with name    | `h1` contains "Rohit Vipin Mathews"                                          | CRITICAL |
| 00.4 | No service worker (G21) | `navigator.serviceWorker.getRegistrations()` returns empty after networkidle | HIGH     |

---

### TC-01 · Page Load

| #    | Check                   | Expected                        | Severity |
| ---- | ----------------------- | ------------------------------- | -------- |
| 01.1 | HTTP status             | 200                             | CRITICAL |
| 01.2 | Page title              | Matches `/Rohit Vipin Mathews/` | CRITICAL |
| 01.3 | Console errors          | Zero at `error` level           | HIGH     |
| 01.4 | Console warnings        | Zero at `warn` level            | MEDIUM   |
| 01.5 | `<html lang>` attribute | `lang="en"` present             | MEDIUM   |

---

### TC-02 · Assets

| #    | Check               | Expected                                      | Severity |
| ---- | ------------------- | --------------------------------------------- | -------- |
| 02.1 | Network 404s        | Zero failed requests across all assets        | CRITICAL |
| 02.2 | Avatar WebP served  | `/avatar.webp` returns 200/304                | HIGH     |
| 02.3 | `<picture>` element | `<source type="image/webp">` wraps avatar     | HIGH     |
| 02.4 | Avatar dimensions   | `naturalWidth > 0`, `complete === true`       | HIGH     |
| 02.5 | PDF resume link     | `/Rohit_Vipin_Mathews_Resume.pdf` returns 200 | MEDIUM   |
| 02.6 | OG image            | `/og-image.jpg` returns 200                   | MEDIUM   |
| 02.7 | Favicon             | `/favicon.ico` returns 200                    | LOW      |

---

### TC-03 · Navigation — Desktop (≥1024px)

| #    | Check                 | Expected                                                                                                   | Severity |
| ---- | --------------------- | ---------------------------------------------------------------------------------------------------------- | -------- |
| 03.1 | Desktop nav visible   | `nav[aria-label="Main navigation"]` rendered and visible                                                   | CRITICAL |
| 03.2 | Hamburger hidden      | Toggle button not visible at 1440px                                                                        | HIGH     |
| 03.3 | All nav links present | Count matches `data/nav.json` entries                                                                      | HIGH     |
| 03.4 | No link overflow      | All nav links within viewport width                                                                        | HIGH     |
| 03.5 | Active state updates  | `aria-current="location"` on correct link when section intersects (Nav.tsx uses `"location"` not `"page"`) | MEDIUM   |
| 03.6 | Home logo link        | Initials link has `aria-label="Home"` and visible initials text rendered                                   | MEDIUM   |
| 03.7 | Theme toggle present  | `button[aria-label*="theme"]` in header                                                                    | MEDIUM   |

---

### TC-04 · Navigation — Tablet (768px)

| #    | Check                | Expected                                        | Severity |
| ---- | -------------------- | ----------------------------------------------- | -------- |
| 04.1 | Desktop nav hidden   | `nav[aria-label="Main navigation"]` not visible | CRITICAL |
| 04.2 | Hamburger visible    | Toggle button visible and ≥44px                 | CRITICAL |
| 04.3 | No nav link overflow | No link extends past 768px viewport right edge  | HIGH     |

---

### TC-05 · Navigation — Mobile (375px)

| #    | Check                       | Expected                                                   | Severity |
| ---- | --------------------------- | ---------------------------------------------------------- | -------- |
| 05.1 | Hamburger visible           | `button[aria-label="Open menu"]` present                   | CRITICAL |
| 05.2 | Mobile drawer opens         | Click hamburger → `role="dialog"` appears                  | CRITICAL |
| 05.3 | All links in drawer         | All nav links rendered in mobile menu                      | HIGH     |
| 05.4 | Drawer closes on link click | Menu dismissed after link tap                              | HIGH     |
| 05.5 | Escape closes drawer        | `Escape` key dismisses mobile menu                         | HIGH     |
| 05.6 | Focus trap                  | Tab from last item wraps to first; Shift+Tab wraps to last | HIGH     |
| 05.7 | Body scroll locked          | `body.overflow === "hidden"` while drawer open             | MEDIUM   |

---

### TC-06 · Responsive Layout

| #    | Check                   | Expected                                        | Severity |
| ---- | ----------------------- | ----------------------------------------------- | -------- |
| 06.1 | Desktop — no h-scroll   | `scrollWidth === clientWidth` at 1440px         | HIGH     |
| 06.2 | Tablet — no h-scroll    | `scrollWidth === clientWidth` at 768px          | HIGH     |
| 06.3 | Mobile — no h-scroll    | `scrollWidth === clientWidth` at 375px          | HIGH     |
| 06.4 | Avatar hidden on mobile | Avatar image not rendered below `lg` breakpoint | MEDIUM   |
| 06.5 | Cards stack on mobile   | Single column card layout at 375px              | MEDIUM   |
| 06.6 | Text no overflow/clip   | No `overflow: hidden` cutting off visible text  | MEDIUM   |
| 06.7 | Metric grid adapts      | 4-col on desktop → 2-col on mobile              | LOW      |

---

### TC-07 · Touch Targets

Spec file: `e2e/all-viewports/tc-15-touch-targets.spec.ts` (numeric prefix `tc-15-` is the file identifier; the test plan slot is TC-07). Single unified Playwright check enforces a 48×48 CSS-px floor on every visible interactive element across desktop, tablet, and mobile projects — exceeds WCAG 2.5.5 AAA (24×24 / 44×44).

| #    | Check                                         | Expected                                                                                                                                                                                            | Severity |
| ---- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 07.1 | All visible interactives ≥ 48×48 CSS px       | Iterates `button:not([disabled])`, `a[href]:not([href=""])`, `input`, `select`, `textarea`, `[role="button"]`, `[role="tab"]`. Visually-hidden skip-links (`.sr-only`, unfocused) exempted by spec. | HIGH     |
| 07.2 | Diagnostic on failure lists offending element | `tagName` + id/class + width/height + first 60 chars of text content                                                                                                                                | LOW      |

---

### TC-08 · Section Presence & Data

Verify all 10 content sections render with non-empty content.

| #     | Section                | DOM ID        | Expected                     | Severity |
| ----- | ---------------------- | ------------- | ---------------------------- | -------- |
| 08.1  | Hero                   | —             | `h1` with name present       | CRITICAL |
| 08.2  | About                  | `#about`      | Heading + bio text present   | HIGH     |
| 08.3  | Impact                 | `#impact`     | At least 1 impact story card | HIGH     |
| 08.4  | Experience             | `#experience` | At least 1 experience entry  | HIGH     |
| 08.5  | Expertise / Leadership | `#expertise`  | Section heading present      | HIGH     |
| 08.6  | Projects               | `#projects`   | At least 1 project card      | HIGH     |
| 08.7  | Skills                 | `#skills`     | At least 1 skill category    | HIGH     |
| 08.8  | Community              | `#community`  | At least 1 community entry   | MEDIUM   |
| 08.9  | Awards                 | `#awards`     | At least 1 award entry       | MEDIUM   |
| 08.10 | Education              | `#education`  | At least 1 education entry   | MEDIUM   |

---

### TC-09 · Show / Hide Interactions

| #    | Check                       | Expected                                                               | Severity |
| ---- | --------------------------- | ---------------------------------------------------------------------- | -------- |
| 09.1 | Skill cards use `<details>` | Count of `details.card-details` > 0                                    | HIGH     |
| 09.2 | Skill card expands on click | `<details>` toggles `open` attribute on `<summary>` click              | HIGH     |
| 09.3 | Skill card collapses        | Second click on open `<details>` removes `open`                        | HIGH     |
| 09.4 | Experience card expands     | Click `<summary>` on closed `<details>` → `open` property becomes true | HIGH     |
| 09.5 | Experience card collapses   | Click `<summary>` on open `<details>` → `open` property becomes false  | HIGH     |
| 09.6 | Projects tab switch         | Click "Open Source" tab → `aria-selected="true"`, correct panel shown  | MEDIUM   |
| 09.7 | Impact story expand         | If collapsible — expand/collapse works                                 | MEDIUM   |

---

### TC-10 · Theme Toggle

| #    | Check                | Expected                                                                                  | Severity |
| ---- | -------------------- | ----------------------------------------------------------------------------------------- | -------- |
| 10.1 | Initial theme        | `data-theme` attribute present on `<html>`                                                | HIGH     |
| 10.2 | Toggle to dark       | Click toggle → `data-theme="dark"`                                                        | HIGH     |
| 10.3 | Toggle to light      | Click again → `data-theme="light"`                                                        | HIGH     |
| 10.4 | Button label updates | `aria-label` reflects current mode after toggle                                           | MEDIUM   |
| 10.5 | No flash on load     | ~~Not testable in Playwright headless~~ — covered by `suppressHydrationWarning` in layout | LOW      |

---

### TC-11 · Scroll-to-Top

| #    | Check                | Expected                                                                     | Severity |
| ---- | -------------------- | ---------------------------------------------------------------------------- | -------- |
| 11.1 | Hidden at top        | Button `visibility: hidden` or `opacity: 0` at `scrollY === 0`               | MEDIUM   |
| 11.2 | Appears after scroll | Button visible after scrolling to `y > 400` (threshold in `ScrollToTop.tsx`) | MEDIUM   |
| 11.3 | Touch target         | ≥ 48×48px (covered in TC-07)                                                 | MEDIUM   |
| 11.4 | Returns to top       | Click → `window.scrollY === 0` after animation                               | LOW      |

---

### TC-12 · Accessibility

| #     | Check                   | Expected                                                                   | Severity |
| ----- | ----------------------- | -------------------------------------------------------------------------- | -------- |
| 12.1  | Skip link               | `<a href="#main-content">Skip to main content</a>` in DOM                  | HIGH     |
| 12.2  | `main#main-content`     | `<main id="main-content">` present                                         | HIGH     |
| 12.3  | Section aria-labelledby | All `<section>` elements have `aria-labelledby` pointing to a heading      | HIGH     |
| 12.4  | JSON-LD structured data | `<script type="application/ld+json">` with `@type: "Person"`               | HIGH     |
| 12.5  | Meta description        | `<meta name="description">` ≥ 50 chars, ≤ 160 chars                        | MEDIUM   |
| 12.6  | OG tags complete        | `og:title`, `og:description`, `og:image` all present                       | MEDIUM   |
| 12.7  | Twitter card tags       | `twitter:card`, `twitter:title` present                                    | MEDIUM   |
| 12.8  | Images have alt text    | No `<img>` missing `alt` attribute                                         | HIGH     |
| 12.9  | Buttons have labels     | No `<button>` with empty accessible name                                   | HIGH     |
| 12.10 | Links have labels       | No `<a>` with empty accessible name                                        | HIGH     |
| 12.11 | Heading hierarchy       | No skipped heading levels (h1→h2→h3)                                       | MEDIUM   |
| 12.12 | `lang` on `<html>`      | `<html lang="en">`                                                         | MEDIUM   |
| 12.13 | JSON-LD `hasOccupation` | `Person.hasOccupation` defined; `@type === "Occupation"`; `name` is string | LOW      |

---

### TC-13 · Security & CSP

| #    | Check                             | Expected                                                                                       | Severity |
| ---- | --------------------------------- | ---------------------------------------------------------------------------------------------- | -------- |
| 13.1 | CSP meta present                  | `<meta http-equiv="Content-Security-Policy">` in `<head>`                                      | MEDIUM   |
| 13.2 | No `frame-ancestors` in meta CSP  | Directive absent (browsers ignore it in meta)                                                  | MEDIUM   |
| 13.3 | ~~`X-Content-Type-Options` meta~~ | Intentionally absent — browsers ignore meta version; GitHub Pages has no custom header support | N/A      |
| 13.4 | Referrer policy                   | `<meta name="referrer">` present                                                               | LOW      |
| 13.5 | No secrets in source              | Page HTML contains no tokens, keys, or passwords                                               | HIGH     |

---

### TC-14 · Performance

| #    | Check                            | Expected                                                                                                         | Severity |
| ---- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------- |
| 14.1 | No failed network requests       | Zero 4xx/5xx responses across all page assets                                                                    | HIGH     |
| 14.2 | Avatar preloaded (desktop)       | `<link rel="preload" href*="avatar">` in `<head>` — gated to `media="(min-width: 1024px)"`, desktop project only | MEDIUM   |
| 14.3 | `fetchPriority="high"` on avatar | LCP image prioritised — desktop only (avatar hidden on mobile/tablet)                                            | MEDIUM   |
| 14.4 | No blocking render requests      | No synchronous external scripts in `<head>` (excludes `_next/` runtime, inline bootstrap)                        | LOW      |

---

### TC-19 · CSP Directive Regression (G14)

Spec: `e2e/all-viewports/tc-19-csp.spec.ts`. Locks the production CSP via parsed sorted-directive map snapshot. Whitespace/order-insensitive; legitimate directive changes update the inline snapshot during PR review.

| #    | Check                                    | Expected                                                                  | Severity |
| ---- | ---------------------------------------- | ------------------------------------------------------------------------- | -------- |
| 19.1 | Production CSP directives match snapshot | `parseCSP(content)` returns the locked sorted-directive map               | HIGH     |
| 19.2 | `unsafe-eval` excluded in production     | `script-src` does not contain `'unsafe-eval'` (dev-only per `layout.tsx`) | HIGH     |
| 19.3 | No wildcard origins                      | No directive value list contains `*`                                      | HIGH     |

**Implementation notes.**

- `parseCSP` throws on duplicate directive names (real authoring bug, browsers handle inconsistently).
- `beforeAll` guards against `NODE_ENV === "development"` — dev-server CSP differs (`'unsafe-eval'` appended).
- Run on the `all-viewports` matrix; CSP is viewport-agnostic but the spec rides existing fixtures.

---

## Pass / Fail Criteria

| Severity | Threshold                                         |
| -------- | ------------------------------------------------- |
| CRITICAL | Any failure = **block merge/deploy**              |
| HIGH     | Any failure = **block merge/deploy**              |
| MEDIUM   | Tracked as issue; does not block unless count > 3 |
| LOW      | Tracked as tech debt                              |

---

## Reporting

- Screenshots saved to `.qa-reports/{YYYY-MM-DD-HH-MM}/{local|live}/{viewport}.png`
- Report written to `.qa-reports/{YYYY-MM-DD-HH-MM}/REPORT.md`
- Console errors quoted verbatim
- Each TC reported as `PASS` / `FAIL` / `WARN` / `SKIP`
- Final summary: counts by severity, blocking status, delta vs previous run if available

---

## Running

```bash
# Claude Code skill — both targets in parallel (default)
/portfolio-qa

# Local only
/portfolio-qa local

# Live only
/portfolio-qa live
```

See `.claude/skills/portfolio-qa/SKILL.md` for agent orchestration details.

### Automated Playwright E2E (CI)

All TCs except TC-10.5 have automated Playwright specs in `e2e/`. Triggered by GitHub Actions:

```bash
# Run locally (builds site via webServer config automatically)
npm run test:e2e

# View HTML report after run
npx playwright show-report
```

- `e2e/all-viewports/` — runs in desktop, tablet, mobile projects
- `e2e/desktop/` — desktop project only (TC-03, TC-14 — preload/performance)
- `e2e/tablet/` — tablet project only (TC-04)
- `e2e/mobile/` — mobile project only (TC-05)

**Implementation notes:**

- Nav uses `aria-current="location"` (not `"page"`)
- Experience and skill cards use native `<details>/<summary>` — toggle via `.open` JS property, not React state
- Theme tests use `localStorage.setItem("theme", ...)` via `addInitScript` — direct DOM attribute mutation is ignored by `next-themes`
- TC-13.3 (`X-Content-Type-Options`) intentionally absent — removed from automated suite
