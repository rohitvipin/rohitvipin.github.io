# Tasks: Mobile UX, Native Search & UI Animation Polish

**Feature**: `feat/001-mobile-search-ui-polish`  
**Generated**: 2026-04-21  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Implementation Strategy

Execute phases in plan-recommended order (lowest risk first, search last):

1. US1 — About mobile fix (XS, zero risk)
2. US6 + US7 — SEO & meta (S, no UI risk)
3. US8 — Core Web Vitals hardening (XS, icon audit)
4. US3 — Fluid typography + touch targets (S)
5. US4 — Glassmorphism nav scroll behaviour (S)
6. US5 — Section animations + FOUC (M)
7. US2 — Native search (L, most state — keep last)

MVP scope: complete US1 alone for an immediately shippable fix.

---

## Phase 1: Setup

- [ ] T001 Update `vitest.config.ts` to add per-file 100% statement/branch/function/line coverage threshold for `src/lib/search.ts`

---

## Phase 2: User Story 1 — Mobile About Layout Fix

**Goal**: About sidebar left-aligns below bio on viewports < 1024px.  
**Independent test**: Open at 375px — sidebar stacks below bio, left-aligned, no overflow.

- [ ] T002 [US1] Change `ml-auto` to `lg:ml-auto` on sidebar div in `src/components/about/About.tsx`

---

## Phase 3: User Story 6 — Structured Data & Open Graph

**Goal**: JSON-LD Person schema complete; OG/Twitter tags present with absolute URLs.  
**Independent test**: schema.org validator → zero errors; og:image resolves in OG debugger; Lighthouse SEO ≥ 95.

- [ ] T003 [US6] Add `givenName: "Rohit"` and `familyName: "Vipin Mathews"` to JSON-LD Person object in `src/app/layout.tsx`
- [ ] T004 [US6] Import `socials` from `@/lib/data` and replace hardcoded `sameAs` array with `socials.map(s => s.url)` in `src/app/layout.tsx`
- [ ] T005 [P] [US6] Verify `og:image`, `og:url`, `twitter:card` use absolute URLs via `metadataBase` in `src/app/layout.tsx`; fix any relative URL usage

---

## Phase 4: User Story 7 — Semantic HTML & Meta Tags

**Goal**: Single h1, no skipped heading levels, 140–160 char description, descriptive alt text.  
**Independent test**: `document.querySelector('h1')` returns exactly one element; Lighthouse SEO flags zero heading or alt issues.

- [ ] T006 [US7] Trim `<meta name="description">` to 140–160 chars (remove ~10 chars from current 167-char value) in `src/app/layout.tsx`
- [ ] T007 [P] [US7] Audit heading hierarchy across `src/app/page.tsx` and all section components — confirm exactly one `<h1>`, all section titles `<h2>`, no skipped levels
- [ ] T008 [P] [US7] Add descriptive `alt` to profile image in Hero component; add `aria-label` with platform name to each social icon `<a>` link; add `aria-hidden="true"` to decorative inline icons across `src/components/`

---

## Phase 5: User Story 8 — Core Web Vitals & Font/Icon Stability

**Goal**: No icon-dimension layout shift; font preconnect present.  
**Independent test**: Lighthouse mobile — CLS < 0.1; no width/height missing warnings on icons.

- [ ] T009 [US8] Audit all `react-icons` usages across `src/components/` — add explicit `size={16}` or `size={20}` to every icon missing a `size` prop to prevent layout shift
- [ ] T010 [P] [US8] Verify `<link rel="preconnect">` tags exist for each font origin in `src/app/layout.tsx` (next/font injects these automatically — confirm in rendered `<head>`)

---

## Phase 6: User Story 3 — Fluid Typography & Touch Targets

**Goal**: Headings scale via clamp(); all interactive elements ≥ 48×48px hit area; cards stack on mobile.  
**Independent test**: 375px viewport — headings scale; inspect computed hit areas on all interactive elements ≥ 48×48px; Experience/Projects cards stack with ≥ 16px padding.

- [ ] T011 [US3] Add fluid heading rules to `src/app/globals.css`: `h1 { font-size: clamp(2rem, 5vw, 4rem) }` and `h2 { font-size: clamp(1.5rem, 3.5vw, 2.5rem) }`
- [ ] T012 [US3] Add to `src/app/globals.css`: `.touch-target` class (min 48×48px flexbox centre), `section[id] { scroll-margin-top: 72px }`, and `@media (prefers-reduced-motion: reduce)` block suppressing all animation/transition durations
- [ ] T013 [P] [US3] Apply `min-h-[48px] min-w-[48px]` hit area to search trigger, hamburger button, and logo `<a>` in `src/components/shared/Nav.tsx`
- [ ] T014 [P] [US3] Apply `min-h-[48px] min-w-[48px]` to wrapper button in `src/components/shared/ThemeToggle.tsx`
- [ ] T015 [P] [US3] Apply `min-h-[48px] min-w-[48px]` to button in `src/components/shared/ScrollToTop.tsx`
- [ ] T016 [P] [US3] Apply `p-3` (or equivalent) to each social icon `<a>` link in `src/components/` to achieve 48×48px hit area
- [ ] T017 [US3] Verify Experience and Projects card grids use `grid-cols-1 md:grid-cols-2` (or `flex-col` below md) with `p-4`/`p-5` internal padding and no `truncate` on text in `src/components/experience/` and `src/components/projects/`

