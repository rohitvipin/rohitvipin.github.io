# Getting Started

Welcome to the project. This guide gets you from zero to running code in **5 minutes**.

## Setup

```bash
# Clone and install
git clone https://github.com/rohitvipin/rohitvipin.github.io.git
cd rohitvipin.github.io
npm install

# Verify everything works
npm run lint
npm run test
npm run dev
```

Open http://localhost:3000 to see the site.

## What is This?

A **Next.js 16 portfolio site** deployed to GitHub Pages. All content lives in JSON files (`data/`), never hardcoded. The UI is a data-driven React frontend.

**Key principles:**

- No hardcoded content (pull from `data/*.json`)
- Strict TypeScript (no `any`)
- Server components by default
- CSS custom properties for theming
- Static export to GitHub Pages

## First Task?

**→ [CONTRIBUTING.md](../CONTRIBUTING.md)** — How to branch, commit, and push code

## Need Commands?

**→ [docs/DEVELOPMENT.md](DEVELOPMENT.md)** — Full command reference and how-tos

## Want to Review Code?

**→ [docs/CODE_REVIEW.md](CODE_REVIEW.md)** — Standards and checklist

## Complete Reference

**→ [docs/INDEX.md](INDEX.md)** — Full documentation index

---

### Quick Command Reference

| What        | Command                 |
| ----------- | ----------------------- |
| Dev server  | `npm run dev`           |
| Build       | `npm run build`         |
| Tests       | `npm run test`          |
| Test (CI)   | `npm run test:ci`       |
| Coverage    | `npm run test:coverage` |
| Lint        | `npm run lint`          |
| Fix linting | `npm run lint:fix`      |

See [docs/DEVELOPMENT.md](DEVELOPMENT.md#project-commands) for complete list.
