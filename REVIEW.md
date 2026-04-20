# Code Review — rohit-profile

**Reviewed:** 2026-04-21  
**Depth:** Standard (all source files)  
**Status:** Issues found

---

## Summary

Solid portfolio site with good architectural discipline: strict TypeScript, data-driven patterns, server components by default, and a working CI pipeline. No security vulnerabilities. The main issues cluster around: (1) CLAUDE.md conventions not consistently followed for prop interfaces, (2) significant component test coverage gaps, (3) a stale branch, (4) accessibility gaps on interactive controls, and (5) a dead field in the data schema.

---

## HIGH Severity

### H-01: Props interfaces not defined or exported — violates project convention across nearly all components

**Files:**

- `src/components/hero/Hero.tsx:6`
- `src/components/about/About.tsx:5`
- `src/components/experience/ExperienceCard.tsx:9`
- `src/components/experience/ExperienceTimeline.tsx:6`
- `src/components/projects/ProjectCard.tsx:9`
- `src/components/projects/ProjectsSection.tsx:9`
- `src/components/skills/SkillsSection.tsx:5`
- `src/components/skills/SkillCategoryCard.tsx:7`
- `src/components/awards/AwardsSection.tsx:5`
- `src/components/leadership/LeadershipSection.tsx:4`
- `src/components/community/CommunitySection.tsx:14`
- `src/components/shared/Nav.tsx:18`
- `src/components/shared/SocialLinks.tsx:14`

**Issue:** CLAUDE.md mandates "Props interfaces always defined and exported, even for internal components." All of the above use inline anonymous object types (`{ entry: ExperienceEntry }`) rather than a named, exported interface. `CommunityCard` has a named interface but it is not exported.

**Fix:** Extract and export the inline type for each component. Example:

```typescript
// Before
export default function ExperienceCard({ entry }: { entry: ExperienceEntry }) {

// After
export interface ExperienceCardProps {
  entry: ExperienceEntry;
}
export default function ExperienceCard({ entry }: ExperienceCardProps) {
```

---

### H-02: Eight components have zero test coverage

**Files (no tests exist):**

- `src/components/hero/Hero.tsx`
- `src/components/experience/ExperienceTimeline.tsx`
- `src/components/projects/ProjectsSection.tsx`
- `src/components/skills/SkillsSection.tsx`
- `src/components/skills/SkillCategoryCard.tsx`
- `src/components/community/CommunitySection.tsx`
- `src/components/education/EducationSection.tsx`
- `src/components/leadership/LeadershipSection.tsx`

**Issue:** CLAUDE.md requires "new components: test main paths." These are not new — they are live components on the deployed page. `SkillCategoryCard` has non-trivial expand/collapse logic (`INITIAL_VISIBLE = 10`, show/hide more button) with zero test coverage. `ProjectsSection` has tab-switch state. `ExperienceTimeline` composes the key timeline structure.

**Fix:** Add `*.test.tsx` for each, covering at minimum: renders with valid data, interactive states (expand/collapse, tab switch), and empty/edge-case inputs.

---

## MEDIUM Severity

### M-01: `profile_picture` field is dead — defined in type, empty in data, not used in any component

**Files:** `src/types/index.ts:19`, `data/profile.json` (`"profile_picture": ""`), `src/components/hero/Hero.tsx` (uses `github_avatar` only)

**Issue:** `Profile.profile_picture` is declared as a required `string` in the TypeScript interface, has an empty value in the JSON source, and is referenced in no component. The `About` test fixture provides `/photo.jpg` but the component never renders it. This is dead schema surface that misleads consumers about what the interface requires.

**Fix:** Either remove the field from `src/types/index.ts` and `data/profile.json` (and the test fixture), or wire it up in `Hero.tsx` as the primary avatar source with `github_avatar` as fallback. Either way, the type and data must stay in sync (same commit, per CLAUDE.md).

---

