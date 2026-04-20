# Code Review Standards

This document defines the review criteria and checklist for all PRs to ensure architectural consistency, code quality, and maintainability.

## Review Principles

1. **Architecture first** — Does the change align with project constraints and decisions?
2. **Type safety** — No `any`, strict TypeScript, types match data schemas.
3. **User-facing quality** — Performance, accessibility, UX intent clear.
4. **Maintainability** — Clear intent, proper tests, no anti-patterns.
5. **Production-ready** — Error handling, edge cases, observability.

---

## Architecture Review

### Headless CMS Pattern

- [ ] No hardcoded content in components (strings, IDs, slugs all from JSON)
- [ ] If new content type, JSON field exists **and** `src/types/index.ts` updated
- [ ] Data accessed via `src/lib/data.ts` typed loaders only
- [ ] No fetch() calls in client code (only build-time via Next.js)

### Component Structure

- [ ] Server component by default (no `"use client"` unless hooks/browser API used)
- [ ] Props interface defined and exported (even for internal components)
- [ ] Discriminated unions for conditional rendering (not boolean props)
- [ ] No prop drilling beyond 1 level (use context for deep nesting)
- [ ] Naming: PascalCase components, snake_case utilities

### Styling & Theming

- [ ] All colors use CSS custom properties (`var(--accent)`, `var(--bg-primary)`)
- [ ] No hardcoded hex, rgb, or named colors in JSX
- [ ] Tailwind used for layout/spacing, custom CSS for theme-specific polish
- [ ] Dark/light mode toggle respects `next-themes` conventions
- [ ] Color contrast meets WCAG AA minimum

### Icons

- [ ] Icons from `react-icons` only (FA6 brands or Feather UI)
- [ ] No inline SVGs or custom icon components (unless documented exception)
- [ ] Icon sizing consistent (use design system tokens, not arbitrary px values)

---

## Type Safety

### TypeScript Strictness

- [ ] No `any` types without comment explaining why
- [ ] All function parameters typed (no implicit `any`)
- [ ] Return types explicit on exported functions
- [ ] Generic types constrained (not bare `<T>`)
- [ ] Objects fully typed (not `Record<string, unknown>` or `{[key: string]: any}`)

### Data Binding

- [ ] JSON schema changes **always** paired with `src/types/index.ts` updates
- [ ] Component props match underlying data types exactly
- [ ] Array rendering uses `.map()` with typed elements, key is stable (ID, not index)
- [ ] Optional fields marked `?` in types and handled with fallbacks in UI

---

## Performance & Load

- [ ] Static export doesn't introduce Node.js dependencies (no `fs`, `path` in client code)
- [ ] Images optimized (check generated `out/` for file sizes)
- [ ] External scripts minimized (no tracking pixels or unnecessary analytics)
- [ ] CSS bundle checked for duplication (Tailwind purging working)
- [ ] No console warnings on build or runtime

---

## Testing

### Coverage Requirements

- [ ] New utilities: 100% unit test coverage
- [ ] New components: Tests for main paths (render, user interactions)
- [ ] Data loaders: Tests for happy path + error handling
- [ ] **Minimum:** 60% overall coverage (`npm run test:coverage`)

### Test Quality

- [ ] Tests describe **what** not **how** (semantic assertions)
- [ ] Mocks used for external data (not hitting real files/APIs)
- [ ] Edge cases covered (empty arrays, null values, boundary conditions)
- [ ] Tests run independently (no shared state between tests)

---

## Content & Accessibility

### Writing Standards

- [ ] No smart quotes, em/en dashes, or ellipsis (plain ASCII only)
- [ ] British English (-ise, -our, organised) except proper nouns
- [ ] No corporate jargon: "world-class", "seamlessly", "end-to-end", "at org scale"
- [ ] No AI tells: "proactive", "exceptional", "cutting-edge", "innovative", "robust"

### Accessibility

- [ ] Semantic HTML (button for buttons, link for navigation, etc.)
- [ ] ARIA labels where needed (images, icon buttons)
- [ ] Keyboard navigation works (Tab order logical, focus visible)
- [ ] Color not sole indicator (e.g., errors also use text/icons)
- [ ] Sufficient contrast (WCAG AA 4.5:1 for text, 3:1 for UI components)

---

## Data Validation

### JSON Files

- [ ] Schema valid (run `npm run lint:data` locally, passes in CI)
- [ ] No duplicate IDs or slugs across records
- [ ] Required fields present (name, title, date, link as applicable)
- [ ] URLs valid (if any links, they should resolve)
- [ ] Data sorted logically (chronological, alphabetical by importance, etc.)

---

## Error Handling & Robustness

- [ ] Missing data handled gracefully (fallback UI, not crash)
- [ ] Async operations have loading + error states
- [ ] Error messages helpful to users (not stack traces)
- [ ] Console errors minimal (no "undefined" warnings during build)
- [ ] Edge cases tested (empty states, max string lengths, special characters)

---

## Build & Deployment

- [ ] `npm run lint` passes (no ESLint/Prettier violations, data valid)
- [ ] `npm run test` passes (no failing tests)
- [ ] `npm run build` succeeds (static export generated)
- [ ] `npm run preview` works locally
- [ ] No new warnings in build output

---

## Review Checklist Template

```markdown
### Architecture

- [ ] No hardcoded content in UI
- [ ] Types match JSON schemas
- [ ] Component structure follows conventions
- [ ] Styling uses CSS custom properties

### Code Quality

- [ ] TypeScript strict, no `any`
- [ ] Tests for new logic
- [ ] ESLint + Prettier pass
- [ ] Accessibility considered

### Performance & Build

- [ ] Static export check passes
- [ ] No new Node.js dependencies in client
- [ ] Bundle size acceptable
- [ ] Build succeeds, no warnings

### Data & Content

- [ ] Writing standards met (ASCII, British English, no jargon)
- [ ] Data validation passes
- [ ] No broken links or missing fields
```

---

## Examples

### ✗ Changes That Will Be Rejected

```typescript
// ✗ Hardcoded content
export const Hero = () => <div>Rohit Vipin Mathews</div>;

// ✗ Color hardcoding
<div style={{ color: '#ff0000' }}>Error</div>

// ✗ Missing types
const handler = (data) => console.log(data);

// ✗ Icon from elsewhere
import MyIcon from './MyIcon.svg';

// ✗ No test for business logic
// (new component, no tests)
```

### ✓ Changes That Will Be Approved

```typescript
// ✓ Data-driven UI
export const Hero = () => {
  const profile = useProfile(); // typed loader
  return <div>{profile.name}</div>;
};

// ✓ Theme-aware colors
<div className="text-red-600 dark:text-red-400">Error</div>
// or
<div style={{ color: 'var(--error-text)' }}>Error</div>

// ✓ Fully typed
const handler = (data: Record<string, unknown>): void => {
  console.log(data);
};

// ✓ Icons from react-icons
import { FaGithub } from 'react-icons/fa6';

// ✓ Tested business logic
describe('formatDate', () => {
  it('should format ISO date correctly', () => {
    expect(formatDate('2024-04-21')).toBe('21 Apr 2024');
  });
});
```

---

## After Review

- **Approved:** Merge via "Squash and merge" (clean history) or "Create a merge commit" (preserve PR history).
- **Changes requested:** Address comments, push fixes, re-request review.
- **Blocked:** Major architectural issues — discuss in PR or open a discussion issue.
