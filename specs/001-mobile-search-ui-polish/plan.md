# Implementation Plan: Mobile UX, Native Search & UI Animation Polish

**Branch**: `feat/001-mobile-search-ui-polish` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)

---

## Summary

Seven delivery phases covering: About mobile layout alignment fix, client-side native search with dynamic import, fluid typography and 48px touch targets, glassmorphism sticky nav, scroll-triggered section animations, SEO structured data polish, and Core Web Vitals hardening. All work stays within the static export constraint. No new runtime dependencies. One new utility (`src/lib/search.ts`) requires 100% coverage before merge.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js 16 (App Router, static export)  
**Primary Dependencies**: React 19, Tailwind CSS v4, Vitest, next/font (Inter + JetBrains Mono), react-icons, next-themes  
**Storage**: N/A (static export; all data imported at build time from `data/*.json`)  
**Testing**: Vitest + React Testing Library; `vi.stubGlobal` for browser globals  
**Target Platform**: GitHub Pages (static, no Node.js runtime)  
**Project Type**: Static portfolio site (SSG → `out/`)  
**Performance Goals**: Lighthouse mobile Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95; CLS < 0.1  
**Constraints**: No `fetch()` in components; no Node.js imports in `src/`; single-page SPA-style scroll nav  
**Scale/Scope**: ~7 content sections, ~300 search index entries, 1 layout file

---

## Constitution Check

| Principle               | Status | Notes                                                                                                                                                                                                          |
| ----------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Headless CMS         | PASS   | No new JSON fields needed. JSON-LD in `layout.tsx` already reads from `data/profile.json` and `data/socials.json` at build time.                                                                               |
| II. Static Export First | PASS   | `search.ts` is a pure client-side module. Dynamic import fires in browser. No `fetch()` or Node.js APIs introduced.                                                                                            |
| III. Code Quality       | PASS   | `SearchIndex`, `SearchResult`, `AllContentData`, `AnimateOnScroll` props all require typed interfaces. No `any`. `AnimateOnScroll` is a thin `"use client"` wrapper — sections stay server components.         |
| IV. Testing Standards   | PASS   | `src/lib/search.ts` requires 100% branch/function coverage via per-file threshold in `vitest.config.ts`. Browser globals (`IntersectionObserver`, `sessionStorage`, `matchMedia`) stubbed via `vi.stubGlobal`. |
| V. UX Consistency       | PASS   | All colours via CSS custom properties. `prefers-reduced-motion` suppresses all animations and transitions. 48×48px touch targets enforced. ARIA APG listbox for search keyboard nav.                           |
| VI. Performance         | PASS   | Search module lazy-loaded via dynamic import. Fonts via `next/font` with `display: swap`. `scroll-margin-top` on all sections. Icons keep explicit dimensions.                                                 |

---

## Project Structure

### Documentation (this feature)

```text
.planning/specs/001-mobile-search-ui-polish/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
└── tasks.md             ← /speckit-tasks output (not created here)
```

### Source Code

```text
src/
├── app/
│   ├── layout.tsx           ← Phase 6: JSON-LD givenName/familyName, title ≤60 chars, FOUC script
│   └── globals.css          ← Phase 3: clamp() headings, scroll-margin-top, reduced-motion tokens
├── components/
│   ├── shared/
│   │   ├── Nav.tsx          ← Phase 2+4: search UI + glassmorphism scroll behaviour
│   │   └── AnimateOnScroll.tsx  ← Phase 5: NEW thin client animation wrapper
│   └── about/
│       └── About.tsx        ← Phase 1: remove ml-auto below lg
└── lib/
    └── search.ts            ← Phase 2: NEW pure search index builder + query matcher

src/__tests__/
├── search.test.ts           ← Phase 2: 100% coverage
└── AnimateOnScroll.test.tsx ← Phase 5: primary render paths
```

---

## Phase 1 — Mobile About Layout Fix

**FR-001** | Effort: XS | Risk: None

### What changes

`src/components/about/About.tsx`

- Sidebar div currently: `className="ml-auto w-fit space-y-4"`
- Fix: replace `ml-auto` with responsive class so it only applies at `lg+`:
  ```tsx
  className = "lg:ml-auto w-fit space-y-4";
  ```

