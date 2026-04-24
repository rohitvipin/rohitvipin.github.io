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
   npm run format:check # Prettier
   npm run lint         # ESLint + data validation
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
- **Exports:** Named exports only — no `export default` on components
- **Collapsible content:** Use native `<details>/<summary>` with `.card-details` class — no custom toggle state
- **Icons:** Use `react-icons` (FA6 brands or Feather UI) only
- **Colors:** Always use CSS custom properties (`var(--accent)`, `var(--surface)`, etc.) — no hardcoded hex/rgb
- **Layout:** Tailwind for structure, custom CSS for polish
- **Props:** Fully typed. No `any`. Use discriminated unions for conditionals
- **Naming:** PascalCase components (e.g., `ExperienceCard.tsx`), camelCase utilities

### Testing

- Write tests for utilities, data loaders, and component logic
- Use Vitest + React Testing Library
- Minimum coverage: **90%** statements/functions/lines, **85%** branches; **100%** for `src/lib/` utilities
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

Requires Node.js **22.12.0** (matches CI). See [GETTING_STARTED.md](GETTING_STARTED.md) for setup steps.

## CI/CD Pipeline

**`ci.yml`** — triggers on PRs:

1. **Audit** — `npm audit --audit-level=high`
2. **Prettier** — `npm run format:check`
3. **ESLint + data validation** — `npm run lint`
4. **Test** — `npm run test:ci` (Vitest with coverage)
5. **Build** — Next.js static export

**`deploy.yml`** — triggers on push to `main`:

1. **Audit** — `npm audit --audit-level=high`
2. **Prettier** — `npm run format:check`
3. **ESLint + data validation** — `npm run lint`
4. **Test** — `npm run test:ci`
5. **Prepare assets** — composite action: fetch avatar, generate favicons, generate resume PDF
6. **Build** — Next.js static export
7. **Deploy** — GitHub Pages artifact upload + `actions/deploy-pages`
8. **Smoke-test** — verifies live site serves correct build SHA

**`qa.yml`** — triggers on PRs to `main`:

- Builds the site in CI then runs Playwright E2E tests (`npm run test:e2e`) against the local build

**`qa-live.yml`** — triggers after successful `deploy.yml`:

- Runs `/portfolio-qa` skill against the live site (`https://rohitvipin.github.io`)
- Uploads QA report artifact; fails deploy gate if CRITICAL/HIGH issues found

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