### M-02: `data/profile.json:93` — personal email hardcoded in `layout.tsx` JSON-LD

**File:** `src/app/layout.tsx:93`

**Issue:** `email: "rohitvipin@gmail.com"` is hardcoded directly in the JSON-LD structured data block. This violates the headless CMS principle: email lives in `data/profile.json` and should be read from there. If the email changes in the JSON, the structured data silently stays stale.

**Fix:**

```typescript
// Import the data loader
import { profile } from "@/lib/data";

// Use in jsonLd:
const jsonLd = {
  ...
  email: profile.email,
  ...
};
```

---

### M-03: `as unknown as Profile` double cast circumvents `satisfies` safety — inconsistent with other loaders

**File:** `src/lib/data.ts:24`

**Issue:** All other exports use `satisfies` (which preserves the JSON literal type while asserting shape compatibility). The `profile` export uses `as unknown as Profile` to bypass TypeScript's literal union inference for `availability_status`. The comment explains the intent, but this cast silently swallows any future type mismatch — e.g., a misspelled status value in JSON would not cause a build error.

**Fix:** Use a type-safe validator or a narrowing assertion instead:

```typescript
// Option 1: satisfies (same as others) — TS will error if availability_status literal doesn't match
export const profile = profileData satisfies Profile;

// Option 2: If the union literal inference is the real problem, keep satisfies and widen the JSON:
// Add "as const" to the JSON import path isn't possible, but satisfies correctly handles this.
```

Test: change `availability_status` to an invalid value in the JSON and verify the build fails. If it does, the cast is unnecessary.

---

### M-04: CommunityCard toggle button missing `aria-label`

**File:** `src/components/community/CommunityCard.tsx:29`

**Issue:** The expand/collapse button has `aria-expanded` but no `aria-label`. Screen readers announce this as a generic button. The button text changes between "Hide details" and "Show N highlights", which is sufficient for sighted users but the button lacks a programmatic label when collapsed text has no other context.

**Fix:**

```tsx
<button
  onClick={() => setOpen((v) => !v)}
  aria-expanded={open}
  aria-label={open ? "Hide highlights" : `Show ${entry.highlights.length} highlights`}
  className="..."
>
```

---

### M-05: SkillCategoryCard expand/collapse buttons missing `aria-label` and `aria-expanded`

**File:** `src/components/skills/SkillCategoryCard.tsx:25-38`

**Issue:** Both "+N more" and "show less" buttons have no `aria-label` or `aria-expanded`. Without context of which category is being expanded, a screen reader user navigating by button cannot tell what they're expanding.

**Fix:**

```tsx
<button
  onClick={() => setExpanded(true)}
  aria-expanded={false}
  aria-label={`Show ${hidden} more ${category} skills`}
  className="..."
>
  +{hidden} more
</button>
```

---

### M-06: `feat/seo-overhaul` branch is 34 commits ahead of `main` and unmerged

**Finding:** `git log feat/seo-overhaul ^main` shows 34 commits not in main. This branch has been open since before the initial portfolio launch based on the commit log ordering. If it is intended work, it needs a PR. If it is abandoned, it should be deleted to avoid confusion.

**Fix:** Either open a PR to merge/rebase against main, or run `git push origin --delete feat/seo-overhaul`.

---

### M-07: `lint-data` validates forbidden characters only — no schema field validation

**Files:** `utils/lint-data.ts`, `utils/lint-data-core.ts`

**Issue:** `npm run lint:data` (and the pre-commit hook for `data/*.json`) only checks for forbidden Unicode characters. It does not validate required fields, array shapes, or type correctness. A commit that removes `current: true` from all experience entries, or omits a required `role` field, passes lint silently. The `data.test.ts` contract tests partially compensate but they only run in CI, not in the pre-commit hook.

**Fix (two approaches):**

