# Contributing Guidelines

How to contribute code to the project. Start with [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) if you're new.

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
4. **Wait for review** (see [docs/CODE_REVIEW.md](docs/CODE_REVIEW.md))
5. **Address feedback** or merge to main
6. **Auto-deploy** → GitHub Pages

## Development Practices

### Content Changes

**Only edit `data/*.json` — never hardcode text into components.**

- New JSON fields require **matching TypeScript updates** in `src/types/index.ts`
- Run `npm run lint:data` to validate before commit
- Follow writing standards (see [docs/DATA_STRATEGY.md](docs/DATA_STRATEGY.md))

### Component Development

- **Prefer server components** (default). Add `"use client"` only for hooks/browser APIs
- **Icons:** Use `react-icons` (FA6 brands or Feather UI) only
- **Colors:** Always use CSS custom properties (`var(--accent)`, etc.) — no hardcoded hex/rgb
- **Layout:** Tailwind for structure, custom CSS for polish
- **Props:** Fully typed. No `any`. Use discriminated unions for conditionals
- **Naming:** PascalCase components (e.g., `ExperienceCard.tsx`), snake_case utilities

### Testing

- Write tests for utilities, data loaders, and component logic
- Use Vitest + React Testing Library
- Minimum coverage: **60%** for new code
- Run `npm run test:coverage` to check coverage

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md#working-with-components) for examples.

### Code Review

Before submitting a PR, check [docs/CODE_REVIEW.md](docs/CODE_REVIEW.md):

- Architecture compliance
- Type safety (strict TypeScript)
- Tests written
- No hardcoded content
- ESLint + Prettier pass
- Data lint passes
- Build succeeds

## Local Setup

See [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) for setup steps.

## CI/CD Pipeline

Every push to `main` triggers:

1. **Lint** — ESLint + Prettier + data validation
2. **Test** — Vitest (unit + integration)
3. **Build** — Next.js static export
4. **Deploy** — Auto-push to `gh-pages` branch

Pipeline fails if any step fails (prevents broken code reaching production).

## Pre-Commit Hooks

Commits are automatically validated via husky + lint-staged:

- ESLint + Prettier on `.ts`, `.tsx`, `.js`, `.jsx`
- Prettier on `.json`, `.css`, `.md`
- Data lint on `data/*.json`

If commit fails, fix issues then try again.

---

**Questions?**

- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) — Commands and how-tos
- [docs/CODE_REVIEW.md](docs/CODE_REVIEW.md) — Review standards
- [docs/INDEX.md](docs/INDEX.md) — Complete documentation
- [CLAUDE.md](CLAUDE.md) — AI agent guidance