**That is the entire change.** The `lg:grid-cols-[2fr_1fr]` grid already collapses to single-column below `lg`; removing `ml-auto` below `lg` makes the sidebar left-align naturally.

### Acceptance verification

- 375px viewport: sidebar items stack below bio, left-aligned, no overflow.
- 1024px+ viewport: two-column layout unchanged.
- All 4 items (location, years, timezone, email) visible at both widths.

---

## Phase 2 — Native Search

**FR-002 to FR-011a** | Effort: L | Risk: Medium (new client state, ARIA contract, dynamic import)

### Step 2a: `src/lib/search.ts` (pure utility, no side effects)

**Types to export:**

```ts
export interface AllContentData {
  experience: ExperienceEntry[];
  projects: Project[];
  skills: SkillCategory[];
  awards: Award[];
  community: CommunityEntry[];
  education: Education[];
  leadership: Leadership;
}

export interface SearchIndexEntry {
  sectionId: string;
  sectionLabel: string;
  title: string;
  snippet: string;
  scrollAnchor: string;
}

export interface SearchResult extends SearchIndexEntry {
  matchStart: number;
  matchEnd: number;
}

export type SearchIndex = SearchIndexEntry[];
```

**Functions to export:**

- `buildSearchIndex(data: AllContentData): SearchIndex` — builds flat array from all 7 content types per the field manifest in spec. Canonical order: experience → projects → leadership → skills → community → awards → education.
- `queryIndex(index: SearchIndex, query: string): SearchResult[]` — case-insensitive `includes()` match on `title` field, max 10 results, preserves canonical section order. Returns `matchStart`/`matchEnd` as indices within `title`.

**Snippet logic** (per spec field manifest):

- Experience: `${company} — ${role}` as title; first 120 chars of `description` as snippet.
- Projects: `name` as title; first 120 chars of `description`.
- Leadership: `title` as title; first 120 chars of first `sections[0].description`.
- Skills: category as title; skill names joined as snippet.
- Community: `title` as title; first 120 chars of `description`.
- Awards: `title` as title; first 120 chars of `description`.
- Education: `${degree} — ${institution}` as title; degree + institution as snippet.

Array fields (`highlights`, `techStack`, `tech`, skill names) joined with space before indexing.

**Index search fields** (spec table) — full-text search across joined string per entry:

- Experience: company + role + description + highlights.join(' ') + techStack.join(' ')
- Projects: name + client + description + highlights.join(' ') + tech.join(' ')
- Skills: category + skills.join(' ')
- Awards: title + organization + description
- Community: title + type + description + highlights.join(' ')
- Education: degree + institution
- Leadership: title + sections.map(s => s.title + ' ' + s.description).join(' ')

`queryIndex` matches against the full-text string for each entry but returns `matchStart`/`matchEnd` from the `title` field only.

**`vitest.config.ts` addition:**

```ts
coverage: {
  thresholds: {
    'src/lib/search.ts': { statements: 100, branches: 100, functions: 100, lines: 100 }
  }
}
```

### Step 2b: `src/components/shared/Nav.tsx` — search UI

**State additions:**

