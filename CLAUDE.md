# CLAUDE.md

This file provides guidance to AI agents (Claude/Copilot) when working with code in this repository.

## Project Overview

**Rohit Vipin Mathews** — Personal portfolio site. Next.js 16 static export deployed to GitHub Pages. Data-driven (JSON headless CMS pattern). UI pulls all content from JSON files — never hardcoded.

- **Live:** https://rohitvipin.github.io/
- **Repo:** https://github.com/rohitvipin/rohitvipin.github.io
- **Stack:** Next.js 16, React 19, TypeScript, Tailwind, Vitest

## Repository Structure

- **`data/`** — Canonical JSON content (source of truth)
  - `profile.json`, `socials.json`, `skills.json`, `experience.json`, `education.json`, `projects.json`, `awards.json`, `community.json`, `leadership.json`
- **`src/`** — Next.js App Router + React components
  - `app/` — Layout, pages, global styles
  - `components/` — Section and shared components (organized by feature)
  - `lib/` — Typed data loaders (`data.ts`), utilities (`colors.ts`, `projects.ts`)
  - `types/` — TypeScript interfaces (auto-sync with JSON schemas in `data/*.json`)
  - `__tests__/` — Unit + integration tests (Vitest)
- **`utils/`** — Dev scripts (run via `tsx`)
  - `generate-favicons.ts` — Favicon + OG image generation
  - `generate-resume.ts` — PDF resume generation
  - `lint-data.ts`, `lint-data-core.ts` — JSON schema validation
- **`public/`** — Static assets (robots.txt, sitemap.xml, og-image, favicon)
- **`docs/`** — Architecture + content strategy specifications
- **`.github/workflows/deploy.yml`** — CI/CD pipeline: lint → test → build → deploy

## Build & Dev Commands

```bash
npm run dev              # Local dev server (http://localhost:3000)
npm run build            # Production static export → out/
npm run preview          # Build + serve out/ locally
npm run lint             # ESLint + Prettier + data validation
npm run lint:fix         # Auto-fix lint issues
npm run test             # Run Vitest (unit + integration tests)
npm run test:coverage    # Coverage report
npm run generate-favicons # Rebuild favicon suite
npm run generate-resume  # Generate PDF resume
npm run lint:data        # Validate JSON schemas only
```

## Architecture Principles

### 1. Headless CMS Pattern

- **Source of truth:** `data/*.json` files only.
- **Never hardcode content** into components, styles, or templates.
- **UI components** are data-driven — import data via typed loaders in `src/lib/data.ts`.
- **Schema changes:** New JSON fields require matching updates to `src/types/index.ts` in same commit.

### 2. Type Safety

- **Strict TypeScript** — no `any` types (use generics or discriminated unions instead).
- **All JSON schemas** mirror TypeScript interfaces in `src/types/index.ts`.
- **Build-time data loading** — no fetch() calls in client code. Data imported at build time via Next.js SSG.
- **Discriminated unions** for conditional props (not booleans).

### 3. Component Architecture

- **Server components by default** — Add `"use client"` only for hooks/browser APIs.
- **Semantic naming** — PascalCase for components, snake_case for utilities.
- **Props interfaces** — Always defined and exported, even for internal components.
- **No prop drilling** — Use context for deep nesting (beyond 1 level).

### 4. Styling & Theming

- **CSS custom properties** — All colors use `var(--accent)`, `var(--bg-primary)`, etc. No hardcoded hex/rgb.
- **Define tokens** in `src/app/globals.css` with dark/light mode variants.
- **Tailwind for structure** — Layout, spacing, utilities. Custom CSS for theme polish.
- **Icons** — `react-icons` only (FA6 brands or Feather UI). No inline SVGs or custom icon components.

### 5. Testing

- **Vitest** for all tests (fast, ESM-native).
- **Minimum coverage:** 60% overall, 100% for new utilities.
- **New components:** Test main paths. New utilities: comprehensive coverage.
- **Semantic assertions** — Test **what** not **how**.

### 6. Static Export

- **No Node.js runtime** — Static export to GitHub Pages.
- **No Node.js imports** in client code (no `fs`, `path`, etc.).
- **All dynamic data** must exist at build time (embedded in JSON files).

## Path-Specific Rules

### `data/` — JSON Content Files

**Rules:**

- ✓ Array of objects only (or top-level object for singleton like `profile.json`).
- ✓ All strings use **plain ASCII punctuation** only:
  - No smart quotes (`"` → `"`), no em/en dashes (`–`/`—` → `-`), no ellipsis (`…` → `...`)
- ✓ **British English:** -ise not -ize, -our not -or, organised not organized. Exception: proper nouns, product names.
- ✓ **No corporate jargon:** "world-class", "exceptional", "cutting-edge", "seamlessly", "end-to-end", "innovative", "robust", "proactive" are AI tells — rewrite.
- ✓ Required fields must be present in all records.
- ✓ IDs and slugs must be unique across the entire dataset.
- ✓ Validate before commit: `npm run lint:data`

**Example:**

```json
{
  "id": "unique-slug",
  "title": "Item Title",
  "description": "Concise description without AI tells.",
  "date": "2024-04-21"
}
```

### `src/types/` — TypeScript Interfaces

**Rules:**

- ✓ Interface name matches JSON file name (e.g., `Skill` for `skills.json`).
- ✓ **Always update when `data/*.json` changes** (same commit).
- ✓ All JSON fields represented (required or `?` optional).
- ✓ Use strict types (no `any`, no `Record<string, unknown>` without good reason).
- ✓ Export all types used by components.

