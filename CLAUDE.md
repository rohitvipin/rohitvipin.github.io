# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Type

Personal portfolio site for **Rohit Vipin Mathews** — Next.js 16 static export deployed to GitHub Pages. Data lives in `data/*.json` (headless CMS pattern). UI is in `src/`.

## Layout

- `data/` — Canonical JSON content. Source of truth. Never hardcode content into UI.
  - `profile.json`, `socials.json`, `skills.json`, `experience.json`, `education.json`, `projects.json`, `awards.json`, `community.json`
- `src/` — Next.js App Router UI
  - `src/types/index.ts` — TypeScript interfaces for all JSON schemas
  - `src/lib/data.ts` — typed JSON importers (build-time only, no fetch)
  - `src/app/` — layout, page, globals.css
  - `src/components/` — section and shared components
- `utils/` — One-off dev scripts (TypeScript, run via `tsx`)
  - `generate-favicons.ts` — Generates full favicon + OG image suite via `sharp`; run with `npm run generate-favicons`
- `docs/` — Architecture and content-strategy specs
- `public/` — Static assets (resume PDF, robots.txt, sitemap.xml, og-image)
- `.github/workflows/deploy.yml` — GitHub Actions: build → deploy to gh-pages

## Build & Dev Commands

```bash
npm run dev       # local dev server (http://localhost:3000)
npm run build     # production static export → out/
npm run preview   # build + serve out/ locally
npm run lint      # ESLint
```

## Deployment

Push to `main` → GitHub Actions builds with `NEXT_PUBLIC_BASE_PATH=/rohit-profile` → deploys `out/` to `gh-pages` branch.
Live URL: https://rohitvipin.github.io/rohit-profile

Custom domain: set `NEXT_PUBLIC_BASE_PATH=""` in workflow env.

## Content Writing Standards

- **No special Unicode punctuation** in `data/*.json`. Use plain ASCII only: `-` not `–` or `—`, `...` not `…`, `"` not `"` or `"`. Em dashes and en dashes are AI tells — replace with `-` or rewrite the sentence.
- **No hollow intensifiers**: proactive, exceptional, cutting-edge, world-class, robust, seamlessly, innovative.
- **No corporate idioms**: end-to-end, time-to-value, delivery velocity, at org scale, organizational maturity.
- **British English**: -ise not -ize, -isation not -ization, -our not -or, organised not organized. Exception: proper nouns, product names, certification names.

## Working Conventions

- **Content in `data/*.json` only.** No hardcoded strings in UI.
- **Schema drift** — adding JSON fields requires updating `src/types/index.ts` in the same change.
- **`"use client"` only** on components using hooks/browser APIs. Everything else is a server component.
- **react-icons** for all icons (FA6 brands + Feather UI icons).
- **CSS custom properties** (`var(--accent)` etc.) for all theming — no hardcoded colors in components.