```ts
const [searchOpen, setSearchOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
const [searchLoading, setSearchLoading] = useState(false);
const [searchError, setSearchError] = useState(false);
const [activeResultIndex, setActiveResultIndex] = useState(-1); // -1 = no selection; drives aria-activedescendant
const searchIndexRef = useRef<SearchIndex | null>(null);
const searchModuleRef = useRef<typeof import("@/lib/search") | null>(null); // caches full module so queryIndex is accessible without re-import
const searchInputRef = useRef<HTMLInputElement>(null); // focus management: focus on open, return focus on close
const searchTriggerRef = useRef<HTMLButtonElement>(null); // focus return target after close/Escape
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

**Focus management contract** (FR-006, FR-007):

- On `activateSearch()`: call `searchInputRef.current?.focus()` after state update (use `useEffect` on `searchOpen` to handle async).
- On close (Escape, outside click, result select): call `searchTriggerRef.current?.focus()` to restore focus.
- `aria-activedescendant` on input = `search-result-${activeResultIndex}` when `activeResultIndex >= 0`, else `undefined`.
- Reset `activeResultIndex` to `-1` on each new query (`setActiveResultIndex(-1)` inside the debounce callback).

**Dynamic import flow** (on first activation):

```ts
async function activateSearch() {
  if (mobileOpen) setMobileOpen(false); // FR-011a: mutually exclusive
  setSearchOpen(true);
  // focus handled by useEffect watching searchOpen
  if (searchIndexRef.current) return; // index already built
  setSearchLoading(true);
  try {
    const mod = await import("@/lib/search");
    searchModuleRef.current = mod; // cache full module
    const data = await import("@/lib/data");
    searchIndexRef.current = mod.buildSearchIndex({
      experience: data.experience,
      projects: data.projects,
      skills: data.skills,
      awards: data.awards,
      community: data.community,
      education: data.education,
      leadership: data.leadership,
    });
  } catch (err) {
    console.error("[Search] Failed to load search module:", err);
    setSearchError(true);
    setSearchOpen(false);
    // re-attempt on next activation: searchModuleRef stays null, allowing retry
  } finally {
    setSearchLoading(false);
  }
}
```

**Error state**: `searchError === true` → trigger button receives `disabled` attribute and `opacity-50 cursor-not-allowed` visual. On next click, reset `searchError` to `false` before re-attempting import (allows retry without page reload).

**Debounced query** (175ms, within FR-004 150–200ms range):

```ts
useEffect(() => {
  if (!searchOpen || !searchIndexRef.current || !searchModuleRef.current) return;
  if (debounceRef.current) clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      setActiveResultIndex(-1); // reset selection on new query
      setSearchResults(searchModuleRef.current!.queryIndex(searchIndexRef.current!, trimmed));
    } else {
      setSearchResults([]);
    }
  }, 175);
  return () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };
}, [searchQuery, searchOpen]);
```

**Close handlers:**

- Escape key in input → close search, return focus to trigger.
- Click outside (via `useEffect` `mousedown` listener on `document`).
- On result select: scroll to `scrollAnchor` with `scrollIntoView({ behavior: 'smooth', block: 'start' })` after `scroll-margin-top` handles offset; then close.

**Keyboard nav (ARIA APG listbox):**

- ArrowDown/ArrowUp → `setActiveResultIndex`.
- Enter → select `searchResults[activeResultIndex]`.
- Tab → do nothing (panel stays open, focus moves to next tabbable).
- `aria-activedescendant` on input → `result-${activeResultIndex}` when index ≥ 0.

**ARIA attributes:**

```tsx
<div role="search">
  <button aria-expanded={searchOpen} aria-controls="search-input" aria-label="Search site" />
  <input
    id="search-input"
    role="combobox"
    aria-label="Search site"
    aria-activedescendant={
      activeResultIndex >= 0 ? `search-result-${activeResultIndex}` : undefined
    }
    aria-autocomplete="list"
    aria-controls="search-results"
  />
  <ul id="search-results" role="listbox" aria-live="polite" aria-label="Search results">
    {searchResults.map((r, i) => (
      <li id={`search-result-${i}`} role="option" aria-selected={activeResultIndex === i} />
    ))}
  </ul>
</div>
```

**Result count announcement** (`aria-live="polite"` region):

```tsx
<span className="sr-only" aria-live="polite" aria-atomic="true">
  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for {searchQuery}
</span>
```

**Empty state:** Non-empty query + zero results → "No results found". Empty/whitespace query → "Type to search..." placeholder, no results list.

**Reduced motion:** Search expand/collapse animation wrapped in `@media (prefers-reduced-motion: no-preference)` in CSS (or Tailwind `motion-safe:` prefix).

**Hamburger mutual exclusivity:**

```ts
// In mobile toggle handler:
if (searchOpen) setSearchOpen(false);
setMobileOpen((v) => !v);
```

**Error state:** `searchError === true` → search trigger button gets `disabled` attribute and visual muted style; re-attempt on next click (reset `searchError` before re-import).

---

## Phase 3 — Fluid Typography & Touch Targets

**FR-012, FR-013, FR-014** | Effort: S | Risk: Low

### `src/app/globals.css` additions

```css
/* Fluid headings (FR-013) */
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
h2 {
  font-size: clamp(1.5rem, 3.5vw, 2.5rem);
}

