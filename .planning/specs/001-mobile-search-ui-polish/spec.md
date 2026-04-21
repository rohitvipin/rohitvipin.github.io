# Feature Specification: Mobile UX, Native Search & UI Animation Polish

**Feature Branch**: `feat/001-mobile-search-ui-polish`  
**Created**: 2026-04-21  
**Reviewed**: 2026-04-21 — validated by frontend UX, SEO/performance, and architecture specialists  
**Status**: Validated  
**Input**: "Hide location and email next to about section in mobile view, prefer single column layout. Add native search at top bar with expandable search text box. Add animation, smooth UI and best practices for enhanced UI experience. Mobile performance and SEO improvements."

---

## Clarifications

### Session 2026-04-21

- Q: About section mobile breakpoint — spec said 768px but code uses lg=1024px. Fix `ml-auto` at existing `lg` threshold or change breakpoint? → A: Keep `lg` breakpoint; fix only `ml-auto` alignment below 1024px. No breakpoint change.
- Q: Search index build time — FR-003 ("built at page load") vs FR-010 ("lazy on first activation") conflict. Which wins? → A: Full lazy load (Option A). Entire search module dynamically imported on first activation; index built once and cached in `useRef`.
- Q: About sidebar scope on mobile — spec said "location and email" but About.tsx has 4 items (location, years, timezone, email). Keep all 4 or hide some on mobile? → A: Keep all 4, left-aligned (Option A). No content hidden; only `ml-auto` removed.
- Q: Sections already in viewport on initial page load — animate or appear instantly? → A: Appear instantly in final state (Option A). `sessionStorage` flag set on mount; no animation plays on load.
- Q: Search + mobile hamburger coexistence — simultaneous states allowed? → A: Mutually exclusive (Option A). Opening search closes hamburger; opening hamburger closes search.
- Q: FR-018 animation scope — once per tab session or persist across sessions? → A: Once per tab session. `sessionStorage` resets on page refresh or new tab; animations replay in each new tab. No `localStorage` persistence.
- Q: FR-022 FOUC prevention — approach for static export with no server-side theme detection? → A: Inline blocking `<script>` in `<head>` reads `localStorage` theme key and sets `data-theme` attribute before hydration. First-visit (no stored preference) falls back to `prefers-color-scheme`. Script MUST be inlined (not deferred or async).
- Q: FR-013 `clamp()` middle values for fluid typography? → A: H1: `clamp(2rem, 5vw, 4rem)`; H2: `clamp(1.5rem, 3.5vw, 2.5rem)`.
- Q: `SearchResult` highlight marker format? → A: Index pair `{ matchStart: number; matchEnd: number }` — pure data, XSS-safe, rendering component decides visual treatment (e.g. `<mark>`).
- Q: FR-007/FR-008 Tab key behaviour and missing `aria-activedescendant` — follow ARIA APG listbox? → A: Yes. Tab exits the widget (focus moves to next tabbable element, panel stays open); Escape closes panel and returns focus to trigger. `aria-activedescendant` on input is required, updated to the focused option's id on arrow key navigation.

---

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Mobile About Section Single-Column Layout (Priority: P1)

A visitor opens the portfolio on a mobile device. The About section currently shows location and email inline beside the bio, making it look cluttered on narrow screens. On mobile, the layout switches to a clean single-column stack: bio text first, then contact details below.

**Why this priority**: Directly visible regression on every mobile visit. Simplest fix, highest impact per effort.

**Independent Test**: Open site at 375px viewport. Confirm location and email render below the bio text, not beside it. Confirm no overflow or truncation.

**Acceptance Scenarios**:

1. **Given** a viewport narrower than 1024px, **When** the About section renders, **Then** the sidebar (location, years, timezone, email) is left-aligned below the bio with no horizontal overflow or `ml-auto` offset.
2. **Given** a viewport of 1024px or wider, **When** the About section renders, **Then** the existing two-column layout is preserved unchanged.
3. **Given** either viewport, **When** the page loads, **Then** no content is hidden or omitted — only the layout changes.

---

### User Story 2 - Native Search with Expandable Top-Bar Input (Priority: P2)