**Example:**

```typescript
export interface Skill {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Tools";
  proficiency?: number;
}
```

### `src/lib/` — Data Loaders & Utilities

**Rules:**

- ✓ `data.ts` imports all JSON files and exports typed getters.
- ✓ **Build-time only** — no dynamic imports, no fetch().
- ✓ Functions fully typed (no `any`, explicit return types).
- ✓ Utilities (colors.ts, projects.ts) are **pure functions** or constants.
- ✓ Tests required for all utilities (100% coverage).

**Example:**

```typescript
import skillsData from "../../data/skills.json";
import type { Skill } from "@/types";

export function getSkills(): Skill[] {
  return skillsData as Skill[];
}
```

### `src/components/` — React Components

**Rules:**

- ✓ **Server components by default** (no `"use client"` unless necessary).
- ✓ Add `"use client"` only for: hooks (useState, useEffect, etc.), browser APIs (localStorage, window), or interactive features (ThemeToggle, ScrollToTop).
- ✓ Props interface always defined and exported.
- ✓ **No hardcoded strings** — use typed data loaders.
- ✓ **CSS custom properties only** — never hardcode colors.
- ✓ **Icons from react-icons** — no inline SVGs.
- ✓ Semantic HTML (button, link, nav, section, etc.).
- ✓ Discriminated unions for conditional rendering (avoid boolean props).

**Example:**

```typescript
'use client'; // Only if needed (e.g., useEffect)

import { ComponentProps } from 'react';
import { FaGithub } from 'react-icons/fa6';

interface HeroProps {
  title: string;
  subtitle?: string;
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="py-20">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-lg mt-2">{subtitle}</p>}
      <FaGithub className="w-6 h-6" />
    </section>
  );
}
```

### `src/__tests__/` — Tests

**Rules:**

- ✓ File matches source file name (e.g., `colors.test.ts` for `colors.ts`).
- ✓ Use Vitest + React Testing Library.
- ✓ Semantic test names (describe "what", not "how").
- ✓ Tests must pass locally before commit (`npm run test`).
- ✓ **Coverage goals:** 100% for utilities, main paths for components, 60% overall.
- ✓ Mock external data (don't fetch real files/APIs).

**Example:**

```typescript
import { describe, it, expect } from "vitest";
import { formatDate } from "@/lib/colors";

describe("formatDate", () => {
  it("should format ISO date to readable format", () => {
    expect(formatDate("2024-04-21")).toBe("21 Apr 2024");
  });
});
```

### `utils/` — Dev Scripts

**Rules:**

- ✓ Run via `tsx utils/script-name.ts` (not Node.js directly).
- ✓ One-off scripts, not library code.
- ✓ Exit with status 1 on error.
- ✓ Output to stdout/stderr, not files (unless intentional).

### `.github/workflows/` — CI/CD

**Rules:**

- ✓ Every push to `main` triggers: lint → test → build → deploy.
- ✓ Pipeline fails if any step fails (prevents broken code in production).
- ✓ Node version locked to 20.x.
- ✓ Environment variables set in workflow file or GitHub Secrets.

## Documentation & Review

- **README.md** — Project overview, quick start, architecture decisions.
- **CONTRIBUTING.md** — Workflow, branching, PR process, development practices.
- **CODE_REVIEW.md** — Review checklist, standards, examples of ✓ and ✗ code.
- **DEVELOPMENT.md** — Detailed dev guide, commands, troubleshooting, profiling.
- **CLAUDE.md** — This file. AI agent guidance.

**Before implementing any change:**

1. Read [CODE_REVIEW.md](docs/CODE_REVIEW.md) to understand review standards.
2. Ensure TypeScript types sync with JSON schemas.
3. Validate data: `npm run lint:data`.
4. Run tests: `npm run test`.
5. Check build: `npm run build`.

## Deployment

**Trigger:** Push to `main` branch.
**Pipeline:** GitHub Actions lint → test → build → deploy to `gh-pages`.
**Live URL:** https://rohitvipin.github.io/

**Environment variables:**

- `NEXT_PUBLIC_BASE_PATH` — URL prefix. Currently `""` (root domain).

## Content Writing Standards

**Always apply these rules in `data/*.json` and component text:**

| Rule                   | Examples                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| ASCII punctuation only | `-` not `–/—`, `...` not `…`, `"` not `"/"`                                                             |
| British English        | -ise, -our, organised (not -ize, -or, organized)                                                        |
| No corporate speak     | Remove: "end-to-end", "time-to-value", "delivery velocity", "at org scale", "organizational maturity"   |
| No AI jargon           | Remove: "world-class", "exceptional", "cutting-edge", "innovative", "robust", "seamlessly", "proactive" |
| Proper nouns/products  | AWS, Google Cloud, ASP.NET, C# (case-sensitive)                                                         |

## Quick Reference: Adding a Feature

1. **Add JSON** to `data/feature.json` → validate with `npm run lint:data`.
2. **Define type** in `src/types/index.ts`.
3. **Create loader** in `src/lib/data.ts`.
4. **Build component** in `src/components/feature/`.
5. **Add tests** in `src/__tests__/`.
6. **Check build** with `npm run build`.
7. **Push PR** — CI validates lint, tests, and build pass.

## Support & References

- [README.md](README.md) — Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) — GitHub workflow + development practices
- [CODE_REVIEW.md](docs/CODE_REVIEW.md) — Code review checklist + standards
- [DEVELOPMENT.md](docs/DEVELOPMENT.md) — Detailed dev guide + troubleshooting
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
