# Code Review — feat/001-mobile-search-ui-polish

**Branch:** `feat/001-mobile-search-ui-polish` vs `main`
**Reviewed:** 2026-04-22
**Depth:** standard
**Files Reviewed:** 24 source files

---

## Summary

This branch delivers mobile UI polish, scroll-based animation, nav data-driven refactor, JSON-LD security hardening, accessibility improvements, and a skip-nav link. The changes are largely high quality — good use of `IntersectionObserver`, correct `prefers-reduced-motion` handling, well-structured Zod schemas, and solid test coverage for `AnimateOnScroll`. A small number of bugs, one semantic HTML error, one accessibility label issue, and some coverage gaps remain.

---

## CRITICAL

### CR-01: `<dl>` / `<dd>` / `<dt>` order is semantically invalid

**File:** `src/components/hero/Hero.tsx:83–92`

The metrics grid was changed from `<div>` to `<dl>`, but the element order is wrong. A `<dd>` (value) appears **before** its `<dt>` (label), which is invalid HTML and will confuse screen readers. The spec requires each `<dd>` to follow its associated `<dt>`.

```tsx
// Current (invalid): dd before dt
<dl key={m.label} className="card p-4 space-y-1">
  <dd className="...">15+</dd>       {/* value first */}
  <dt className="...">Years</dt>     {/* term second — wrong */}
  {m.detail && <dd className="...">...</dd>}
</dl>

// Fix: dt must precede its dd
<dl key={m.label} className="card p-4 space-y-1">
  <dt className="text-xs text-[var(--muted)] leading-tight">{m.label}</dt>
  <dd className={`font-bold gradient-text ...`}>{m.value}</dd>
  {m.detail && <dd className="text-xs text-[var(--muted-2)]">{m.detail}</dd>}
</dl>
```

---

## HIGH

### HR-01: `AnimateOnScroll` wraps sections that own their `id` — IntersectionObserver-based active-section tracking breaks

**File:** `src/app/page.tsx:30–62`, `src/components/shared/Nav.tsx:21`

`Nav` observes elements by `document.getElementById(id)` using `navLinks` hrefs (e.g. `#about`). Those `id` attributes belong to the `<section>` elements inside `About`, `ExperienceTimeline`, etc. The new `AnimateOnScroll` wrapper (`<div>`) sits **between** `<main>` and those sections and does not carry the section `id`. This is unchanged layout-wise, so the observer still finds sections correctly — but `AnimateOnScroll` also wraps those sections with `opacity-0 translate-y-4`, meaning the section content is invisible until triggered. If a user navigates directly via URL fragment (`#experience`), the section is hidden until the IO fires. On low-end devices or when IO is slow this creates a blank-then-appears flash.

**Fix:** Ensure each section owns its `id` attribute at the top level of its component (they do), and that `AnimateOnScroll` does not set `display:none` or prevent the IO from observing them. Current implementation with `opacity-0` is acceptable but confirm `scroll-margin-top` on `section[id]` is not defeated by the wrapper `<div>`. The existing CSS rule `section[id] { scroll-margin-top: 72px }` applies to `section` elements, not `AnimateOnScroll`'s wrapping `<div>`. Sections still scroll to the right position, so this is LOW severity in practice — but worth a manual test.

_Downgrade to LOW if manual fragment-nav works correctly._

---

### HR-02: `ThemeToggle` placeholder loses `aria-hidden` on unmounted state

**File:** `src/components/shared/ThemeToggle.tsx:12`

The SSR/pre-hydration placeholder was changed from:

```tsx
<div className="w-9 h-9" aria-hidden="true" />
```

to:

```tsx
<div className="min-h-[48px] min-w-[48px]" />
```

`aria-hidden="true"` was dropped. Screen readers will now announce an empty, unlabelled `<div>` during the SSR render (and during hydration before `mounted` is true). This is a regression from the pre-existing implementation.

**Fix:**

```tsx
if (!mounted) return <div className="min-h-[48px] min-w-[48px]" aria-hidden="true" />;
```

---

### HR-03: Email social link aria-label is misleading

**File:** `src/components/shared/SocialLinks.tsx:29`

The aria-label is now `"Visit my Email profile"`. An email link does not point to a profile — it opens a mail client. The label is confusing for screen reader users.

**Fix:**

```tsx
aria-label={s.platform === "email" ? "Send me an email" : `Visit my ${label} profile`}
```

Or make `aria-label` a field in `socials.json` so CMS controls it.

The test in `SocialLinks.test.tsx:22` asserts `"Visit my Email profile"` — update both.

---