A recruiter or visitor wants to quickly find a specific skill, company, or project. A search icon sits inside the existing navigation bar. Clicking it expands a text input in-place within the nav (no modal or overlay). As the user types, results from all portfolio sections appear instantly. Selecting a result scrolls to that section; the search collapses.

**Why this priority**: Adds meaningful discoverability. Differentiates from a static page.

**Independent Test**: Click search icon, type "AWS", confirm relevant results appear. Press Escape to collapse. Navigate results using keyboard arrow keys. Enter selects.

**Acceptance Scenarios**:

1. **Given** any page state, **When** the user activates the search icon, **Then** a text input expands inline within the nav bar with immediate keyboard focus.
2. **Given** the search input is open, **When** the user types a query (debounced at 150–200ms after last keystroke), **Then** matching items from all content sections appear; the full search pipeline completes within a single animation frame (~16ms) since the index is in-memory.
3. **Given** search results are shown, **When** the user selects a result (mouse click, Enter key, or screen reader activation), **Then** the page scrolls to the relevant section accounting for the fixed nav height offset, and the search input collapses.
4. **Given** the search input is open, **When** the user presses Escape or clicks outside, **Then** the input collapses with animation and focus returns to the search trigger button.
5. **Given** a query with no matches, **When** results are computed, **Then** a "No results found" message appears — never an empty blank area.
6. **Given** the results panel is open, **When** the user navigates with arrow keys, **Then** focus moves through results in order; Tab moves focus out of the widget without closing the panel; Escape closes the panel.
7. **Given** `prefers-reduced-motion: reduce` is active, **When** search expands or collapses, **Then** no animation plays — the input appears or disappears immediately.

---

### User Story 3 - Fluid Typography & Touch Target Sizing (Priority: P2)

A visitor on a phone can read headings comfortably and tap all interactive elements without precision tapping. All interactive elements have a minimum 48×48px hit area (visual size may be smaller; padding makes up the difference). Headings scale fluidly.

**Why this priority**: Core accessibility and mobile usability baseline.

**Independent Test**: On a 375px viewport, verify heading font scales at multiple widths. Inspect computed hit areas on nav links, social icons, CTAs — all ≥ 48×48px.

**Acceptance Scenarios**:

1. **Given** any viewport between 320px and 1440px, **When** headings render, **Then** font sizes scale continuously (H1: `clamp(2rem, 5vw, 4rem)`; H2: `clamp(1.5rem, 3.5vw, 2.5rem)`) without abrupt jumps or overflow.
2. **Given** a touch device, **When** the user taps any interactive element, **Then** the touch hit area is at least 48×48px (WCAG 2.5.5 AA minimum; Google recommendation). This applies to: nav links, search icon, social icon links, scroll-to-top button, theme toggle, "View Experience" / CTA buttons.
3. **Given** mobile viewport, **When** Experience and Projects card sections render, **Then** cards stack vertically with 16–20px internal padding and no text truncation.

---

### User Story 4 - Glassmorphism Sticky Navigation (Priority: P3)

A visitor scrolling a long portfolio on mobile can jump to any section. The nav bar stays fixed at the top with a blur-backdrop effect that doesn't obscure content.

**Why this priority**: Navigation ergonomics on long pages.

**Independent Test**: Scroll 500px down on mobile. Confirm nav is visible. Confirm blur effect. Confirm it does not shift content layout.

**Acceptance Scenarios**:

1. **Given** any viewport, **When** the user scrolls past the hero section, **Then** the navigation bar remains fixed at the top with a blur-backdrop effect; the nav height stays constant (no dimension changes on scroll that cause layout shift).
2. **Given** the sticky nav is visible, **When** it overlaps section content, **Then** the blur backdrop ensures legibility of both the nav and the underlying content.
3. **Given** `prefers-reduced-motion: reduce` is set, **When** the nav transitions between transparent and blurred states, **Then** no animation plays.
4. **Given** mid-range mobile hardware, **When** the user scrolls, **Then** `backdrop-filter` does not drop frames — achieved by removing blur on the first scroll pixel (any direction) and restoring 100ms after the last scroll event, with `will-change: transform` on the nav element.

