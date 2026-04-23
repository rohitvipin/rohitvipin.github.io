# Design System

Design language for the Rohit Vipin Mathews portfolio. Dark-first, token-driven, Tailwind 4 for layout.

---

## Colour Tokens

All colours reference CSS custom properties. Never hardcode hex/rgb in components.

### Dark theme (`:root` — default)

| Token           | Value                   | Role                        |
| --------------- | ----------------------- | --------------------------- |
| `--bg`          | `#0a0a0f`               | Page background             |
| `--surface`     | `#13131a`               | Card / section background   |
| `--surface-2`   | `#1a1a26`               | Elevated surface, chip fill |
| `--border`      | `#1e1e2e`               | Borders and dividers        |
| `--accent`      | `#6366f1`               | Primary accent (indigo)     |
| `--accent-glow` | `rgba(99,102,241,0.15)` | Accent shadow / ring        |
| `--accent-2`    | `#22d3ee`               | Secondary accent (cyan)     |
| `--text`        | `#e2e8f0`               | Primary text                |
| `--muted`       | `#8896b8`               | Secondary text              |
| `--muted-2`     | `#6b7a99`               | Tertiary / meta text        |
| `--success`     | `#22c55e`               | Success state               |
| `--shadow-card` | `rgba(0,0,0,0.15)`      | Card drop shadow            |

### Light theme (`[data-theme="light"]`)

| Token           | Value                  |
| --------------- | ---------------------- |
| `--bg`          | `#f5f5f4`              |
| `--surface`     | `#fafaf9`              |
| `--surface-2`   | `#e7e5e4`              |
| `--border`      | `#d6d3d1`              |
| `--accent`      | `#4f46e5`              |
| `--accent-glow` | `rgba(79,70,229,0.10)` |
| `--accent-2`    | `#0891b2`              |
| `--text`        | `#0f172a`              |
| `--muted`       | `#5d6b84`              |
| `--muted-2`     | `#52627b`              |
| `--success`     | `#16a34a`              |
| `--shadow-card` | `rgba(0,0,0,0.08)`     |

Theme switching via `next-themes` with `attribute="data-theme"`, default `system`.

---

## Typography

| Element     | Size                           | Weight   | Notes                        |
| ----------- | ------------------------------ | -------- | ---------------------------- |
| `h1`        | `clamp(2rem, 5vw, 4rem)`       | `bold`   | Fluid, `tracking-tight`      |
| `h2`        | `clamp(1.5rem, 3.5vw, 2.5rem)` | `bold`   | Fluid, `tracking-tight`      |
| Hero name   | `text-5xl lg:text-6xl`         | `bold`   | `leading-tight`              |
| Hero title  | `text-xl`                      | `medium` | `gradient-text` utility      |
| Section h2  | `text-3xl`                     | `bold`   | `tracking-tight`             |
| Body / lead | `text-lg`                      | —        | `leading-relaxed`, `--muted` |
| Meta / chip | `text-xs`                      | —        | `--muted-2`                  |
| Mono label  | `text-xs font-mono`            | —        | Used in `TechChip`           |

**Font family:** Inter (Google Fonts, `display: swap`) exposed as `--font-inter`. Fallback: `system-ui, sans-serif`.  
**Mono stack:** `ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`.  
**Base line-height:** `1.6`.  
**Font smoothing:** `-webkit-font-smoothing: antialiased`.

### Gradient text

```css
.gradient-text {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

Use on hero title, metric values, and any emphasis that needs the accent gradient.

---

## Layout & Spacing

| Pattern            | Value / class                             |
| ------------------ | ----------------------------------------- |
| Max content width  | `max-w-6xl mx-auto px-6`                  |
| Section vertical   | `.section` → `padding: 5rem 0`            |
| Scroll offset      | `section[id] { scroll-margin-top: 72px }` |
| Hero grid          | `lg:grid-cols-[3fr_2fr] gap-16`           |
| Metrics grid       | `grid-cols-2 md:grid-cols-4 gap-4`        |
| Nav height         | `h-14` (56 px)                            |
| Section header gap | `mb-12`                                   |

---

## Component Patterns

### Card (`.card`)

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 12px;
transition:
  border-color 0.2s ease,
  box-shadow 0.2s ease;
```

Hover state:

```css
border-color: var(--accent);
box-shadow:
  0 0 0 1px var(--accent-glow),
  0 8px 32px var(--accent-glow);
```

Optional lift modifier `.card-hover` adds `transform: translateY(-2px)` + `box-shadow: 0 8px 24px var(--shadow-card)` on hover/focus-within. Gated behind `prefers-reduced-motion: no-preference`.

### Collapsible card (`.card-details`)

Used in ExperienceCard, ProjectCard, SkillCategoryCard, CommunityCard. Native `<details>/<summary>` — no JS toggle state.

