# Architecture Reference

Complete technical reference for the portfolio site architecture. For project overview and repo structure, see [README.md](../README.md) and [CLAUDE.md](../CLAUDE.md).

## Key Architecture Decisions

### 1. Headless CMS Pattern

**Decision:** Store all content in JSON files. UI imports and renders from structured data.

**Why:** Enables easy content updates without touching code. Separation of concerns. Type safety.

**How:**

- JSON files in `data/*.json` are the source of truth
- `src/lib/data.ts` exports typed loaders
- Components import via loaders, never from JSON directly

### 2. Type Safety (Strict TypeScript)

**Decision:** No `any` types. All values fully typed. JSON schemas mirror TypeScript interfaces.

**Why:** Catches bugs at build time. Better IDE support. Self-documenting code.

**How:**

- `src/types/index.ts` defines interfaces for each JSON schema
- TypeScript strict mode enabled in `tsconfig.json`
- Build fails if types don't match

### 3. Server Components by Default

**Decision:** Use React server components. Add `"use client"` only when necessary (hooks, browser APIs).

**Why:** Smaller client bundle. Better performance. Simpler data loading.

**When to add `"use client"`:**

- Using `useState`, `useEffect`, `useContext`, etc.
- Accessing `localStorage`, `window`, browser APIs
- Interactive features (theme toggle, scroll effects)

### 4. Static Export (No Node.js Runtime)

**Decision:** Build-time only. Deploy static HTML to GitHub Pages.

**Why:** Cost-free hosting. Fast delivery. Simple deployment.

**Constraint:** All data must exist at build time. No dynamic API calls.

### 5. Styling: CSS Custom Properties + Tailwind

**Decision:** Theme colors via CSS custom properties. Layout via Tailwind. Polish via custom CSS.

**Why:** Theme-aware components. Easy dark mode. Full design control.

**Pattern:** Dark is the default (`:root`), light overrides via `[data-theme="light"]`:

```css
:root {
  --bg: #0a0a0f;
  --accent: #6366f1;
}

[data-theme="light"] {
  --bg: #f5f5f4;
  --accent: #4f46e5;
}
```

Components use `var(--accent)`, `var(--bg)` etc. in Tailwind classes or inline styles.

### 6. Icons: react-icons Only

**Decision:** Use `react-icons` (Font Awesome 6 brands + Feather UI). No inline SVGs.

**Why:** Consistent icon library. Smaller bundle. Easy to swap.

```typescript
import { FaGithub } from "react-icons/fa6";
import { ExternalLink } from "react-icons/fi";
```

## Build & Deploy

**Trigger:** Push to `main`  
**Pipeline:** ESLint → Prettier → Tests → Build → Deploy  
**Target:** `gh-pages` branch  
**Host:** GitHub Pages

Build output: static HTML/CSS/JS in `out/` folder.

Environment variable `NEXT_PUBLIC_BASE_PATH` controls the URL prefix. Currently set to `""` (root domain).

## Data Schema

See [DATA_STRATEGY.md](DATA_STRATEGY.md) for how to update content.

| File              | Structure     | Purpose                                        |
| ----------------- | ------------- | ---------------------------------------------- |
| `profile.json`    | Single object | Basic info, bio, contact, `knows_about` topics |
| `socials.json`    | Array         | Social links                                   |
| `skills.json`     | Array         | Skills grouped by category                     |
| `experience.json` | Array         | Work history (reverse-chron)                   |
| `education.json`  | Array         | Degrees + institutions                         |
| `projects.json`   | Array         | Portfolio projects                             |
| `awards.json`     | Array         | Awards + recognition                           |
| `community.json`  | Array         | Open source + speaking                         |
| `leadership.json` | Array         | Leadership + mentoring                         |

## Lib Utilities (`src/lib/`)

| File          | Purpose                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `data.ts`     | Typed constants for every JSON file; parsed via Zod at import time              |
| `colors.ts`   | `getCompanyColor()` / `getDomainColor()` — pure functions for dynamic colouring |
| `schemas.ts`  | Zod schemas for all data types; shared by `lint-data.ts` and tests              |
| `jsonld.ts`   | `buildPersonJsonLd()` — builds JSON-LD `Person` block from profile + socials    |
| `duration.ts` | `parseStartYear()` — parses `duration` field for sort order                     |
| `escape.ts`   | HTML-escaping utilities used in JSON-LD output                                  |
| `paths.ts`    | `resumeHref`, `avatarHref` etc. — `NEXT_PUBLIC_BASE_PATH`-aware asset URLs      |
| `profile.ts`  | `getInitials()` and other profile helper functions                              |
| `projects.ts` | `isOssProject()` and project classification helpers                             |

## Component Hierarchy

```
App (layout)
├── Nav (navigation)
├── Hero (bio + intro)
├── About (detailed bio)
├── Experience (timeline)
├── Projects (portfolio)
├── Skills (categorized)
├── Education
├── Awards
├── Community (speaking, open source)
├── SocialLinks (footer)
└── ThemeToggle (dark mode)
```

## Testing Strategy

See [DEVELOPMENT.md](DEVELOPMENT.md#testing) for test patterns and coverage goals.

## Performance Optimizations

- Static export (no server processing)
- Tailwind CSS purging (remove unused styles)
- Image optimization via Next.js
- Code splitting for components
- No external tracking or analytics

## Type System

All JSON schemas have matching TypeScript interfaces:

```typescript
// data/skills.json
[{ id: "ts", name: "TypeScript", category: "Languages" }];

// src/types/index.ts
export interface Skill {
  id: string;
  name: string;
  category: string;
}

// src/lib/data.ts
export function getSkills(): Skill[] {
  return skillsData as Skill[];
}
```

Changes to JSON structure must update types **in same commit**.

---

**See also:**

- [DATA_STRATEGY.md](DATA_STRATEGY.md) — How to update content
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Development workflow
- [CLAUDE.md](../CLAUDE.md) — Complete reference for AI agents
