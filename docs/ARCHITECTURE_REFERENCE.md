# Architecture Reference

Complete technical reference for the portfolio site architecture. For project overview and repo structure, see [README.md](../README.md) and [CLAUDE.md](../CLAUDE.md).

## Key Architecture Decisions

### 1. Headless CMS Pattern

**Decision:** Store all content in JSON files. UI imports and renders from structured data.

**Why:** Enables easy content updates without touching code. Separation of concerns. Type safety.

**How:**

- JSON files in `data/*.json` are the source of truth
- `src/lib/data.ts` exports typed constants
- Components import via constants, never from JSON directly

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
**Pipeline:** Audit → Prettier → ESLint → Tests → Prepare assets → Build → Deploy → Smoke-test  
**Deploy:** GitHub Pages artifact API (`actions/upload-pages-artifact` + `actions/deploy-pages`)  
**Host:** GitHub Pages

Build output: static HTML/CSS/JS in `out/` folder.

Environment variable `NEXT_PUBLIC_BASE_PATH` controls the URL prefix. Currently set to `""` (root domain).

## Data Schema

See [DATA_STRATEGY.md](DATA_STRATEGY.md) for how to update content.

| File                 | Structure     | Purpose                                          |
| -------------------- | ------------- | ------------------------------------------------ |
| `profile.json`       | Single object | Basic info, bio, contact, `knows_about` topics   |
| `socials.json`       | Array         | Social links                                     |
| `skills.json`        | Array         | Skills grouped by category                       |
| `experience.json`    | Array         | Work history (reverse-chron)                     |
| `education.json`     | Array         | Degrees + institutions                           |
| `projects.json`      | Array         | Portfolio projects                               |
| `awards.json`        | Array         | Awards + recognition                             |
| `community.json`     | Array         | Open source + speaking                           |
| `leadership.json`    | Single object | Leadership title + subsections                   |
| `impact.json`        | Array         | Impact stories — web only, not in resume PDF     |
| `nav.json`           | Array         | Navigation links                                 |
| `resume-config.json` | Single object | PDF resume layout config (not loaded by data.ts) |

## Lib Utilities (`src/lib/`)

| File          | Purpose                                                                                 |
| ------------- | --------------------------------------------------------------------------------------- |
| `data.ts`     | Typed constants for every JSON file; parsed via Zod at import time                      |
| `schemas.ts`  | Zod schemas for all data types; shared by `lint-data.ts` and tests                      |
| `jsonld.ts`   | `buildPersonJsonLd()` — builds JSON-LD `Person` block from profile + socials            |
| `duration.ts` | `parseStartYear()`, `byStartYearDesc()` — parse and sort by `duration` field            |
| `escape.ts`   | `escapeForJsonLdScript()` — JSON-LD `<script>` string escaping; not for HTML attributes |
| `paths.ts`    | `resumeHref`, `avatarHref`, `avatarWebpHref` — `NEXT_PUBLIC_BASE_PATH`-aware asset URLs |
| `profile.ts`  | `getInitials()` — derives two-letter initials from a full name                          |
| `projects.ts` | `isOssProject()`, `partitionProjects()` — classify and split OSS vs client              |

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
├── Leadership
├── Impact (impact stories — web only)
├── SocialLinks (footer)
├── ThemeToggle (dark mode)
└── ScrollToTop (back-to-top FAB)
```

## Testing Strategy

See [DEVELOPMENT.md](DEVELOPMENT.md#testing) for test patterns and coverage goals.

## Performance Optimizations

- Static export (no server processing)
- Tailwind CSS purging (remove unused styles)
- Image optimization disabled (`images: { unoptimized: true }`) — required for static export
- Code splitting for components
- No external tracking or analytics

## Type System

All JSON schemas have matching TypeScript interfaces:

```typescript
// data/skills.json
[{ category: "Frontend", skills: ["TypeScript", "React"] }];

// src/types/index.ts
export interface SkillCategory {
  category: string;
  skills: string[];
}

// src/lib/data.ts
export const skills: SkillCategory[] = SkillCategorySchema.array().parse(skillsData);
```

Changes to JSON structure must update types **in same commit**.

---

**See also:**

- [DATA_STRATEGY.md](DATA_STRATEGY.md) — How to update content
- [CONTRIBUTING.md](CONTRIBUTING.md) — Development workflow
- [CLAUDE.md](../CLAUDE.md) — Complete reference for AI agents