## MEDIUM

### MD-01: `AnimateOnScroll` `storageKey` not in `useEffect` deps array — stale closure risk

**File:** `src/components/shared/AnimateOnScroll.tsx:18,22`

`storageKey` is derived from `sectionId` with `const storageKey = \`anim:${sectionId}\``. It is declared outside `useEffect`and used inside it, but since it derives from`sectionId`(a prop) it will be stale if`sectionId`changes.`storageKey` is already included in the deps array (`[storageKey]`) which is correct. However, the lint rule `exhaustive-deps`may not catch this because`storageKey`is a const computed at component scope — if`sectionId`ever changes (e.g. via HMR or conditional rendering), the effect re-runs correctly. **No bug in the current static usage**, but the pattern is fragile. Non-actionable unless`sectionId` is dynamic.

---

### MD-02: `cta_primary` defaults silently — schema validation does not reject empty string

**File:** `src/lib/schemas.ts:32`, `data/profile.json:14`

`cta_primary` schema is `z.string().optional()`. An empty string `""` would pass validation and render as a blank button label. The Hero uses `profile.cta_primary ?? "View Experience"` — `??` only guards `null`/`undefined`, not `""`.

**Fix:**

```ts
cta_primary: z.string().min(1).optional(),
```

---

### MD-03: `escapeJsonLd` does not escape single quotes or forward slashes — incomplete XSS coverage

**File:** `src/app/layout.tsx:22–29`

The `escapeJsonLd` helper escapes `&`, `<`, `>`, U+2028, U+2029, which is the correct minimum set for JSON-LD in `<script>` tags per the OWASP JSON-LD recommendation. However, `dangerouslySetInnerHTML` with `type="application/ld+json"` is parsed as JSON, not HTML, so forward-slash escaping (`/` → `\/`) is a belt-and-suspenders practice to avoid `</script>` injection if a string value contains `</script>`. Since `JSON.stringify` does NOT escape `/`, a crafted value (e.g. a social URL containing `</script>`) could theoretically break out of the script block before your escaping runs.

**Fix:** Also replace `</` with `<\/`:

```ts
.replace(/<\//g, "<\\/")
```

---

### MD-04: `AnimateOnScroll` IO mock in tests uses wrong entry shape — `boundingClientRect` missing

**File:** `src/__tests__/components/AnimateOnScroll.test.tsx:59`

The IO callback in the test passes `{ isIntersecting: boolean }[]` typed as `IOCallback`. The production code accesses `entry.isIntersecting` only, so this is fine for coverage. But the Nav test (line 107) passes `{ isIntersecting: true, boundingClientRect: { top: 100 } }` as an entry and casts with `as unknown`. The production Nav IO handler uses `entry.boundingClientRect.top` — the mock only provides `{ top: 100 }` not a full `DOMRectReadOnly`. In jsdom this will work because only `.top` is accessed. Low risk but should be a typed helper.

---

### MD-05: `globals.css` fluid headings override all `h1`/`h2` — affects components using size utilities

**File:** `src/app/globals.css:102–107`

```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
h2 {
  font-size: clamp(1.5rem, 3.5vw, 2.5rem);
}
```

These are bare element selectors with no specificity scope. They override all Tailwind `text-*` utilities on `h1`/`h2` throughout the app because the Tailwind utility (`text-4xl`) has the same specificity but the cascade order means whichever comes last in the stylesheet wins. If globals.css is included after Tailwind's generated utilities (which it typically is), the `clamp` wins and `text-4xl` etc. on headings are silently ignored. This could break heading sizing in `SectionHeader`, `ExperienceCard`, and other components that rely on Tailwind utilities.

**Fix:** Scope to a wrapper class or use Tailwind's `@layer base` to set these with lower specificity:

```css
@layer base {
  h1 {
    font-size: clamp(2rem, 5vw, 4rem);
  }
  h2 {
    font-size: clamp(1.5rem, 3.5vw, 2.5rem);
  }
}
```

---

### MD-06: `Nav` mobile drawer lacks `role` — not a `<nav>` trap pattern, but Escape focus return is fragile

**File:** `src/components/shared/Nav.tsx:64–73`

Escape key correctly returns focus to `toggleRef`. However, the keydown handler is attached to `document`. If another component also listens on `document` for Escape (e.g. a future modal), both will fire. Prefer `useRef` on the nav drawer and `addEventListener` scoped to the drawer or use a `<dialog>` element for proper focus-trap semantics.

**Fix (low effort):** Stop propagation in the handler:

```ts
const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    e.stopPropagation();
    setMobileOpen(false);
    toggleRef.current?.focus();
  }
};
```

