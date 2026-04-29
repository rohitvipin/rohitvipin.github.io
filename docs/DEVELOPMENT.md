# Development Guide

Reference for local development, commands, and patterns.

See [GETTING_STARTED.md](GETTING_STARTED.md) if you're setting up for the first time.

## Project Commands

| Command                     | Purpose                                          |
| --------------------------- | ------------------------------------------------ |
| `npm run dev`               | Local dev server with HMR                        |
| `npm run build`             | Static export to `out/`                          |
| `npm run preview`           | Build + serve locally                            |
| `npm run lint`              | ESLint + data validation                         |
| `npm run lint:fix`          | Auto-fix ESLint issues                           |
| `npm run lint:data`         | Validate JSON schemas only (Zod)                 |
| `npm run format:check`      | Prettier format check (used in CI)               |
| `npm run format`            | Prettier auto-format write                       |
| `npm run test`              | Run Vitest (one-shot)                            |
| `npm run test:ci`           | Run Vitest with coverage + verbose CI reporter   |
| `npm run test:coverage`     | Coverage report                                  |
| `npm run test:e2e`          | Playwright end-to-end tests                      |
| `npm run generate-favicons` | Rebuild favicon suite                            |
| `npm run generate-resume`   | Generate resume PDF → `public/`                  |
| `npm run fetch-avatar`      | Fetch + pin GitHub avatar to `public/avatar.jpg` |

## Working with Data

### Adding a New Content Type

1. **Create JSON file:** `data/new-type.json`
2. **Define interface:** `src/types/index.ts` (new `NewType` interface)
3. **Export constant:** `src/lib/data.ts` — `parseOrThrow` is module-private; add the new const inside `data.ts` following the existing pattern: `export const newTypes: NewType[] = parseOrThrow(z.array(NewTypeSchema), newTypeData, "newTypes")`
4. **Validate:** `npm run lint:data`
5. **Commit:** All changes in single commit

See [DATA_STRATEGY.md](DATA_STRATEGY.md) for detailed patterns.

### Updating Existing Data

1. Edit JSON in `data/*.json`
2. Run `npm run lint:data` to validate
3. Commit
4. Component re-renders automatically (build-time imports)

**Always validate before pushing:**

```bash
npm run lint:data
```

## Working with Components

### Creating a New Component

**File:** `src/components/section-name/SectionName.tsx`

```typescript
interface SectionNameProps {
  title: string;
  items: Item[];
}

export function SectionName({ title, items }: SectionNameProps) {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="grid gap-4 mt-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
```

**Rules:**

- Export named component (not default)
- Props interface always defined and exported
- Use CSS custom properties for theming
- Server component by default (add `"use client"` if needed)
- No hardcoded content

### Using Data in Components

Always import typed constants from `src/lib/data`, never from JSON directly:

```typescript
// ✗ Don't
import skillsData from "../../data/skills.json";

// ✓ Do
import { skills } from "@/lib/data";

export function SkillsSection() {
  // skills is already typed as SkillCategory[]
  // ...
}
```

### Colors & Theming

Tokens are defined in `src/app/globals.css`. Dark is the default (`:root`), light overrides via `[data-theme="light"]`:

```css
:root {
  --bg: #0a0a0f;
  --text: #e2e8f0;
  --accent: #6366f1;
}

[data-theme="light"] {
  --bg: #f5f5f4;
  --text: #0f172a;
  --accent: #4f46e5;
}
```

Use in components via Tailwind or inline var():

```tsx
<div className="bg-[var(--surface)] text-[var(--text)]">
  <h1 className="text-[var(--accent)]">Title</h1>
</div>
```

See [DESIGN.md](DESIGN.md) for the full token reference.

## Testing

### Unit Tests

Place in `src/__tests__/` with `.test.ts(x)` extension:

```typescript
import { describe, it, expect } from "vitest";
import { parseStartYear } from "@/lib/duration";

describe("parseStartYear", () => {
  it("parses month-year range", () => {
    expect(parseStartYear("January 2020 - Present")).toBe(2020);
  });

  it("parses bare year", () => {
    expect(parseStartYear("2021")).toBe(2021);
  });
});
```

Run tests:

```bash
npm run test             # one-shot run
npm run test:coverage   # coverage report
```

**Coverage goals:**

- Utilities (`src/lib/`): 100%
- Components: main render paths
- Overall: 90% statements/functions/lines, 85% branches (enforced by Vitest thresholds)

### Design System Tests

Three design test files + one backstop rule enforce token and primitive contracts:

