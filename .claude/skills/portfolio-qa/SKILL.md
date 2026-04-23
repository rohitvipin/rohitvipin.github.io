---
name: portfolio-qa
description: Full QA validation for the current repo portfolio site using Playwright/Chrome DevTools MCP. Spawns parallel agents for local (localhost:3000) and/or live (rohitvipin.github.io). All test cases defined in docs/QA_TEST_PLAN.md. Saves screenshots and reports to .qa-reports/.
allowed-tools:
  - Read
  - Write
  - Bash
  - Agent
  - mcp__playwright__browser_navigate
  - mcp__playwright__browser_take_screenshot
  - mcp__playwright__browser_snapshot
  - mcp__playwright__browser_resize
  - mcp__playwright__browser_evaluate
  - mcp__playwright__browser_console_messages
  - mcp__playwright__browser_network_requests
  - mcp__playwright__browser_click
  - mcp__playwright__browser_press_key
  - mcp__playwright__browser_wait_for
  - mcp__playwright__browser_tabs
  - mcp__playwright__browser_type
  - mcp__playwright__browser_hover
  - mcp__chrome-devtools__navigate_page
  - mcp__chrome-devtools__take_screenshot
  - mcp__chrome-devtools__take_snapshot
  - mcp__chrome-devtools__evaluate_script
  - mcp__chrome-devtools__get_console_message
  - mcp__chrome-devtools__list_console_messages
  - mcp__chrome-devtools__get_network_request
  - mcp__chrome-devtools__list_network_requests
  - mcp__chrome-devtools__click
  - mcp__chrome-devtools__type_text
  - mcp__chrome-devtools__press_key
  - mcp__chrome-devtools__fill
  - mcp__chrome-devtools__hover
  - mcp__chrome-devtools__resize_page
  - mcp__chrome-devtools__wait_for
  - mcp__chrome-devtools__list_pages
  - mcp__chrome-devtools__select_page
  - mcp__chrome-devtools__new_page
  - mcp__chrome-devtools__close_page
---

<objective>
Orchestrate browser QA validation against the portfolio site.
Test cases, viewports, severity ratings, and pass/fail criteria are defined in docs/QA_TEST_PLAN.md — do not duplicate them here.
Spawn parallel sub-agents (oh-my-claudecode:qa-tester) per target, consolidate results, write report.
</objective>

<args>
- No args or "both": test localhost:3000 AND rohitvipin.github.io in parallel
- "local": test localhost:3000 only
- "live": test rohitvipin.github.io only
</args>

<process>

## Step 1 — Setup

```bash
RUN_DIR=".qa-reports/$(date +%Y-%m-%d-%H-%M)"
mkdir -p "$RUN_DIR/local" "$RUN_DIR/live"
echo "$RUN_DIR"
```

Read docs/QA_TEST_PLAN.md in full before spawning agents — agents receive it verbatim.

## Step 2 — Spawn parallel agents

Send both agents in a single message so they run concurrently.

**Agent prompt (substitute TARGET_URL, TARGET_NAME, RUN_DIR):**

```
You are a QA agent for the rohit-profile portfolio.
Target: TARGET_NAME — TARGET_URL
Screenshot dir: RUN_DIR/TARGET_NAME/

Tools: use Playwright MCP browser tools. Fall back to Chrome DevTools MCP if Playwright is unavailable.

Before starting, confirm the server is reachable:
- For localhost: curl -sf http://localhost:3000 || { echo "SERVER NOT RUNNING — SKIP ALL"; exit 0; }
- For live: always proceed

Read and execute every test case in docs/QA_TEST_PLAN.md in order.
For each TC, save a screenshot named {viewport}-TC-{nn}.png to the screenshot dir.
Viewport sizes, expected values, and severity are all defined in the test plan — follow them exactly.

Report format per test case:
| TC | Description | Result | Actual value / error |
|----|-------------|--------|----------------------|

After all TCs, print:
- CRITICAL failures (count + list)
- HIGH failures (count + list)
- MEDIUM/LOW issues (count)
- Blocking: YES (any CRITICAL or HIGH failure) / NO
- Console errors verbatim
- Failed network requests verbatim

Write the full report to: RUN_DIR/TARGET_NAME/REPORT.md
```

## Step 3 — Delta comparison

If both targets tested, print a side-by-side table of TCs that differ between local and live.
Highlight regressions (local FAIL where live PASS) and fixes (local PASS where live FAIL).

## Step 4 — Final output

Print to console:

1. Run directory: RUN_DIR
2. Per-target: PASS/FAIL, blocking status, failure count by severity
3. Delta table (if both tested)
4. Screenshot locations

</process>

<notes>
- Chrome DevTools MCP clamps viewport minimum to 500px — note in report if tablet test is clamped
- .qa-reports/ is gitignored; save freely
- If server not running for localhost, mark all local TCs as SKIP and advise: npm run dev
</notes>
