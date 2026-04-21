<!--
  SYNC IMPACT REPORT
  Version change: (none) → 1.0.0 (initial ratification)
  Added sections: Core Principles (I–VI), Quality Gates, Content Standards, Governance
  Removed sections: N/A (first version)
  Templates requiring updates:
    ✅ specs/constitution.md — this file
    ⚠  .planning/specs/*/spec.md — should reference constitution version in header
  Follow-up TODOs: None. All placeholders resolved.
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

### III. Type Safety — Strict, No Escape Hatches

TypeScript strict mode is always on. `any` is prohibited. Every public API surface MUST be fully typed.

**Rationale**: This is a solo portfolio with infrequent edits. Strong types catch regressions at compile time
rather than at runtime in a live site. The JSON ↔ TypeScript interface mirror is the contract between content
and UI.

**Non-negotiable rules**:

- No `any`. Use generics, discriminated unions, or `unknown` with type guards instead.
- All component props interfaces MUST be exported (enables external test imports).
- Discriminated unions for conditional props — boolean props that drive rendering forks are disallowed.
- TypeScript must compile with zero errors (`tsc --noEmit`) as part of `npm run build`.

### IV. Server Components by Default — Client Islands for Interactivity Only

React Server Components are the default. `"use client"` is added only when a component requires browser APIs
or React hooks (`useState`, `useEffect`, `useRef`, etc.).

**Rationale**: Server components reduce JavaScript bundle size and improve Lighthouse performance scores.
Converting sections to client components purely for convenience undermines the static-export performance goal.

**Non-negotiable rules**:

- No `"use client"` without a comment naming the specific hook or browser API that requires it.
- Animation wrappers MUST be thin client shells (`<AnimateOnScroll>`) with server-rendered children —
  sections MUST NOT be converted wholesale to client components to add animation.
- Context providers are acceptable client components at the layout level (e.g. `ThemeProvider`).

### V. Test Coverage — Utilities at 100%, Components at Main Paths

Tests are part of the deliverable, not an afterthought. New utilities require 100% coverage. New components
require coverage of primary user paths.

**Rationale**: The Vitest suite is the primary regression net between infrequent edits. Without it, a
CSS-in-JS refactor or data loader change can silently break a section.

**Non-negotiable rules**:

- Minimum overall coverage: 60% (lines, branches, functions).
- New utility files (e.g. `src/lib/search.ts`): 100% coverage required before merge.
- Test names describe **what** not **how** (semantic assertions, not implementation detail checks).
- `npm run test` MUST pass before any commit. CI blocks merge on test failure.
- `IntersectionObserver`, `sessionStorage`, `matchMedia` MUST be stubbed via `vi.stubGlobal` in tests —
  not left untested because they are browser APIs.

### VI. Styling — Tokens, Not Magic Numbers

All colours MUST use CSS custom properties (`var(--accent)`, `var(--bg-primary)`). No hardcoded hex, rgb,
or hsl values in component files or Tailwind arbitrary values.

**Rationale**: Dark/light mode is implemented via token swap (`:root` vs `[data-theme="light"]` in
`globals.css`). Hardcoded colours silently break theme switching.

**Non-negotiable rules**:

- Define all colour tokens in `src/app/globals.css` with both dark and light mode values.
- Icons MUST use `react-icons` (FA6 brands or Feather UI). No inline SVGs, no icon fonts.
- Tailwind for layout and spacing. CSS custom properties for theme-sensitive values.
- `clamp()` for fluid typography — font sizes MUST NOT be fixed px values for heading elements.

## Quality Gates

Every commit to `main` MUST pass all of the following before merge:

| Gate                          | Command                       | Failure Action                |
| ----------------------------- | ----------------------------- | ----------------------------- |
| Data schema validation        | `npm run lint:data`           | Fix JSON before commit        |
| ESLint + Prettier             | `npm run lint`                | Auto-fix or fix manually      |
| TypeScript compile            | `tsc --noEmit` (within build) | Fix type errors               |
| Unit tests                    | `npm run test`                | Fix failing tests             |
| Production build              | `npm run build`               | Fix build errors              |
| Lighthouse mobile performance | ≥ 90 score                    | Investigate regression        |
| Lighthouse mobile SEO         | ≥ 95 score                    | Fix missing meta or structure |
| CLS                           | < 0.1                         | Fix layout shift source       |

Lighthouse gates apply to production builds only. They are verification criteria, not CI-enforced
(manual audit before merge), unless a Lighthouse CI workflow is added.

## Content Writing Standards

All content in `data/*.json` and any text in component files MUST conform to:

- **ASCII punctuation only**: `-` not `–/—`, `"` not `"/"\`, `...` not `…`
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
