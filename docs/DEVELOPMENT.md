# Development Guide

Reference for local development, commands, and patterns.

See [GETTING_STARTED.md](GETTING_STARTED.md) if you're setting up for the first time.

## Project Commands

| Command                     | Purpose                             |
| --------------------------- | ----------------------------------- |
| `npm run dev`               | Local dev server with HMR           |
| `npm run build`             | Static export to `out/`             |
| `npm run preview`           | Build + serve locally               |
| `npm run lint`              | ESLint + Prettier + data validation |
| `npm run lint:fix`          | Auto-fix ESLint + Prettier          |
| `npm run test`              | Run Vitest (one-shot, CI mode)      |
| `npm run test:ci`           | Run Vitest with verbose CI reporter |
| `npm run test:coverage`     | Coverage report                     |
| `npm run generate-favicons` | Rebuild favicon suite               |
| `npm run generate-resume`   | Generate resume PDF                 |
| `npm run lint:data`         | Validate JSON schemas only          |

## Working with Data

### Adding a New Content Type

1. **Create JSON file:** `data/new-type.json`
2. **Define interface:** `src/types/index.ts` (new `NewType` interface)
3. **Export constant:** `src/lib/data.ts` — parse with Zod schema, export typed const (e.g., `export const newTypes: NewType[] = z.array(NewTypeSchema).parse(newTypeData)`)
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

Always import via typed loaders, never from JSON directly:

```typescript
// ✗ Don't
import skillsData from "../../data/skills.json";

// ✓ Do
import { getSkills } from "@/lib/data";

export function SkillsSection() {
  const skills = getSkills();
  // ...
}
```

### Colors & Theming

Define tokens in `src/app/globals.css`:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  --accent: #0066cc;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --accent: #66b3ff;
}
```

Use in components:

```tsx
<div style={{ backgroundColor: "var(--bg-primary)" }}>
  <h1 style={{ color: "var(--text-primary)" }}>Title</h1>
</div>
```

## Testing

### Unit Tests

Place in `src/__tests__/` with `.test.ts(x)` extension:

```typescript
import { describe, it, expect } from "vitest";
import { formatDate } from "@/lib/date";

describe("formatDate", () => {
  it("should format ISO date correctly", () => {
    expect(formatDate("2024-04-21")).toBe("21 Apr 2024");
  });

  it("should handle edge cases", () => {
    expect(formatDate("")).toBe("");
  });
});
```

Run tests:

```bash
npm run test             # one-shot run
npm run test:coverage   # coverage report
```

**Coverage goals:**

- Utilities: 100%
- Components: main paths
- Overall: 60% minimum

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

Push to `main` → GitHub Actions runs lint → test → build → deploy.

Environment: `NEXT_PUBLIC_BASE_PATH`

- `""` — Custom domain
- `"/rohit-profile"` — GitHub Pages subpath

## Troubleshooting

| Issue                       | Solution                                            |
| --------------------------- | --------------------------------------------------- |
| Build fails: type mismatch  | Check `src/types/index.ts` matches `data/*.json`    |
| ESLint errors on commit     | Run `npm run lint:fix`                              |
| Tests fail but pass in CI   | Check Node version (20.x), timezone-dependent tests |
| Hot reload not working      | Restart dev server, clear browser cache             |
| Favicon/resume not updating | Run generate commands, clear build cache            |

---

**Need more help?** See [CODE_REVIEW.md](CODE_REVIEW.md) for review standards, [DATA_STRATEGY.md](DATA_STRATEGY.md) for content, or [CLAUDE.md](../CLAUDE.md) for complete reference.
