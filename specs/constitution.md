<!--
  SYNC IMPACT REPORT
  Version change: (none) → 1.0.0 (initial ratification, principles focused on code quality, testing, UX, performance)
  Modified principles:
    III. Type Safety → III. Code Quality — Type Safety and Clean Architecture
         (absorbed server-component architecture discipline from former IV)
    IV. Server Components by Default → VI. Performance Requirements — Bundle Discipline and Core Web Vitals
         (elevated to first-class principle with explicit metric targets)
    V. Test Coverage → IV. Testing Standards — Utilities at 100%, Components at Main Paths
         (renamed for clarity; rules tightened with tooling specifics)
    VI. Styling — Tokens → V. User Experience Consistency — Visual Tokens, Accessibility, and Interaction
         (expanded beyond colour tokens to cover accessibility and interaction coherence)
  Added sections: none
  Removed sections: none (all prior rules preserved; reorganised into 4 thematic principles)
  Templates requiring updates:
    ✅ specs/constitution.md — this file
    ⚠  specs/*/plan.md — Constitution Check gates should reference principle names III–VI (updated titles)
  Follow-up TODOs: none. All placeholders resolved.
-->

# Rohit Vipin Mathews Portfolio — Constitution

## Core Principles

### I. Headless CMS — Data Is the Source of Truth

All user-visible content MUST live in `data/*.json` files. Components MUST NOT contain hardcoded strings, labels,
or copy. UI is a pure rendering layer over typed JSON loaders in `src/lib/data.ts`.

**Rationale**: Content updates (new job, new project, rewording bio) MUST be possible by editing a single JSON
file with no component changes. Violating this creates a split source of truth that breaks the JSON linting
pipeline and makes content audits unreliable.

**Non-negotiable rules**:

- Every new data field MUST have a corresponding TypeScript interface update in the same commit.
- `npm run lint:data` MUST pass before any commit touching `data/`.
- No `Record<string, unknown>` without explicit justification; all shapes MUST be typed interfaces.

### II. Static Export First — No Runtime Server

This site MUST build to a fully static artifact deployable to GitHub Pages with zero server-side execution.

**Rationale**: GitHub Pages hosting is the deployment target. Runtime Node.js APIs (`fs`, `path`, server actions,
`fetch()` in components) are incompatible with this constraint and produce broken builds.

**Non-negotiable rules**:

- No `fetch()` calls in client or server components. All data MUST be imported at build time.
- No Node.js built-in imports in `src/`. Scripts in `utils/` are build-time only (run via `tsx`, not bundled).
- `npm run build` MUST succeed and produce a complete `out/` directory with zero errors.
- `NEXT_PUBLIC_BASE_PATH` controls the URL prefix; all absolute URLs MUST derive from this variable.

### III. Code Quality — Type Safety and Clean Architecture

TypeScript strict mode is always on. `any` is prohibited. Every public API surface MUST be fully typed.
Server components are the default architectural unit; client components are narrowly scoped islands.

**Rationale**: Strong types catch regressions at compile time. The JSON ↔ TypeScript interface mirror is the
contract between content and UI — any gap there silently allows malformed data into the render tree.
Server components reduce bundle size and enforce the principle that most UI in a portfolio site is static
read-only output, not interactive state.

**Non-negotiable rules**:

- No `any`. Use generics, discriminated unions, or `unknown` with type guards instead.
- All component props interfaces MUST be exported (enables external test imports).
- Discriminated unions for conditional props — boolean props that drive rendering forks are disallowed.
- TypeScript MUST compile with zero errors (`tsc --noEmit`) as part of `npm run build`.
- No `"use client"` without a comment naming the specific hook or browser API that requires it.
- Animation wrappers MUST be thin client shells with server-rendered children — sections MUST NOT be
  converted wholesale to client components to add animation.
- Context providers are acceptable client components at the layout level (e.g. `ThemeProvider`).
- No prop drilling beyond one level; use context for deeper nesting.

### IV. Testing Standards — Utilities at 100%, Components at Main Paths

Tests are part of the deliverable, not an afterthought. New utilities require 100% coverage. New components
require coverage of primary user paths. Browser globals MUST be stubbed, not silently skipped.

**Rationale**: The Vitest suite is the primary regression net between infrequent edits. Without it, a
data loader change or CSS-in-JS refactor can silently break a section. Coverage targets are chosen to
ensure the riskiest logic (pure utilities) has zero untested branches, while component tests cover what
a user would actually observe.

**Non-negotiable rules**:

- Minimum overall coverage: 60% (lines, branches, functions).
- New utility files (e.g. `src/lib/search.ts`): 100% branch and function coverage required before merge.
- New components: tests MUST cover primary render paths and any conditional branches driven by props.
- Test names describe **what** not **how** — semantic assertions, not implementation detail checks.
- `npm run test` MUST pass before any commit. CI blocks merge on test failure.
- `IntersectionObserver`, `sessionStorage`, `matchMedia`, and `ResizeObserver` MUST be stubbed via
  `vi.stubGlobal` in tests — not left untested because they are browser APIs.
- No mocking of internal data loaders; import actual typed fixtures from `data/*.json` in tests.
- Each test file MUST correspond to a single source file (e.g. `colors.test.ts` for `colors.ts`).

### V. User Experience Consistency — Visual Tokens, Accessibility, and Interaction

All colours MUST use CSS custom properties. Interactive elements MUST meet WCAG 2.1 AA contrast and
keyboard-navigability requirements. Animations MUST respect `prefers-reduced-motion`. Component behaviour
MUST be consistent across light and dark themes without per-theme overrides in component files.

**Rationale**: Dark/light mode is implemented via a single token swap in `globals.css`. Hardcoded colours
or per-component theme logic silently breaks either mode. Accessibility and reduced-motion support are
not polish — they are part of the definition of a working feature.

**Non-negotiable rules**:

- All colour tokens defined in `src/app/globals.css` with both dark and light mode values under
  `[data-theme="light"]`. No hex, rgb, or hsl values in component files or Tailwind arbitrary values.
- Icons MUST use `react-icons` (FA6 brands or Feather UI). No inline SVGs, no icon fonts.
- Tailwind for layout and spacing; CSS custom properties for all theme-sensitive values.
- `clamp()` for fluid typography — heading font sizes MUST NOT be fixed `px` values.
- All interactive elements (buttons, links, toggles) MUST be keyboard-focusable with a visible focus ring.
- All `<img>` and icon elements MUST have descriptive `alt` text or `aria-label`; decorative images use
  `alt=""`.
- Any CSS animation or transition MUST be wrapped in `@media (prefers-reduced-motion: no-preference)` or
  conditionally suppressed via the `useReducedMotion` hook in client components.
- No component-level `data-theme` overrides; theming is exclusively global via the root token swap.

### VI. Performance Requirements — Bundle Discipline and Core Web Vitals

The site MUST achieve Lighthouse mobile scores ≥ 90 (Performance), ≥ 95 (SEO), and ≥ 95 (Accessibility).
CLS MUST remain below 0.1. These are not aspirational targets — they are merge gates.

**Rationale**: A personal portfolio competes on first impression. Performance and SEO scores are directly
observable by the person the site is meant to impress. Regressions are easy to introduce (a new font,
an unoptimised image, a client component wrapping a static section) and hard to notice without explicit
gates.

**Non-negotiable rules**:

- Images MUST use Next.js `<Image>` with explicit `width`, `height`, and `priority` on above-the-fold
  assets. Raw `<img>` tags are prohibited in `src/`.
- No third-party scripts loaded synchronously in `<head>`. External resources MUST use `async`/`defer`
  or be eliminated.
- Font loading MUST use `next/font` with `display: swap`; no raw `@font-face` declarations that block
  render.
- Lighthouse mobile Performance ≥ 90 — manual audit required before merge to `main`.
- Lighthouse mobile SEO ≥ 95 — fix missing meta, canonical, or structured-data issues before merge.
- Lighthouse mobile Accessibility ≥ 95 — fix violations before merge (also enforced by Principle V).
- CLS < 0.1 — identify and fix layout shift source (images without dimensions, late-loading fonts).
- LCP MUST come from a server-rendered element, not a client-component hydration boundary.

## Quality Gates

Every commit to `main` MUST pass all of the following before merge:

| Gate                            | Command                       | Failure Action                        |
| ------------------------------- | ----------------------------- | ------------------------------------- |
| Data schema validation          | `npm run lint:data`           | Fix JSON before commit                |
| ESLint + Prettier               | `npm run lint`                | Auto-fix or fix manually              |
| TypeScript compile              | `tsc --noEmit` (within build) | Fix type errors                       |
| Unit tests                      | `npm run test`                | Fix failing tests                     |
| Production build                | `npm run build`               | Fix build errors                      |
| Lighthouse mobile performance   | ≥ 90 score                    | Investigate regression                |
| Lighthouse mobile SEO           | ≥ 95 score                    | Fix missing meta or structure         |
| Lighthouse mobile accessibility | ≥ 95 score                    | Fix a11y violations (see Principle V) |
| CLS                             | < 0.1                         | Fix layout shift source               |

Lighthouse gates apply to production builds only. They are verification criteria, not CI-enforced
(manual audit before merge), unless a Lighthouse CI workflow is added.

## Content Writing Standards

All content in `data/*.json` and any text in component files MUST conform to:

- **ASCII punctuation only**: `-` not `–/—`, `"` not `"/"`, `...` not `…`
- **British English**: -ise not -ize, -our not -or, organised not organized. Exception: product names and proper nouns.
- **No corporate speak**: "world-class", "exceptional", "cutting-edge", "end-to-end", "seamlessly",
  "innovative", "robust", "proactive", "delivery velocity" are prohibited. Rewrite concretely.
- **No AI jargon tells**: same list as corporate speak. Descriptions MUST read as written by the person,
  not generated by a language model.
- **Proper noun casing**: AWS, Google Cloud, ASP.NET, C#, .NET, NuGet — case-sensitive and exact.

## Governance

This constitution supersedes all informal conventions. Where a convention in README.md, CLAUDE.md, or
any other doc conflicts with this constitution, the constitution takes precedence. Conflicts MUST be
resolved by amending the relevant doc, not by ignoring the conflict.

**Amendment procedure**:

1. Identify the principle or section to amend.
2. Draft the change and classify the version bump: MAJOR (principle removal/redefinition),
   MINOR (new principle or material expansion), PATCH (wording, clarification).
3. Update `specs/constitution.md` with the new version and `LAST_AMENDED_DATE`.
4. Update any dependent artifacts (spec templates, plan templates, task templates) in the same PR.
5. Commit with message: `docs: amend constitution to vX.Y.Z (<summary>)`

**Versioning policy**: Semantic versioning. MAJOR.MINOR.PATCH.

- Breaking governance changes (remove or redefine a principle): MAJOR bump.
- New principle or new mandatory section: MINOR bump.
- Clarification, wording, non-semantic refinement: PATCH bump.

**Compliance review**: Each feature spec MUST reference whether it complies with all six core principles.
Any spec that requires deviation from a principle MUST document the exception explicitly and have it
acknowledged before planning begins.

**Version**: 1.0.0 | **Ratified**: 2026-04-21 | **Last Amended**: 2026-04-21