/* Minimum touch targets (FR-012) */
.touch-target {
  min-width: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Scroll offset for sticky nav (FR-034) */
section[id] {
  scroll-margin-top: 72px; /* 56px nav + 16px buffer */
}

/* Reduced motion — suppress all transitions and animations (FR-020) */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch target audit — apply `min-h-[48px] min-w-[48px]` padding to:

- `Nav.tsx`: search trigger, hamburger button, logo `<a>` → pad to 48px hit area
- `ThemeToggle.tsx`: wrapper button → `min-h-[48px] min-w-[48px]`
- `ScrollToTop.tsx`: button → `min-h-[48px] min-w-[48px]`
- `SocialLinks.tsx`: each icon link → `p-3` or equivalent to hit 48×48
- Hero CTA buttons: pad to 48×48 via `py-3 px-6` minimum
- Experience/Projects card CTAs: same

### Cards stacking (FR-014)

Experience and Projects sections — verify cards use `flex-col` or `grid` that collapses below `md`. If not, add `grid-cols-1 md:grid-cols-2` or equivalent. Internal padding: `p-4` (16px) or `p-5` (20px). No `truncate` or `overflow-hidden` on text.

---

## Phase 4 — Glassmorphism Sticky Nav

**FR-015, FR-016, FR-017** | Effort: S | Risk: Low (existing `backdrop-blur-md` already present)

### `Nav.tsx` scroll listener

Nav already has `backdrop-blur-md`. Spec requires removing blur on first scroll pixel and restoring 100ms after last scroll:

```ts
const [isScrolling, setIsScrolling] = useState(false);
const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 100);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", handleScroll);
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
  };
}, []);
```

Header className: toggle `backdrop-blur-md` vs no blur based on `isScrolling`:

```tsx
className={`fixed top-0 ... ${isScrolling ? '' : 'backdrop-blur-md'} will-change-transform`}
```

`will-change: transform` prevents GPU compositing drops on mid-range mobile.

Reduced motion: state transitions are CSS-free (JavaScript state toggle, no CSS transition on the blur) so FR-017 is satisfied by default — no `transition` class on the blur toggle.

---

## Phase 5 — Section Entry Animations

**FR-018 to FR-022** | Effort: M | Risk: Medium (IntersectionObserver, sessionStorage, FOUC script)

### `src/components/shared/AnimateOnScroll.tsx` (NEW)

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface AnimateOnScrollProps {
  sectionId: string;
  children: ReactNode;
  className?: string;
}

export function AnimateOnScroll({ sectionId, children, className }: AnimateOnScrollProps) {
  const storageKey = `anim:${sectionId}`;
  const [visible, setVisible] = useState(() => {
    try {
      return !!sessionStorage.getItem(storageKey);
    } catch {
      return false;
    }
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) return; // already animated (or sessionStorage unavailable fallback)
    const el = ref.current;
    if (!el) return;

    // Check if already in viewport on mount → appear instantly (FR-018)
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      setVisible(true);
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {}
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          try {
            sessionStorage.setItem(storageKey, "1");
          } catch {}
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [sectionId, storageKey, visible]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-400 motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
```

`sessionStorage` unavailable (catch block) → `visible` starts `false`, IntersectionObserver fires each time (fail-open, always animates — FR-018).

`motion-reduce:` Tailwind prefix suppresses transitions under `prefers-reduced-motion`. Ensure Tailwind config enables `motionSafe`/`motionReduce` variants (default in v3+; verify in v4).

### Wrap existing sections in `src/app/page.tsx`

```tsx
<AnimateOnScroll sectionId="about"><About profile={profile} /></AnimateOnScroll>
<AnimateOnScroll sectionId="experience"><Experience entries={experience} /></AnimateOnScroll>
// ... repeat for all 8 sections
```

Sections themselves remain server components.

### FOUC prevention — `src/app/layout.tsx`

`next-themes` with `attribute="data-theme"` already handles theme persistence. However, per FR-022, a blocking inline script is required to guarantee no FOUC before hydration:

```tsx
// In RootLayout, inside <html> before <body>:
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(window.matchMedia('(prefers-color-scheme: light)').matches)document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`,
  }}
/>
```

This must be placed before `<body>` (or as first child of `<body>`) to execute before first paint. Check if `next-themes` already injects this — if so, this is redundant and should be omitted. Verify by inspecting the rendered HTML.

### Card hover transitions (FR-021)

Add to experience card, project card, skill card, award card:

```css
/* In globals.css under @media (prefers-reduced-motion: no-preference) */
.card-hover {
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;
}
.card-hover:hover,
.card-hover:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

Or via Tailwind: `motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform motion-safe:duration-150`.

---

## Phase 6 — SEO Polish

**FR-023 to FR-030** | Effort: S | Risk: None

### `src/app/layout.tsx`

**JSON-LD additions** (already has `Person` schema; these are missing):

- Add `givenName: "Rohit"` and `familyName: "Vipin Mathews"` to the Person object.
- `sameAs` currently hardcoded. Source from `data/socials.json` via `socials.map(s => s.url)` — already imported as `profile` from `data.ts`. Add `import { socials } from '@/lib/data'` and use `socials.map(s => s.url)`.
- Place `<script type="application/ld+json">` inside `<head>` via Next.js App Router. In `layout.tsx`, add the JSON-LD `<script>` as the first child inside `<head>` using the App Router `<head>` export or directly in the layout JSX before `<body>`. Next.js App Router renders elements returned before `<body>` into `<head>` automatically. This satisfies Google's recommendation and schema.org validator requirements. Do not place it in `<body>`.

**Title update** (FR-028, ≤70 chars):
Current: `"Rohit Vipin Mathews — Director of Engineering & Architecture"` = 59 chars. PASS — no change needed. (Limit is ≤70 chars per spec clarification — not ≤60.)

**Description** (FR-029, 140–160 chars):
Current: 167 chars. Trim by ~10 chars: remove "Cloud-native, AI-enabled platforms across" → "Cloud-native AI platforms across K-12 Education, Agriculture, Logistics, and Hospitality."
Target: ~150 chars. Verify after edit.

**Canonical** (FR-027): Already present via `alternates: { canonical: BASE_URL }`. Verify rendered `<link rel="canonical">` is absolute URL.

**OG/Twitter** (FR-025, FR-026): Already present in metadata. Verify `og:image` resolves to absolute URL — `metadataBase` set to `BASE_URL` so relative `/og-image.jpg` should resolve. Check rendered HTML.

### Heading hierarchy audit (FR-023)

`src/app/page.tsx` or Hero component likely has `<h1>` for the name. Audit that:

- Exactly one `<h1>` exists (the person's name in Hero).
- All section titles use `<h2>` (check `SectionHeader.tsx`).
- No `<h3>` usage that skips `<h2>`, no `<h4>` that skips `<h3>`.

`SectionHeader.tsx` likely renders `<h2>`. Verify.

### Alt text audit (FR-030)

- Profile image in Hero: check `alt` is descriptive (e.g., "Rohit Vipin Mathews profile photo").
- Social icons: each `<a>` wrapping a react-icon needs `aria-label` with platform name.
- Decorative icons (inline section icons): `aria-hidden="true"`.

---

## Phase 7 — Core Web Vitals Hardening

**FR-031 to FR-034** | Effort: XS | Risk: None

### Font loading (FR-031)

`next/font` with `display: 'swap'` already configured in `layout.tsx`. `next/font` injects `<link rel="preconnect">` automatically for Google Fonts. Verify in rendered `<head>`.

If self-hosting fonts is desired (spec says "preferred") — out of scope for this feature; current CDN approach with `next/font` meets FR-031.

### Icon dimensions (FR-032, FR-033)

`react-icons` renders inline SVGs with no width/height by default — they inherit from font-size. Add explicit `size` prop to all icon usages that don't have it:

```tsx
<FiMapPin size={16} /> // already done in About.tsx
```

Audit all components for react-icons without explicit `size`. Add `size={16}` or `size={20}` as appropriate. This prevents the `width`/`height` attribute missing warning in Lighthouse.

### `scroll-margin-top` (FR-034)

Already covered in Phase 3 globals.css: `section[id] { scroll-margin-top: 72px; }`. Verify nav height is still 56px (`h-14`); buffer brings total to 72px. If nav height changes, update here.

---

## Phase 8 — Tests

**Constitution IV** | Effort: M

### `src/__tests__/search.test.ts`

Per-file 100% branch/function coverage enforced via `vitest.config.ts`.

Test cases:

- `buildSearchIndex` — verify entry count for each content type (experience, projects, leadership, skills, community, awards, education).
- `buildSearchIndex` — verify `scrollAnchor` values (`#experience`, `#projects`, etc.).
- `buildSearchIndex` — verify array fields joined with space (no commas).
- `buildSearchIndex` — snippet truncated at 120 chars at word boundary.
- `queryIndex` — case-insensitive match returns results.
- `queryIndex` — returns max 10 results.
- `queryIndex` — results ordered by canonical section order regardless of data order.
- `queryIndex` — `matchStart`/`matchEnd` correctly mark the matched substring in `title`.
- `queryIndex` — empty query returns empty array.
- `queryIndex` — whitespace-only query returns empty array.
- `queryIndex` — query with special chars treated as literals (no regex).
- `queryIndex` — no results for unmatched query.

### `src/__tests__/AnimateOnScroll.test.tsx`

- `sessionStorage` and `IntersectionObserver` stubbed via `vi.stubGlobal`.
- Already-in-viewport section: renders visible immediately, sets `sessionStorage`.
- Out-of-viewport section: renders invisible until IntersectionObserver fires.
- After session key set: re-mount renders visible without IntersectionObserver.
- `sessionStorage` unavailable: renders invisible, animates on intersection (fail-open).

---

## Constitution Check (Post-Design)

All six principles re-verified:

| Principle         | Verdict                                                                           |
| ----------------- | --------------------------------------------------------------------------------- |
| I. Headless CMS   | PASS — `search.ts` imports data types only; no hardcoded content strings          |
| II. Static Export | PASS — dynamic import fires client-side; no server or fetch dependency            |
| III. Code Quality | PASS — all new types exported; `AnimateOnScroll` is a thin client shell; no `any` |
| IV. Testing       | PASS — `search.ts` 100% coverage threshold enforced; browser globals stubbed      |
| V. UX Consistency | PASS — reduced-motion suppresses all new motion; ARIA APG listbox for search      |
| VI. Performance   | PASS — search lazy-loaded; no new synchronous scripts; fonts via `next/font`      |

---

## Implementation Order

Execute phases in this sequence (each is independently deployable):

1. **Phase 1** — About mobile fix (5 min, zero risk)
2. **Phase 6** — SEO polish (no UI risk; catch heading/alt issues early)
3. **Phase 7** — Core Web Vitals hardening (icon dims, scroll-margin-top)
4. **Phase 3** — Fluid typography + touch targets
5. **Phase 4** — Glassmorphism nav scroll behaviour
6. **Phase 5** — Section animations + FOUC script
7. **Phase 2** — Native search (largest, most state)
8. **Phase 8** — Tests (alongside Phase 2; `search.ts` tests must precede merge)

## Merge Gate Checklist

- [ ] `npm run lint:data` — pass
- [ ] `npm run lint` — pass (ESLint + Prettier)
- [ ] `npm run test` — pass (including `search.ts` 100% coverage)
- [ ] `npm run build` — zero errors, `out/` complete
- [ ] Lighthouse mobile Performance ≥ 90
- [ ] Lighthouse mobile SEO ≥ 95
- [ ] Lighthouse mobile Accessibility ≥ 95
- [ ] CLS < 0.1
- [ ] 375px viewport visual check: About sidebar left-aligned
- [ ] Search: activate, type "AWS", results appear, Escape collapses
- [ ] `prefers-reduced-motion: reduce`: all animations absent