---

### User Story 5 - UI Animation & Transition Polish (Priority: P3)

Sections animate smoothly on first scroll into view per tab session. Card interactions and theme transitions feel premium. All motion is suppressed for users who prefer reduced motion.

**Why this priority**: Enhances perceived quality without blocking core function.

**Independent Test**: Scroll through all sections — each fades/slides in once. Scroll back — no re-animation. Enable `prefers-reduced-motion` — all animations and transitions absent. Hover cards — subtle lift/shadow. Toggle theme — smooth colour transition with no flash.

**Acceptance Scenarios**:

1. **Given** a section is outside the viewport, **When** it scrolls into view for the first time in the current tab session, **Then** it animates in (fade + translate-up, ~400ms) once.
2. **Given** the user scrolls back past an animated section, **When** it re-enters the viewport, **Then** it does not re-animate (session state tracks which sections have already animated, using `sessionStorage` keyed by section ID, e.g. `anim:about`).
3. **Given** `prefers-reduced-motion: reduce` is set, **When** any animation or CSS transition would play (entry, hover, theme, search expand), **Then** no motion occurs — elements appear in final state immediately, `transition-duration` is effectively 0.
4. **Given** a card or interactive element, **When** the user hovers or focuses it, **Then** a subtle scale or shadow transition plays within 150–200ms.
5. **Given** theme toggle is activated, **When** the theme switches, **Then** colour transitions are smooth with no flash of unstyled content — a blocking inline script in `<head>` applies the stored theme before hydration.

---

### User Story 6 - Structured Data & Open Graph (Priority: P2)

Search engines and social platforms index the portfolio accurately. JSON-LD Person schema is injected at build time. Open Graph and Twitter Card tags are present so link previews on LinkedIn, Twitter, and Slack render correctly.

**Why this priority**: Long-term discoverability and professional impact. Zero runtime cost once implemented.

**Independent Test**: Validate JSON-LD at schema.org validator. Check og:image renders on a LinkedIn post preview. Run Lighthouse SEO — score ≥ 95.

**Acceptance Scenarios**:

1. **Given** the page `<head>`, **When** inspected, **Then** a JSON-LD `Person` schema block is present with: name, givenName, familyName, jobTitle, url, sameAs (social profile URLs), worksFor (Organisation), sourced from `data/profile.json` and `data/socials.json` at build time.
2. **Given** the page `<head>`, **When** inspected, **Then** `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card` (`summary_large_image`), `twitter:image` are all present with absolute URLs.
3. **Given** the page `<head>`, **When** inspected, **Then** a `<link rel="canonical">` tag points to the canonical URL (absolute, not relative) to prevent duplicate indexing from alternate serving paths.
4. **Given** the page HTML, **When** inspected, **Then** exactly one `<h1>` exists (the name), section titles use `<h2>`, no heading levels are skipped.
5. **Given** all images and functional icons, **When** inspected, **Then** each has a descriptive `alt` attribute.

---

### User Story 7 - Semantic HTML & Meta Tags (Priority: P2)

The page `<title>` and `<meta name="description">` include role and domain keywords. The heading hierarchy is correct. Alt text covers all images and icons.

**Why this priority**: Direct ranking signal; zero performance cost.

**Independent Test**: `document.querySelector('h1')` returns exactly one element. `document.title` includes "Director of Engineering". Lighthouse SEO passes.

**Acceptance Scenarios**:

1. **Given** the page `<head>`, **When** inspected, **Then** `<title>` follows the pattern "Rohit Vipin Mathews | Director of Engineering & Architecture | [Domain keyword]" and is ≤60 characters.
2. **Given** the page `<head>`, **When** inspected, **Then** `<meta name="description">` is between 140–160 characters and includes role and domain keywords without repetition.

---

### User Story 8 - Core Web Vitals & Font/Icon Stability (Priority: P3)

The portfolio achieves Lighthouse mobile performance ≥ 90. No visible layout shifts from fonts or icons loading. Fonts are visible immediately on load.

**Why this priority**: Google ranking signal; first impression on slow connections.