---

## LOW

### LW-01: `sameAs` in JSON-LD now includes `email:` mailto URI

**File:** `src/app/layout.tsx:128`

`sameAs: socials.map((s) => s.url)` — if `socials.json` contains an email entry with `url: "mailto:rohit@..."`, Schema.org's `sameAs` property expects HTTP/HTTPS URLs (URLs that identify the person on the web). A `mailto:` URI is not a valid `sameAs` value.

**Fix:** Filter to http/https only:

```ts
sameAs: socials.filter((s) => s.url.startsWith("http")).map((s) => s.url),
```

---

### LW-02: `profile.name.charAt(0) || "?"` fallback is dead code

**File:** `src/app/page.tsx:28`

`ProfileSchema` enforces `name: z.string().min(1)`, so `profile.name.charAt(0)` is always truthy at runtime. The `|| "?"` branch is unreachable. Not harmful, but inconsistent with the strict-by-default philosophy.

---

### LW-03: `card-hover` applied to non-interactive `<div>` elements without keyboard affordance

**File:** `src/components/awards/AwardsSection.tsx:16`, `src/components/experience/ExperienceCard.tsx:18`, `src/components/projects/ProjectCard.tsx:19`, `src/components/skills/SkillCategoryCard.tsx:19`

`card-hover` adds `:hover` and `:focus-within` lift effects. These are applied to plain `<div>` cards. The `:focus-within` fires when a child receives focus, which is correct. But visually suggesting interactivity with a lift transform on a non-interactive container may confuse pointer users who expect a click to do something. Low concern for a portfolio, but be intentional.

---

### LW-04: Test coverage gap — `Nav` active section test does not verify `aria-current` is removed when section leaves viewport

**File:** `src/__tests__/components/Nav.test.tsx`

The new test fires an IO entry with `isIntersecting: true` and checks `aria-current="page"`. There is no test that fires `isIntersecting: false` (which the Nav ignores — it only sets on `visible.length > 0`) or that verifies the active state resets when navigating away. This is consistent with the implementation (no reset on leave, only update on enter) — but the behaviour should be documented or tested.

---

### LW-05: British English violation in `data/profile.json`

**File:** `data/profile.json:14`

`"cta_primary": "View Experience"` — content string in the JSON CMS. Per CLAUDE.md, British English is required. "Experience" is fine, but verify all other new profile fields follow the same standards. No violation found beyond needing a content audit pass.

---

### LW-06: `.specify/` directory committed — workflow tooling leaking into product repo

**File:** `.specify/` (multiple files)

These are speckit planning scaffolding files. They're not harmful but add noise to the repo and may confuse contributors. Check whether `.gitignore` should exclude `.specify/` similar to `.claude/settings.local.json`.

---

## Summary Table

| ID    | Severity | Area              | File(s)                                             |
| ----- | -------- | ----------------- | --------------------------------------------------- |
| CR-01 | CRITICAL | Semantic HTML     | `src/components/hero/Hero.tsx`                      |
| HR-01 | HIGH     | Animation / Nav   | `src/app/page.tsx`, `src/components/shared/Nav.tsx` |
| HR-02 | HIGH     | Accessibility     | `src/components/shared/ThemeToggle.tsx`             |
| HR-03 | HIGH     | Accessibility     | `src/components/shared/SocialLinks.tsx`             |
| MD-01 | MEDIUM   | React / Hooks     | `src/components/shared/AnimateOnScroll.tsx`         |
| MD-02 | MEDIUM   | Validation        | `src/lib/schemas.ts`, `data/profile.json`           |
| MD-03 | MEDIUM   | Security / XSS    | `src/app/layout.tsx`                                |
| MD-04 | MEDIUM   | Test quality      | `src/__tests__/components/AnimateOnScroll.test.tsx` |
| MD-05 | MEDIUM   | CSS / Specificity | `src/app/globals.css`                               |
| MD-06 | MEDIUM   | Accessibility     | `src/components/shared/Nav.tsx`                     |
| LW-01 | LOW      | SEO / Schema.org  | `src/app/layout.tsx`                                |
| LW-02 | LOW      | Dead code         | `src/app/page.tsx`                                  |
| LW-03 | LOW      | UX                | Multiple card components                            |
| LW-04 | LOW      | Test coverage     | `src/__tests__/components/Nav.test.tsx`             |
| LW-05 | LOW      | Content standards | `data/profile.json`                                 |
| LW-06 | LOW      | Repo hygiene      | `.specify/`                                         |

---

_Reviewed: 2026-04-22_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