1. Minimal: extend `lint-data-core.ts` to validate required field presence per schema (no library needed).
2. Preferred: add `zod` schemas mirroring `src/types/index.ts` and validate on every `data/*.json` change. This gives a single source of truth and eliminates the current type/data drift risk that `as unknown as Profile` was introduced to work around.

---

## LOW Severity

### L-01: `agent.md` at repo root is stale planning artifact describing wrong stack

**File:** `agent.md`

**Issue:** Describes the project as "HTML/Vanilla CSS initially" and the author as "Software Developer specializing in C#, ASP.NET, and Xamarin." The current stack is Next.js 16 + React 19 + TypeScript. This file is not excluded from version control and will confuse future agents or contributors.

**Fix:** Delete or replace with up-to-date content. If it was used for AI agent context during initial build, it should be removed now that CLAUDE.md is the authoritative agent guidance.

---

### L-02: `vitest.config.ts` global environment is `node` but component tests use `// @vitest-environment jsdom`

**File:** `vitest.config.ts:6`

**Issue:** The global test environment is `node`. All 11 component test files override this with the `// @vitest-environment jsdom` pragma. This works, but it means any new component test file that omits the pragma will silently run in `node` environment, causing cryptic DOM API failures rather than a clear error. The `node` default creates a footgun for contributors.

**Fix:** Set global environment to `jsdom` since the majority of tests are component tests:

```typescript
test: {
  environment: "jsdom",
  ...
}
```

The utility tests (`colors.test.ts`, `projects.test.ts`, `data.test.ts`, `lint-data.test.ts`) do not use DOM APIs and run fine under `jsdom`.

---

### L-03: `ExperienceTimeline` React key uses template literal `${entry.company}-${entry.role}`

**File:** `src/components/experience/ExperienceTimeline.tsx:24`

**Issue:** Currently no data collision exists (verified against `data/experience.json`), but this key is fragile — a role change at the same company (e.g., promotion) would create identical keys. The `ExperienceEntry` type has no `id` field, so there is no stable key available.

**Fix (two options):**

1. Add an `id` field to `ExperienceEntry` in `src/types/index.ts` and `data/experience.json`, and use it as the key.
2. Fall back to index: `key={i}` is acceptable here since the list is static (build-time data, never reordered at runtime).

---

### L-04: `data/profile.json` — `profile_picture` field is an empty string

**File:** `data/profile.json`

**Issue:** `"profile_picture": ""` satisfies the required `string` type but is semantically invalid (an empty path renders a broken image if ever consumed). See H-02 / M-01 for the broader dead-field issue. This is the data-layer manifestation.

---

### L-05: README states `preview` command but `package.json` defines it as `build && serve`

**File:** `README.md` / `package.json:20`

**Issue:** Minor: README documents `npm run preview` as "Build + serve out/ locally" which matches. Flagging for completeness — the CLAUDE.md also correctly describes this. No action needed unless the README's "Quick Start" section has additional inaccuracies.

---

### L-06: `layout.tsx` — `jsonLd` object uses hardcoded GitHub avatar URL instead of data source

**File:** `src/app/layout.tsx:94`

**Issue:** `image: "https://avatars.githubusercontent.com/u/11459048?v=4"` is hardcoded despite the same URL living in `data/profile.json` as `github_avatar`. Minor duplication but violates the headless CMS principle.

**Fix:**

```typescript
image: profile.github_avatar,
```

---

## Out of Scope (Not Flagged)

- `console.error(error)` in `src/app/error.tsx:13` — intentional error boundary logging, correct pattern.
- `dangerouslySetInnerHTML` in `layout.tsx:153` — used exclusively for JSON-LD injection with `JSON.stringify`, which escapes all user-controlled content. Not a XSS risk in this context.
- `as unknown as` on `profileData` — flagged above as M-03 for consistency reasons, not as a security issue.

---

_Reviewed: 2026-04-21_  
_Reviewer: Claude (gsd-code-reviewer)_  
_Depth: Standard_