1. **`src/__tests__/design/tokens.test.ts`** — parses `src/app/globals.css` for `:root` (dark) and `[data-theme="light"]` (light), asserts canonical 12-token set present in both, validates WCAG AA contrast pairs via `wcag-contrast` library
2. **`src/__tests__/design/primitives.test.tsx`** — inline-snapshot className per shared primitive (Button, StatusPill, TabPill, TagBadge), anchors assertions to `toContain` patterns matching `docs/DESIGN.md` component patterns
3. **`src/__tests__/design/a11y.test.tsx`** — jest-axe structural audit on shared primitives; contrast/target-size/focus-order disabled (jsdom limitation; owned by Playwright + Lighthouse CI in full E2E)
4. **`src/__tests__/design/no-hardcoded-color.test.ts`** + ESLint rule — backstops hex/rgb/hsl literals in `src/components/**` and `src/app/**` (exception: `src/app/layout.tsx` for `themeColor` meta tag)

**Lighthouse CI gates** (`.github/lighthouse/lighthouserc.json`) check composite category gates (accessibility >=0.95 error, best-practices >=0.9 error, seo >=0.95 error, performance >=0.9 warn) plus specific a11y audits (color-contrast, image-alt, label, link-name, button-name, duplicate-id-aria, heading-order, tap-targets) and Core Web Vitals (LCP, CLS, TBT) at CI step.

Run full design suite: `npm run test -- design/`

## Favicon & Resume Generation

### Favicons

Generates all favicon sizes + OG image:

```bash
npm run generate-favicons
```

Requires source image at `public/source-image.png` (configurable in script).

### Resume PDF

Generates resume from React component:

```bash
npm run generate-resume
```

Outputs: `public/Rohit_Vipin_Mathews_Resume.pdf`  
Edit: `utils/resume/ResumeDocument.tsx`

## Deployment & CI/CD

### Local Preview

```bash
npm run build
npm run preview
```

### GitHub Pages Deployment

Push to `main` → GitHub Actions runs: audit → Prettier → lint → test → prepare assets (avatar, favicons, resume PDF) → build → deploy via GitHub Pages artifact API → smoke-test.

**Environment variables:**

| Variable                | Current value                  | Purpose                                                                   |
| ----------------------- | ------------------------------ | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_BASE_PATH` | `""`                           | URL prefix — empty for root domain                                        |
| `NEXT_PUBLIC_SITE_URL`  | `https://rohitvipin.github.io` | Canonical base URL used in metadata, OG tags, sitemap                     |
| `NEXT_PUBLIC_BUILD_SHA` | set by CI                      | Git SHA embedded in `<meta name="build-sha">` for smoke-test verification |

## Dependency Audit & CVE Hotfix Procedure

The reusable workflow `.github/workflows/_lint-test-build.yml` runs `npm audit
--audit-level=${{ inputs.audit-level }}` before lint/test/build. Both `ci.yml`
and `deploy.yml` pass `audit-level: high`, so any new HIGH or CRITICAL
transitive advisory blocks the pipeline.

**When a transitive CVE blocks main and a hotfix must ship before upstream
patches:**

1. Open a PR that adds the affected package to `package.json` `overrides` with
   a fixed version range:
   ```json
   "overrides": {
     "tmp": "^0.2.4"
   }
   ```
2. Run `npm install`, then `npm audit` locally to confirm the advisory clears.
3. If overrides cannot resolve (e.g., upstream dependency hard-pins the
   vulnerable version), open a one-commit PR that temporarily lowers the
   threshold:
   ```yaml
   # ci.yml + deploy.yml
   audit-level: critical
   ```
   Add a tracking issue link in the PR description and a TODO with target
   date for revert. Do not leave `audit-level: critical` on `main` longer
   than one release cycle.
4. Document the temporary downgrade in the PR body with: severity, affected
   package, blast-radius (devtool only? runtime?), and upstream tracking link.

The `overrides` path is preferred because it stays scoped to one package; the
`audit-level` downgrade silences ALL high-severity advisories, including
unrelated ones that surface during the window.

## Troubleshooting

| Issue                       | Solution                                               |
| --------------------------- | ------------------------------------------------------ |
| Build fails: type mismatch  | Check `src/types/index.ts` matches `data/*.json`       |
| ESLint errors on commit     | Run `npm run lint:fix`                                 |
| Tests fail but pass in CI   | Check Node version (24.15.0), timezone-dependent tests |
| Hot reload not working      | Restart dev server, clear browser cache                |
| Favicon/resume not updating | Run generate commands, clear build cache               |
| `npm audit` blocks CI       | See "Dependency Audit & CVE Hotfix Procedure" above    |

---

**Need more help?** See [CODE_REVIEW.md](CODE_REVIEW.md) for review standards, [DATA_STRATEGY.md](DATA_STRATEGY.md) for content, or [CLAUDE.md](../CLAUDE.md) for complete reference.