**Independent Test**: Lighthouse mobile audit on production build. CLS < 0.1. FCP < 2.5s. No icon/logo dimension warnings in Lighthouse.

**Acceptance Scenarios**:

1. **Given** page load on simulated slow 3G, **When** fonts load, **Then** fallback text is immediately visible (no invisible-text period).
2. **Given** the page uses external font CDNs, **When** the document `<head>` is inspected, **Then** `<link rel="preconnect">` tags are present for each font origin.
3. **Given** icons and the logo in the DOM, **When** inspected, **Then** explicit width and height attributes reserve space and prevent layout shift.
4. **Given** the search module, **When** the page first loads, **Then** the search index is loaded lazily (dynamic import triggered on first search activation) to avoid blocking Time to Interactive.
5. **Given** a Lighthouse mobile audit on the production build, **When** run, **Then** Performance score is ≥ 90 and CLS is < 0.1. This is a release gate, not a goal — PRs that regress below these thresholds must not be merged.

---

### Edge Cases

- Search query with special characters: treated as literals — `queryIndex` uses `String.prototype.includes()` (case-insensitive via `.toLowerCase()`), no regex interpretation, no injection risk.
- A single content item can only match one section (each index entry maps to exactly one `scrollAnchor`); no deduplication logic needed.
- Search and hamburger drawer are mutually exclusive — opening one closes the other. Single active nav state at all times.
- Sections already in viewport on initial page load appear instantly in final state — no animation plays. `sessionStorage` flag is set immediately so they don't animate on scroll-back either.
- Empty or whitespace-only search query shows placeholder state — never "No results found".
- What happens to sticky nav on very short pages where no scrolling occurs? Nav renders in its default state (no scroll listener fires); blur treatment is optional/decorative.
- What if `sessionStorage` is unavailable (private browsing restrictions)? Animations fall back to always-animate behaviour (fail open).
- If the nav height changes (e.g. future redesign), `scroll-margin-top` offsets and search result scroll behaviour must be updated together.
- Dynamic import failure (network/parse error): search trigger is visually disabled; failure logged to console; re-attempts on next activation.

---

## Requirements _(mandatory)_

### Functional Requirements

**Mobile Layout**

- **FR-001**: On viewports narrower than 1024px (`lg` breakpoint), the About section sidebar (all 4 items: location, years of experience, timezone, email) MUST be left-aligned — `ml-auto` removed. No items hidden. The two-column grid already collapses below `lg`; only the alignment needs fixing.

**Search**

