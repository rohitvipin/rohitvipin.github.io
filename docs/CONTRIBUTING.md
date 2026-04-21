# Contributing Guidelines

How to contribute code to the project. Start with [GETTING_STARTED.md](GETTING_STARTED.md) if you're new.

## GitHub Workflow

### Branching

- Feature branches: `feature/short-description`
- Bug fixes: `fix/issue-slug`
- Example: `feature/dark-mode-toggle`, `fix/hero-alignment`

### Commits

Use present tense, semantic messages:

```
✓ Add theme toggle component
✓ Fix color contrast in hero section
✓ Update resume generation script

✗ Added stuff
✗ WIP
✗ fix bugs
```

### PR Process

1. **Branch → Push** to GitHub
2. **Run locally first:**
   ```bash
   npm run lint         # ESLint + Prettier + data validation
   npm run test         # Vitest
   npm run build        # Check build succeeds
   ```
3. **Open PR** with descriptive title + related issues
4. **Wait for review** (see [CODE_REVIEW.md](CODE_REVIEW.md))
5. **Address feedback** or merge to main
6. **Auto-deploy** → GitHub Pages

## Development Practices

### Content Changes

**Only edit `data/*.json` — never hardcode text into components.**

- New JSON fields require **matching updates** in `src/types/index.ts` and `src/lib/schemas.ts` (same commit)
- Run `npm run lint:data` to validate before commit
- Follow writing standards (see [DATA_STRATEGY.md](DATA_STRATEGY.md))

### Component Development

- **Prefer server components** (default). Add `"use client"` only for hooks/browser APIs
- **Icons:** Use `react-icons` (FA6 brands or Feather UI) only
- **Colors:** Always use CSS custom properties (`var(--accent)`, `var(--surface)`, etc.) — no hardcoded hex/rgb
- **Layout:** Tailwind for structure, custom CSS for polish
- **Props:** Fully typed. No `any`. Use discriminated unions for conditionals
- **Naming:** PascalCase components (e.g., `ExperienceCard.tsx`), camelCase utilities

### Testing

- Write tests for utilities, data loaders, and component logic
- Use Vitest + React Testing Library
- Minimum coverage: **60%** overall; **100%** for `src/lib/` utilities
- Run `npm run test:coverage` to check coverage

See [DEVELOPMENT.md](DEVELOPMENT.md) for examples.

### Code Review

Before submitting a PR, check [CODE_REVIEW.md](CODE_REVIEW.md):

- Architecture compliance
- Type safety (strict TypeScript)
- Tests written
- No hardcoded content
- ESLint + Prettier pass
- Data lint passes (`npm run lint:data`)
- Build succeeds

## Local Setup

See [GETTING_STARTED.md](GETTING_STARTED.md) for setup steps.

## CI/CD Pipeline

**`ci.yml`** — triggers on PRs:

1. **Lint** — Prettier + ESLint
2. **Test** — Vitest
3. **Build** — Next.js static export

**`deploy.yml`** — triggers on push to `main`:

1. **Lint** — Prettier + ESLint + data validation
2. **Test** — Vitest
3. **Generate resume** — PDF written to `public/`
4. **Build** — Next.js static export
5. **Deploy** — auto-push to `gh-pages` branch

Pipeline fails if any step fails.

## Pre-Commit Hooks

Commits are automatically validated via husky + lint-staged:

- ESLint + Prettier on `.ts`, `.tsx`, `.js`, `.jsx`
- Prettier on `.json`, `.css`, `.md`
- Data lint on `data/*.json`

If commit fails, fix the issue then retry.

---

**Questions?**

- [DEVELOPMENT.md](DEVELOPMENT.md) — Commands and how-tos
- [CODE_REVIEW.md](CODE_REVIEW.md) — Review standards
- [INDEX.md](INDEX.md) — Complete documentation index
- [../CLAUDE.md](../CLAUDE.md) — AI agent guidance