```tsx
<details className="card-details">
  <summary aria-label="Show highlights (N items)">{/* visible header row */}</summary>
  {/* revealed content */}
</details>
```

CSS in `globals.css` animates content with `@starting-style` (opacity + translate `0.22s`). Height animated via `interpolate-size: allow-keywords` where supported (Chrome 129+, Firefox 136+). All animation gated behind `prefers-reduced-motion: no-preference`.

For entries that should default open (e.g., current role), set the `open` attribute: `<details open={entry.current} …>`.

### SectionHeader

```tsx
<div className="mb-12">
  <h2 className="text-3xl font-bold tracking-tight text-[var(--text)]">…</h2>
  <div className="mt-2 h-0.5 w-12 rounded bg-[var(--accent)]" /> {/* accent underline bar */}
  <p className="mt-3 text-[var(--muted)] text-base">…</p> {/* optional subtitle */}
</div>
```

### TechChip

Pill badge for technology labels.

```tsx
<span
  className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono
  border border-[var(--border)] text-[var(--muted)] bg-[var(--surface-2)]
  hover:border-[var(--accent)] hover:text-[var(--accent)]
  transition-all duration-150 cursor-default"
>
  {label}
</span>
```

### Tag badge (inline, no hover)

Used on hero profile tags — lighter than TechChip, no background fill:

```tsx
<span className="px-2.5 py-0.5 rounded-md border border-[var(--border)] text-xs text-[var(--muted-2)]">
  {tag}
</span>
```

### Buttons

Three variants used in the hero:

| Variant   | Classes                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Primary   | `px-5 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold hover:opacity-90 transition-opacity`                                                   |
| Secondary | `px-5 py-2.5 rounded-lg border border-[var(--accent)]/50 text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent)]/8 transition-colors`                          |
| Ghost     | `px-5 py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted)] text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors` |

### Nav (sticky header)

```
fixed top-0 z-50 h-14
border-b border-[var(--border)]
bg-[var(--bg)]/80 backdrop-blur-md
```

Logo: `border border-[var(--accent)] text-[var(--accent)] font-mono`, hover flips to `bg-[var(--accent)] text-[var(--bg)]`.  
Active link: `text-[var(--accent)] font-medium` + `2px` accent underline bar at `bottom: -19px`.  
Inactive link: `text-[var(--muted)] hover:text-[var(--text)]`.

### Social / icon links

```
min-h-[48px] min-w-[48px] rounded-lg
border border-[var(--border)] text-[var(--muted)]
hover:text-[var(--accent)] hover:border-[var(--accent)]
transition-all duration-200
```

### ThemeToggle

```
min-h-[48px] min-w-[48px] rounded-lg
border border-[var(--border)] text-[var(--muted)]
hover:text-[var(--text)] hover:border-[var(--accent)]
transition-all duration-200
```

Icons: `FiSun` (dark mode) / `FiMoon` (light mode), size `16`. Hydration-safe: renders a same-size empty `div` until mounted.

### ScrollToTop

Fixed FAB, appears after 400 px scroll:

```
fixed bottom-6 right-6 z-40
min-h-[48px] min-w-[48px] rounded-full
bg-[var(--accent)] text-[var(--bg)]
shadow-lg hover:opacity-90 transition-opacity
```

Icon: `FiArrowUp`, size `18`.

### Metric cards

**Primary** — uses `.card p-4`:

- Label: `text-xs text-[var(--muted)]`
- Value: `font-bold gradient-text` (`text-4xl` if ≤2 chars, else `text-2xl`)
- Detail: `text-xs text-[var(--muted-2)]`

**Secondary** — smaller, no card surface:

- Container: `p-3 rounded-lg border border-[var(--accent)]/30`
- Value: `text-base font-semibold text-[var(--accent)]/80`

### Icon badge

Used in Education and Community sections — circular container for a decorative icon:

```
w-9 h-9 (or w-10 h-10) rounded-lg
bg-[var(--accent-glow)] flex items-center justify-center shrink-0
text-[var(--accent)]
```

Icon inside is always decorative — `aria-hidden="true"` required.

### Status pill ("Current")

Live indicator on experience cards:

```tsx
<span
  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
  bg-[var(--accent-glow)] border border-[var(--accent)]/30
  text-xs font-medium text-[var(--accent)]"
>
  <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
  Current
</span>
```

### Tabs (pill group)

Used in Projects section to switch between content categories:

```tsx
<div
  role="tablist"
  className="flex gap-1 p-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] w-fit"
>
  <button
    role="tab"
    aria-selected={active}
    className="px-4 py-1.5 min-h-[48px] rounded-md text-sm font-medium transition-all duration-150
    /* active:   */ bg-[var(--accent)] text-[var(--bg)]
    /* inactive: */ text-[var(--muted)] hover:text-[var(--text)]"
  >
    Label
  </button>
</div>
```

