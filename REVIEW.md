# Code Review — rohit-profile

**Reviewed:** 2026-04-21  
**Last updated:** 2026-04-21 (post-fixes)  
**Status:** 2 open items remaining

---

## Open Items

### M-03: `as unknown as Profile` cast — confirmed load-bearing, needs Zod to fix properly

**File:** `src/lib/data.ts:24`

`satisfies Profile` fails — TypeScript widens JSON `availability_status` to `string`, not `"open" | "closed" | "passive"`. Cast is necessary until proper fix.

**Proper fix:** Add a Zod schema for `profile.json` that parses and narrows the type at build time. Eliminates the cast, gives runtime validation, and closes the M-07 enum gap simultaneously. ~1-2h effort.

---

### M-07 (partial): `lint:data` missing uniqueness and enum checks

**File:** `utils/lint-data-core.ts`

Required field + type checks added for all 9 schemas. Two gaps remain:

1. **No enum validation** — `availability_status` accepts any string. Zod (M-03 fix) closes this.
2. **No uniqueness check** — duplicate slugs/IDs not detected. Blocked on data model adding `id` fields.

---

## Resolved

| #    | Issue                                                            | Fixed in       |
| ---- | ---------------------------------------------------------------- | -------------- |
| H-01 | Inline anon prop types on 13+1 components                        | `a1c4f54`      |
| H-02 | 8 components with zero test coverage                             | `5e69fe0`      |
| M-01 | `profile_picture` required but empty/unused                      | `a1c4f54`      |
| M-02 | Hardcoded email in `layout.tsx` JSON-LD                          | `a1c4f54`      |
| M-04 | `CommunityCard` button missing `aria-label`                      | `a1c4f54`      |
| M-05 | `SkillCategoryCard` buttons missing `aria-label`/`aria-expanded` | `a1c4f54`      |
| M-06 | `feat/seo-overhaul` stale branch (merged via PR #1)              | branch deleted |
| M-07 | `lint:data` only checked forbidden chars                         | `5e69fe0`      |
| L-01 | `agent.md` stale planning artifact                               | `a1c4f54`      |
| L-02 | Vitest global env `node` (jsdom pragma footgun)                  | `a1c4f54`      |
| L-03 | `ExperienceTimeline` fragile compound React key                  | `a1c4f54`      |
| L-06 | Hardcoded avatar URL in `layout.tsx` JSON-LD                     | `a1c4f54`      |

---

_Reviewed: 2026-04-21 — Reviewer: Claude_