- **FR-002**: The navigation bar MUST contain a search trigger button that, on activation, expands an inline text input within the existing nav bar (not a modal or overlay).
- **FR-003**: The search MUST query all portfolio content sections client-side with no network request. The entire search module (JSON imports + index builder + results UI) MUST be loaded via dynamic import on first user activation and never before. Once loaded, the index is built once and cached for the session.
- **FR-004**: The search input MUST debounce at 150–200ms; the in-memory query MUST complete within a single animation frame (~16ms) for the expected data size.
- **FR-005**: Selecting a search result MUST scroll the page to the relevant section, accounting for the fixed nav height offset via `scroll-margin-top` on section elements, then collapse the search input.
- **FR-006**: The search input MUST close on Escape key press or outside click, returning focus to the trigger button.
- **FR-007**: The search results MUST support keyboard navigation following the ARIA APG listbox pattern: arrow keys move between results, Enter selects, Tab moves focus out of the widget (panel stays open), Escape closes the panel and returns focus to the trigger button.
- **FR-008**: The search ARIA contract MUST include: `role="search"` on the wrapper, `aria-expanded` on the trigger button, `aria-controls` linking trigger to input, `aria-label="Search site"` on the input, `aria-activedescendant` on the input (updated to the currently focused `role="option"` element's id on arrow key navigation), `aria-live="polite"` for result count announcements, `role="listbox"` on results list, `role="option"` on each result item (each with a unique `id`).
- **FR-009**: When no results are found for a non-empty query, a "No results found" message MUST be displayed — never an empty container. An empty or whitespace-only query MUST show a placeholder state (e.g. "Type to search…") — never "No results found".
- **FR-010**: The search module MUST be loaded via dynamic import, triggered only on first user activation, to avoid blocking initial Time to Interactive. If the dynamic import fails (network error, parse error), the search trigger MUST be visually disabled and the failure logged to console; the trigger re-attempts import on the next user activation.
- **FR-011**: Under `prefers-reduced-motion: reduce`, all search expand/collapse animations MUST be suppressed.
- **FR-011a**: Search and the mobile hamburger drawer are mutually exclusive states. Opening the search input MUST close the hamburger drawer; opening the hamburger drawer MUST close the search input. Only one may be active at a time.

**Touch & Typography**

- **FR-012**: All interactive elements MUST have a touch hit area of at least 48×48px. Applies to: nav links, search trigger, social icon links, scroll-to-top button, theme toggle, CTA buttons. Hit area is achieved via padding (not margin) so pointer-events cover the full 48px minimum.
- **FR-013**: Heading font sizes MUST scale fluidly between 320px and 1440px using `clamp()`: H1 `clamp(2rem, 5vw, 4rem)`; H2 `clamp(1.5rem, 3.5vw, 2.5rem)`.
- **FR-014**: Experience and Projects cards MUST stack vertically on viewports below 768px with 16–20px internal padding and no text truncation.

**Navigation**

- **FR-015**: The navigation bar MUST remain fixed at the top on scroll with a blur-backdrop visual treatment. Nav height MUST remain constant during scroll (no dimension changes that cause CLS).
- **FR-016**: The `backdrop-filter` blur MUST be removed on the first scroll pixel (any direction) and restored 100ms after the last scroll event. `will-change: transform` MUST be set on the nav element to prevent GPU compositing drops on mid-range mobile.
- **FR-017**: Under `prefers-reduced-motion: reduce`, nav state transitions MUST be instantaneous.

**Animations**

- **FR-018**: Section entry animations MUST trigger once per tab session (resets on page refresh or new tab — `sessionStorage` is tab-scoped; no `localStorage` persistence). Session state MUST be tracked in `sessionStorage` keyed by section ID (e.g. `anim:about`). If `sessionStorage` is unavailable, animations MUST fall back to always-playing behaviour (fail open). Sections already in the viewport on initial page load MUST appear instantly in their final state with no animation; their `sessionStorage` flag MUST be set immediately on mount.
- **FR-019**: Animation wrappers MUST be thin `"use client"` wrapper components (e.g. `<AnimateOnScroll sectionId="about">`) so section content remains server-rendered. Sections MUST NOT be converted to client components to add animation.
- **FR-020**: All animations and CSS transitions MUST be suppressed when `prefers-reduced-motion: reduce` is set — elements appear in their final state immediately. This applies to entry animations, hover/focus transitions, theme transitions, and search expand/collapse.
- **FR-021**: Card and interactive element hover/focus transitions MUST complete within 150–200ms. Under `prefers-reduced-motion: reduce`, `transition-duration: 0` MUST apply — CSS transitions count as motion and are suppressed alongside animations (FR-020).
- **FR-022**: Theme colour transitions MUST be smooth with no flash of unstyled content. FOUC prevention MUST be implemented via an inline blocking `<script>` in `<head>` that reads the stored theme from `localStorage` and sets `data-theme` on `<html>` before any paint. On first visit (no stored preference), the script falls back to `prefers-color-scheme`. This script MUST be inlined (not deferred or async) to guarantee execution before hydration.

**SEO**

- **FR-023**: The page MUST contain exactly one `<h1>` element (the person's name); all section titles MUST use `<h2>`; no heading levels may be skipped.
- **FR-024**: A JSON-LD `Person` schema block MUST be present in `<head>`, populated at build time from `data/profile.json` and `data/socials.json`, including: `name`, `givenName`, `familyName`, `jobTitle`, `url`, `sameAs` array, `worksFor` (Organisation type with `name` field).
- **FR-025**: Open Graph tags MUST be present: `og:title`, `og:description`, `og:image` (absolute URL to pre-generated image in `public/`), `og:url`, `og:type`.
- **FR-026**: Twitter Card tags MUST be present: `twitter:card` (value: `"summary_large_image"`), `twitter:title`, `twitter:description`, `twitter:image`.
- **FR-027**: A `<link rel="canonical">` MUST be present with the absolute canonical URL.
- **FR-028**: `<title>` MUST follow the pattern "Rohit Vipin Mathews | [Role] | [Domain keyword]" and MUST be ≤60 characters for SERP display safety (browsers have no official title length limit; search engines truncate display at ~55–60 characters).
- **FR-029**: `<meta name="description">` MUST be 140–160 characters with role and domain keywords.
- **FR-030**: All images and functional icons MUST have descriptive `alt` attributes.

**Core Web Vitals**

- **FR-031**: Fonts MUST use `font-display: swap` equivalent strategy. If using an external font CDN, `<link rel="preconnect">` MUST be added for each font origin. Self-hosted fonts are preferred.
- **FR-032**: All icons and the logo MUST have explicit `width` and `height` attributes in the DOM to prevent layout shift.
- **FR-033**: Icons MUST remain SVG-based (not icon fonts) to avoid FOIT/FOUT.
- **FR-034**: All `<section>` elements MUST have `scroll-margin-top` set to at least the nav height (56px) plus 8px buffer to prevent content being hidden behind the sticky nav on anchor scroll.

### Search Index Field Manifest

The search index MUST cover these fields per content type:

| Content Type | Indexed Fields                                                      | Snippet Source                               | Section Anchor |
| ------------ | ------------------------------------------------------------------- | -------------------------------------------- | -------------- |
| Experience   | company, role, description, highlights (joined), techStack (joined) | First 120 chars of description               | `#experience`  |
| Projects     | name, client, description, highlights (joined), tech (joined)       | First 120 chars of description               | `#projects`    |
| Skills       | category, skill names (joined)                                      | Skill names list                             | `#skills`      |
| Awards       | title, organization, description                                    | First 120 chars of description               | `#awards`      |
| Community    | title, type, description, highlights (joined)                       | First 120 chars of description               | `#community`   |
| Education    | degree, institution                                                 | Degree + institution                         | `#education`   |
| Leadership   | title, section titles (joined), section descriptions (joined)       | First 120 chars of first section description | `#leadership`  |

Array fields (`highlights[]`, `techStack[]`, `tech[]`, skill names) MUST be joined with space before indexing. Snippet is the first 120 characters of the designated snippet source field, trimmed at a word boundary.

### Search Utility Architecture

The search index builder and query matcher MUST be exported pure functions in `src/lib/search.ts`:

- `buildSearchIndex(data: AllContentData): SearchIndex` — deterministic, side-effect free
- `queryIndex(index: SearchIndex, query: string): SearchResult[]` — case-insensitive substring match via `String.prototype.includes()` (no regex, no injection risk), returns max 10 results ranked by canonical section order

These pure functions enable 100% unit test coverage without mocking.

**Type definitions required in `src/lib/search.ts`:**

- `AllContentData` — aggregate input combining all 7 content arrays: `{ experience: ExperienceEntry[]; projects: Project[]; skills: SkillCategory[]; awards: Award[]; community: CommunityEntry[]; education: Education[]; leadership: Leadership[] }`
- `SearchIndexEntry` — `{ sectionId: string; sectionLabel: string; title: string; snippet: string; scrollAnchor: string }`
- `SearchResult` — extends `SearchIndexEntry` with `matchStart: number; matchEnd: number` — zero-based indices of the matched substring within the `title` field; pure data, rendering component decides visual treatment

**Canonical section order** (used for `queryIndex` result ranking):
`experience → projects → leadership → skills → community → awards → education`

**Dynamic import ownership**: `Nav.tsx` owns the `useRef<SearchIndex | null>` cache and the `dynamic import('./search')` call. On first user activation, Nav fires the dynamic import, awaits resolution, calls `buildSearchIndex`, and stores the result in the ref. Subsequent activations use the cached ref directly.

**Test requirements for `src/lib/search.ts`:**

- 100% statement, branch, function, and line coverage MUST be enforced via a per-file threshold in `vitest.config.ts`.
- `sessionStorage` and `matchMedia('(prefers-reduced-motion: reduce)')` MUST be stubbed via `vi.stubGlobal` in all tests involving animation components or search UI.
- `IntersectionObserver` MUST be stubbed with a mock that allows manual callback invocation to test scroll-in-view logic.

### Key Entities

- **AllContentData**: Aggregate input type for `buildSearchIndex` — combines all 7 content data arrays. Defined in `src/lib/search.ts`. All fields required; no optional content types.
- **SearchIndex**: Flat array of `SearchIndexEntry` records built from all content JSON via dynamic import. Each entry holds: `sectionId`, `sectionLabel`, `title`, `snippet`, `scrollAnchor`.
- **SearchResult**: A `SearchIndexEntry` extended with `matchStart: number` and `matchEnd: number` — zero-based indices marking the matched substring within the `title` field. Pure data; rendering component applies visual treatment.
- **AnimationObserver**: Intersection Observer instance per `<AnimateOnScroll>` wrapper. Checks `sessionStorage` before attaching; disconnects after first trigger. MUST be cleaned up in `useEffect` return function to prevent memory leaks if the component unmounts before the intersection triggers.

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: On a 375px viewport, the About section shows no horizontal overflow and location/email appear below the bio — zero layout complaints on visual regression snapshot.
- **SC-002**: A user can activate search, type a 3-character query, and see matching results appear within one visual frame after the debounce resolves (~200ms total from last keystroke).
- **SC-003**: All interactive elements in the audit scope (nav links, search icon, social icons, scroll-to-top, theme toggle, CTA buttons) pass a 48×48px touch hit area check with zero failures.
- **SC-004**: Lighthouse mobile SEO score is 95 or above on the production build.
- **SC-005**: Lighthouse mobile Performance score is 90 or above and CLS is below 0.1 on the production build. This is a merge gate — regressions below these thresholds block merge.
- **SC-006**: Zero content is hidden on mobile — only layout changes (single-column vs multi-column).
- **SC-007**: All animations and CSS transitions are absent and elements appear in final state when `prefers-reduced-motion: reduce` is active — verified by accessibility audit.
- **SC-008**: The search index covers all 7 content types; a query matching a term present in any of them returns at least one relevant result.
- **SC-009**: Link preview for the portfolio URL on LinkedIn/Twitter/Slack renders correct title, description, and image — verifiable via Open Graph debugger.
- **SC-010**: schema.org JSON-LD validator reports zero errors for the Person structured data block.

---

## Assumptions

- Search is entirely client-side — consistent with static export constraint (no backend).
- "Expandable" search means the text input animates open within the existing nav bar — the search lives inside `Nav.tsx` (already a `"use client"` component), not as a separate client island.
- `backdrop-filter: blur()` is used for the glassmorphism nav — browser support is ~95%+ globally as of 2026; no polyfill needed.
- Section animations use Intersection Observer API — no additional animation library added.
- Fluid typography uses `clamp()` — no JavaScript required.
- Structured data and meta tags are sourced from `data/profile.json` and `data/socials.json` at build time.
- Mobile threshold is 768px (Tailwind `md` breakpoint), consistent with existing codebase conventions.
- Animation session tracking uses `sessionStorage` (tab-scoped, resets on refresh or new tab) — not `localStorage`. Unavailability of `sessionStorage` (e.g. certain private browsing modes) falls back to always-animate.
- `og:image` references a pre-generated static image in `public/` (aligns with existing `generate-favicons.ts` pipeline).
- Canonical URL is absolute, using the live URL `https://rohitvipin.github.io/`.
- Nav height is currently 56px (`h-14` in Tailwind). `scroll-margin-top` values derive from this and must be updated if nav height changes.
- Icons remain SVG (via `react-icons`) — no icon font loading.
- `twitter:card` type is `summary_large_image` — matches pre-generated `og:image` dimensions.
- Theme FOUC prevention uses a blocking inline `<script>` in `<head>` reading `localStorage`; first-visit defaults to `prefers-color-scheme`. No FOUC after first visit.