Requires `role="tablist"` on container, `role="tab"` + `aria-selected` on each button.

---

## Icons

Library: `react-icons` only. No inline SVGs.

| Set        | Package           | Use case                                                                      |
| ---------- | ----------------- | ----------------------------------------------------------------------------- |
| Feather    | `react-icons/fi`  | UI actions: mail, download, map pin, clock, menu, X, sun, moon, arrow-up      |
| FA6 Brands | `react-icons/fa6` | Social platform logos: LinkedIn, GitHub, X/Twitter, StackOverflow, SlideShare |

Icon sizes by context: social links `18`, ScrollToTop FAB `18`, nav/toggle `16`, meta inline `11`, card action links `14`, expand/collapse chevrons `12`.

All decorative icons carry `aria-hidden="true"`.

---

## Colour Utilities (`src/lib/colors.ts`)

Two pure functions map entity names to accent hex values for dynamic colouring (e.g. experience timeline, project domain chips).

**`getCompanyColor(company: string): string`**

| Company          | Colour    |
| ---------------- | --------- |
| CES IT           | `#6366f1` |
| Vofox Solutions  | `#22d3ee` |
| Essel Swolutions | `#f59e0b` |
| fallback         | `#6366f1` |

**`getDomainColor(domain: string): string`** — prefix-match, order matters:

| Domain prefix                       | Colour    |
| ----------------------------------- | --------- |
| Education                           | `#6366f1` |
| Precision Agriculture / Agriculture | `#22c55e` |
| Freight / Logistics                 | `#fbbf24` |
| Hospitality                         | `#ec4899` |
| Open Source / Mobile                | `#22d3ee` |
| Open Source / Developer Tooling     | `#8b5cf6` |
| Open Source / Cloud                 | `#fb923c` |
| Open Source (generic)               | `#22d3ee` |
| fallback                            | `#6366f1` |

**Inline style exception:** dynamic entity colours (domain label text, company name text) are applied via `style={{ color: domainColor }}` / `style={{ color: companyColor }}` because CSS tokens cannot express per-entity dynamic values. This is the only sanctioned use of inline styles for colour. Project card borders use `var(--accent)` uniformly — domain colour applies to the label text only.

---

## Animation

### Scroll-driven reveal

Progressive enhancement (~88% browser support). Elements with `.scroll-animate` fade up when entering viewport.

```css
@keyframes scroll-fade-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .scroll-animate {
      animation: scroll-fade-up linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }
  }
}
```

### Transition defaults

| Target                                                   | Duration | Easing                                  |
| -------------------------------------------------------- | -------- | --------------------------------------- |
| Card border/shadow                                       | `0.2s`   | `ease`                                  |
| Card lift                                                | `200ms`  | `ease`                                  |
| Nav link colour                                          | `150ms`  | —                                       |
| Social/icon links                                        | `200ms`  | —                                       |
| Button opacity                                           | —        | `transition-opacity` (Tailwind default) |
| Button colour                                            | —        | `transition-colors` (Tailwind default)  |
| `.card-details` content opacity+translate                | `0.22s`  | `cubic-bezier(0, 0, 0.2, 1)`            |
| `.card-details` content height (progressive enhancement) | `0.3s`   | `cubic-bezier(0.4, 0, 0.2, 1)`          |
| Tab panel fade-in                                        | `0.2s`   | `cubic-bezier(0, 0, 0.2, 1)`            |

### Reduced motion

All animations and transitions disabled via:

```css
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

---

## Accessibility

| Pattern          | Implementation                                                                    |
| ---------------- | --------------------------------------------------------------------------------- |
| Skip link        | `sr-only focus:not-sr-only` to `#main-content`, accent background on focus        |
| Focus ring       | `outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px`       |
| Touch targets    | `.touch-target` / inline: `min-w-[48px] min-h-[48px]` on all interactive elements |
| Mobile nav trap  | Keyboard trap + Escape to close + focus return to toggle                          |
| Active nav       | `aria-current="page"` on active link                                              |
| Decorative icons | `aria-hidden="true"` on all icon elements                                         |
| Image alt text   | Descriptive: `"Profile photo of {name}"`                                          |
| Selection colour | `background: var(--accent); color: var(--bg)`                                     |

---

## Scrollbar

```css
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg);
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--muted);
}
```

---

## Responsive Breakpoints

Tailwind 4 default scale (no custom config):

| Prefix | Min-width |
| ------ | --------- |
| `sm:`  | 640px     |
| `md:`  | 768px     |
| `lg:`  | 1024px    |

Key responsive patterns:

- Hero grid: single col → `lg:grid-cols-[3fr_2fr]`
- Avatar: hidden below `lg`
- Nav: hamburger below `md`
- Email / secondary CTA: hidden below `sm`
- Metrics: `grid-cols-2 md:grid-cols-4`