---

## Phase 7: User Story 4 — Glassmorphism Sticky Navigation

**Goal**: Blur removed on scroll start, restored 100ms after scroll end; no CLS from nav resize.  
**Independent test**: Scroll 500px — blur disappears during scroll, returns 100ms after stop; nav height constant throughout.

- [ ] T018 [US4] Add `isScrolling` state, passive scroll event listener, and 100ms restore timer (`scrollTimerRef`) to `src/components/shared/Nav.tsx`; clean up listener and timer in effect return
- [ ] T019 [US4] Toggle `backdrop-blur-md` conditionally on `isScrolling` and add `will-change-transform` to nav element class in `src/components/shared/Nav.tsx`

---

## Phase 8: User Story 5 — UI Animation & Transition Polish

**Goal**: Sections fade/slide in once per session; card hover lift; FOUC-free theme; all motion suppressed under reduced-motion.  
**Independent test**: Scroll all sections — each animates once; scroll back — no re-animation; enable `prefers-reduced-motion` — all motion absent; hover card — subtle lift within 150ms.

- [ ] T020 [US5] Add `.card-hover` CSS class with `motion-safe` guarded `transform 150ms` and `box-shadow 150ms` transitions to `src/app/globals.css`
- [ ] T021 [US5] Create `src/components/shared/AnimateOnScroll.tsx`: `"use client"` wrapper with `IntersectionObserver` (threshold 0.1), `sessionStorage` keyed by `sectionId`, viewport-on-mount instant-show, and `motion-reduce:transition-none` Tailwind class
- [ ] T022 [US5] Wrap all section components in `src/app/page.tsx` with `<AnimateOnScroll sectionId="...">` — sections remain server components
- [ ] T023 [US5] Add inline blocking FOUC script to `src/app/layout.tsx` (before `<body>`) reading `localStorage` theme key and setting `data-theme` on `<html>`; skip if `next-themes` already injects equivalent script (verify by inspecting rendered HTML first)
- [ ] T024 [US5] Apply `.card-hover` class to Experience, Projects, Skills, and Awards card components in `src/components/`
- [ ] T025 [US5] Write `src/__tests__/AnimateOnScroll.test.tsx`: stub `IntersectionObserver` and `sessionStorage` via `vi.stubGlobal`; cover already-in-viewport (instant show + sessionStorage set), out-of-viewport (invisible until IO fires), session-cached re-mount (visible without IO), and sessionStorage-unavailable (fail-open) paths

---

## Phase 9: User Story 2 — Native Search

**Goal**: Inline nav search over all 7 content sections; ARIA APG listbox; lazy-loaded; keyboard nav; mutual exclusivity with hamburger.  
**Independent test**: Click search icon → input expands with focus; type "AWS" → results appear within ~200ms of last keystroke; Escape → collapses; arrow keys navigate results; Enter selects and scrolls; `prefers-reduced-motion` — no expand animation.

