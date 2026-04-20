# Architecture Reference

Complete technical reference for the portfolio site architecture.

## Project Overview

**Rohit Vipin Mathews** — Personal portfolio. Next.js 16 static export deployed to GitHub Pages.

- **Live:** https://rohitvipin.github.io/rohit-profile
- **Repo:** https://github.com/rohitvipin/rohit-profile
- **Stack:** Next.js 16, React 19, TypeScript 5, Tailwind, Vitest

## Repository Structure

- **`data/`** — JSON content (single source of truth)
  - `profile.json`, `socials.json`, `skills.json`, `experience.json`, `education.json`, `projects.json`, `awards.json`, `community.json`
- **`src/`** — React components + styling
  - `app/` — Layout, pages, global CSS
  - `components/` — Section components (organized by feature)
  - `lib/` — Data loaders + utilities
  - `types/` — TypeScript interfaces
  - `__tests__/` — Tests (Vitest)
- **`utils/`** — Build scripts (TypeScript)
  - `generate-favicons.ts` — Favicon suite
  - `generate-resume.ts` — PDF generation
  - `lint-data.ts` — JSON validation
- **`public/`** — Static assets
- **`docs/`** — Documentation
- **`.github/workflows/`** — CI/CD

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

**Pattern:**

```css
:root {
  --accent: #0066cc;
  --bg-primary: #ffffff;
}

[data-theme="dark"] {
  --accent: #66b3ff;
  --bg-primary: #1a1a1a;
}
```

Components use `var(--accent)` in styles.

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

Environment variable `NEXT_PUBLIC_BASE_PATH` controls:

- `""` — Custom domain (root)
- `"/rohit-profile"` — GitHub Pages subpath

## Data Schema

See [DATA_STRATEGY.md](DATA_STRATEGY.md) for how to update content.

| File              | Structure     | Purpose                      |
| ----------------- | ------------- | ---------------------------- |
| `profile.json`    | Single object | Basic info, bio, contact     |
| `socials.json`    | Array         | Social links                 |
| `skills.json`     | Array         | Skills grouped by category   |
| `experience.json` | Array         | Work history (reverse-chron) |
| `education.json`  | Array         | Degrees + institutions       |
| `projects.json`   | Array         | Portfolio projects           |
| `awards.json`     | Array         | Awards + recognition         |
| `community.json`  | Array         | Open source + speaking       |

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

- **Utilities:** 100% unit test coverage
- **Components:** Main paths tested
- **Overall:** 60% minimum coverage
- **Framework:** Vitest + React Testing Library
- **Pattern:** Semantic assertions ("what" not "how")

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
