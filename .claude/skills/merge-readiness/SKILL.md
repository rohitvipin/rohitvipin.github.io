---
name: merge-readiness
description: Six-phase merge readiness review covering CI gate (lint/test/build), coverage thresholds, E2E spec inventory, QA MCP browser validation via portfolio-qa skill, ARB architecture pass, and MERGE_READINESS.md report. Produces PASS/WARN/FAIL per dimension with a final MERGE READY / MERGE WITH CAUTION / DO NOT MERGE verdict. Use before merging any significant branch. Invoke for: merge ready, PR ready, ship check, branch review, release check.
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
  - Agent
  - Skill
metadata:
  version: "1.0.0"
  domain: quality
  triggers: merge ready, PR ready, ship check, branch review, release check, merge readiness, is this ready to merge
  role: orchestrator
  scope: review
  output-format: report
  related-skills: portfolio-qa, arch-review-board, code-reviewer, security-reviewer
---

# Merge Readiness Review

Six-phase pre-merge gate. Hard stop on CI failure; all other phases produce scored verdicts.

## Usage

```
/merge-readiness                    # current branch vs main
/merge-readiness base=develop       # different base branch
/merge-readiness arb=skip           # skip ARB (fast mode, not recommended for HIGH risk)
```

---

## Phase 1 — Branch Context

```bash
git log <base>..HEAD --oneline
git diff <base>...HEAD --stat
```

Classify risk:
| Files changed | Risk |
|--------------|------|
| < 20 | LOW |
| 20–60 | MEDIUM |
| > 60 | HIGH |

Report: commit count, files changed, insertions/deletions, risk level.

---

## Phase 2 — CI Gate

Run sequentially. Stop and report FAIL on first non-zero exit.

```bash
npm run lint        # ESLint + data validation
npm run test:ci     # Vitest CI mode
npm run build       # Next.js static export
```

Extract from test output:

- Test file count and test count (Vitest summary line)
- Any build warnings: `grep -iE "warn|error" build.log | grep -v "DeprecationWarning"`

**Hard gate: all three must exit 0 to continue.**

---

## Phase 3 — Coverage

Read thresholds from `vitest.config.ts`:

```bash
grep -A 10 "thresholds" vitest.config.ts
```

Parse actuals from `npm run test:ci` output (Coverage summary block).

Score per metric:

- PASS: actual >= threshold
- WARN: actual >= threshold − 2pp
- FAIL: actual < threshold

| Metric     | Threshold | Actual | Status |
| ---------- | --------- | ------ | ------ |
| Statements | ?%        | ?%     |        |
| Branches   | ?%        | ?%     |        |
| Functions  | ?%        | ?%     |        |
| Lines      | ?%        | ?%     |        |

---

## Phase 4 — E2E Audit

```bash
ls playwright.config.ts 2>/dev/null && echo FOUND || echo MISSING
find e2e/ -name "*.spec.ts" | sort
grep -l "playwright\|e2e" .github/workflows/*.yml
```

Check critical path coverage — spec should exist for:

- [ ] Smoke / page load (TC-00, TC-01)
- [ ] Navigation — desktop + mobile
- [ ] Core interactions (theme, scroll, collapsible)
- [ ] Accessibility
- [ ] Security / CSP
- [ ] Responsive / touch targets

Score:
| Check | PASS | WARN | FAIL |
|-------|------|------|------|
| playwright.config.ts | present | — | missing |
| Spec count | > 0 | — | none |
| Viewport coverage | all 3 | 1–2 | none |
| CI integration | workflow present | manual only | none |

---

## Phase 5 — QA MCP Browser Validation

Invoke the `portfolio-qa` skill:

```
/portfolio-qa both     # local + live in parallel
/portfolio-qa local    # local only (if live not yet deployed)
```

The skill handles: Playwright MCP browser navigation, all TC-00 through TC-14, screenshots, REPORT.md.

If dev server not running, start it first:

```bash
npm run dev &
until curl -sf http://localhost:3000; do sleep 1; done
```

Record from skill output:

- CRITICAL failures (count)
- HIGH failures (count)
- MEDIUM/LOW issues (count)
- Blocking: YES / NO
- Screenshot paths

**Blocking: YES = DO NOT MERGE.**

---

## Phase 6 — ARB Architecture Pass

Run inline gate checks against changed files:

```bash
# 1. No `any` types in src/ (excluding tests)
grep -rn ": any\b" src/ --include="*.ts" --include="*.tsx" | grep -v "__tests__\|\.test\."

# 2. No export default in components
grep -rn "^export default" src/components/ --include="*.tsx"

# 3. No hardcoded hex/rgb colours in components
grep -rn "#[0-9a-fA-F]\{6\}" src/components/ --include="*.tsx" | grep -v "regex\|schema"

# 4. No inline SVG
grep -rn "<svg" src/components/ --include="*.tsx"

# 5. "use client" only where justified (interactive/browser APIs)
grep -rn '"use client"' src/components/ --include="*.tsx"

# 6. No secrets
grep -rn -iE "(api_key|secret|password|token)\s*[=:]\s*['\"][^'\"]{8,}" src/ --include="*.ts" --include="*.tsx" | grep -v "test\."

# 7. Hardcoded content strings in components (flag proper nouns)
grep -rn "aria-label=" src/components/ --include="*.tsx" | grep -iE "(Rohit|Mathews|Director)"

# 8. .claude/settings.json or .env* in diff (flag for manual review)
git diff <base>...HEAD --name-only | grep -E "\.claude/settings|\.env"

# 9. JSON data changes have type + schema coverage (build passing implies yes; note if data/ changed)
git diff <base>...HEAD --name-only | grep "^data/"
```

Score:

- PASS: all gates clean
- WARN: 1–2 minor issues (justified `use client`, accessibility string with name, settings.json in diff)
- FAIL: `any` type, secret, missing schema sync, hardcoded content

**For HIGH-risk branches, also spawn `arch-review-board` subagent** (unless `arb=skip`):

```
Agent(subagent_type="arch-review-board", prompt="Review architectural decisions in PR: <branch> vs main. Focus on: type safety, component architecture, security, accessibility, CI pipeline integrity.")
```

---

## Phase 7 — Report

Write `MERGE_READINESS.md` to `.qa-reports/<run-dir>/` (or repo root if no qa-reports dir).

```markdown
# Merge Readiness — `<branch>` → `<base>`

**Date:** <ISO date>  
**Commits ahead:** <N>  
**Files changed:** <N> (+<ins> -<del>)  
**Risk level:** LOW | MEDIUM | HIGH  
**Overall verdict:** MERGE READY | MERGE WITH CAUTION | DO NOT MERGE

---

## CI Gate

| Check | Status  | Detail                         |
| ----- | ------- | ------------------------------ |
| Lint  | ✅ PASS | ESLint + data validation clean |
| Tests | ✅ PASS | N files, N tests               |
| Build | ✅ PASS | No warnings                    |

## Coverage

| Metric | Threshold | Actual | Status |
...

## E2E Readiness

...

## QA MCP Browser Validation

| Target | Blocking | CRITICAL | HIGH | MEDIUM/LOW |
...
Screenshots: <paths>

## ARB Architecture Pass

| Gate | Status | Notes |
...

## Risk Flags

- [ ] .claude/settings.json in diff — review allowed tool permissions
- [ ] data/\*.json changed — types and schemas verified via passing build + lint:data
- [ ] Resume PDF changed — visual inspection recommended

## Recommended Action

...
```

---

## Verdict Rules

| Condition                              | Verdict                                 |
| -------------------------------------- | --------------------------------------- |
| All phases PASS                        | MERGE READY                             |
| Any WARN (no FAIL)                     | MERGE WITH CAUTION — note what to watch |
| CI FAIL OR QA blocking=YES OR ARB FAIL | DO NOT MERGE                            |

---

## Adapting to Other Projects

| Item            | Where to find it                                       |
| --------------- | ------------------------------------------------------ |
| Lint command    | `package.json` scripts                                 |
| Test + coverage | `vitest.config.ts` / `jest.config.*`                   |
| E2E framework   | `playwright.config.ts` / `cypress.config.*`            |
| QA skill        | Replace `/portfolio-qa` with project-specific QA skill |
| Live URL        | `CLAUDE.md`, `package.json` homepage                   |
| Dev port        | `package.json` dev script                              |

For non-Next.js: replace build check with project artifact command.  
For non-Vitest: adapt coverage parsing to Jest/NYC/c8 output.  
For non-Playwright: adapt E2E audit to Cypress / WebdriverIO spec patterns.