- [ ] T026 [US2] Create `src/lib/search.ts` — export `AllContentData`, `SearchIndexEntry`, `SearchResult` (with `matchStart`/`matchEnd`, `-1` sentinel for non-title matches), and `SearchIndex` type aliases
- [ ] T027 [US2] Implement `buildSearchIndex(data: AllContentData): SearchIndex` in `src/lib/search.ts` — canonical order: experience → projects → leadership → skills → community → awards → education; per-type snippet and title per plan field manifest; array fields joined with space; snippet truncated at 120 chars at word boundary
- [ ] T028 [US2] Implement `queryIndex(index: SearchIndex, query: string): SearchResult[]` in `src/lib/search.ts` — case-insensitive `includes()` on full-text string; `matchStart`/`matchEnd` from `title` field only; max 10 results; canonical section order; empty/whitespace query returns `[]`
- [ ] T029 [US2] Add search state (`searchOpen`, `searchQuery`, `searchResults`, `searchLoading`, `searchError`, `activeResultIndex`) and refs (`searchIndexRef`, `searchModuleRef`, `searchInputRef`, `debounceRef`) to `src/components/shared/Nav.tsx`
- [ ] T030 [US2] Implement `activateSearch()` in `src/components/shared/Nav.tsx`: close hamburger if open (FR-011a), set `searchOpen`, dynamic import `@/lib/search` + `@/lib/data` on first call, build and cache index in `searchIndexRef`; handle import failure by setting `searchError` and logging; reset `searchError` before re-attempt
- [ ] T031 [US2] Implement 175ms debounced query `useEffect` in `src/components/shared/Nav.tsx`: call `queryIndex` when `searchOpen` and index cached; clear results on empty/whitespace query; clean up timer in effect return
- [ ] T032 [US2] Add hamburger mutual exclusivity to `src/components/shared/Nav.tsx`: opening hamburger closes search (`setSearchOpen(false)`); opening search closes hamburger (`setMobileOpen(false)`)
- [ ] T033 [US2] Add search UI to `src/components/shared/Nav.tsx`: trigger button (`aria-expanded`, `aria-controls`, `disabled` on error), inline input (`role="combobox"`, `aria-label="Search site"`, `aria-activedescendant`, `aria-autocomplete="list"`, `aria-controls`), results list (`role="listbox"`, `aria-live="polite"`), each result (`role="option"`, `aria-selected`, unique `id`), `role="search"` wrapper, `sr-only` result count announcement region
- [ ] T034 [US2] Implement keyboard navigation in search input in `src/components/shared/Nav.tsx`: ArrowDown/Up updates `activeResultIndex`; Enter selects active result (scroll + close); Escape closes panel and returns focus to trigger; Tab does nothing (panel stays open)
- [ ] T035 [US2] Add `mousedown` outside-click close handler via `useEffect` in `src/components/shared/Nav.tsx`; clean up listener in effect return
- [ ] T036 [US2] Add "No results found" empty state (non-empty query + zero results) and "Type to search..." placeholder (empty/whitespace query) to search panel in `src/components/shared/Nav.tsx`
- [ ] T037 [US2] Write `src/__tests__/search.test.ts` covering all branches to satisfy 100% threshold: `buildSearchIndex` entry count per content type, `scrollAnchor` values, array field joining (no commas), snippet truncation at word boundary; `queryIndex` case-insensitive match, max-10 cap, canonical section order, `matchStart`/`matchEnd` title indices, `-1` sentinel for non-title match, empty query, whitespace query, special chars as literals, no-match query

---

## Final Phase: Polish & Cross-Cutting

- [ ] T038 Run `npm run lint:data` and fix any JSON schema validation errors
- [ ] T039 Run `npm run lint` and fix all ESLint + Prettier issues
- [ ] T040 Run `npm run test` — verify all tests pass and `src/lib/search.ts` meets 100% branch/function coverage threshold
- [ ] T041 Run `npm run build` — verify zero TypeScript errors and `out/` directory complete
- [ ] T042 Visual check at 375px viewport: About sidebar left-aligned below bio, no overflow, all 4 items visible
- [ ] T043 Manual search smoke test: activate search, type "AWS", confirm results, press Escape, verify keyboard arrow nav and Enter selection
- [ ] T044 Verify `prefers-reduced-motion: reduce`: all animations, transitions, and search expand animations absent; elements appear in final state

---

## Dependencies

```
T001 ─── T026 → T027 → T028 (search.ts must be complete before Nav integration)
                             └── T029 → T030 → T031 → T032 → T033 → T034 → T035 → T036 → T037
T002 (independent — no blockers)
T003 → T004 → T005 (layout.tsx SEO — sequential, same file)
T006, T007, T008 (parallel — different files)
T009, T010 (parallel — different files/concerns)
T011 → T012 (globals.css — sequential, same file)
T013, T014, T015, T016 (parallel — different component files)
T017 (independent audit)
T018 → T019 (Nav.tsx scroll state — sequential, same file)
T020 → T021 → T022 → T023 → T024 → T025 (animation chain — T020 globals first, then component)
T038–T044 (all after implementation phases complete)
```

## Parallel Execution Within Phases

**Phase 4 (SEO)**: T005 can run in parallel with T003+T004 only if on separate files — not applicable here (all layout.tsx). Run T003 → T004 → T005 sequentially.

**Phase 5 (Semantic)**: T007 (page.tsx audit) and T008 (alt text in components/) can run in parallel since they touch different files.

**Phase 6 (Touch targets)**: T013, T014, T015, T016 touch four different files — all can run in parallel after T011+T012 complete.

**Phase 9 (Search)**: T026 → T027+T028 (T027 and T028 are in the same file, sequential) → T029...T037 (all Nav.tsx, sequential). T037 (tests) can be written in parallel with T033–T036 since it's a different file.

---

## Task Count Summary

| Phase     | User Story | Tasks  |
| --------- | ---------- | ------ |
| Setup     | —          | 1      |
| Phase 2   | US1 (P1)   | 1      |
| Phase 3   | US6 (P2)   | 3      |
| Phase 4   | US7 (P2)   | 3      |
| Phase 5   | US8 (P3)   | 2      |
| Phase 6   | US3 (P2)   | 7      |
| Phase 7   | US4 (P3)   | 2      |
| Phase 8   | US5 (P3)   | 6      |
| Phase 9   | US2 (P2)   | 12     |
| Polish    | —          | 7      |
| **Total** |            | **44** |
