# Documentation Index

Map of all project documentation with suggested reading order.

## Quick Navigation

**I want to...**

- **Get running** → [Getting Started](GETTING_STARTED.md) (5 min)
- **Contribute code** → [CONTRIBUTING.md](../CONTRIBUTING.md) (read + follow checklist)
- **Understand architecture** → [Architecture Reference](ARCHITECTURE_REFERENCE.md)
- **Review a PR** → [docs/CODE_REVIEW.md](CODE_REVIEW.md) (use checklist)
- **Run QA validation** → [docs/QA_TEST_PLAN.md](QA_TEST_PLAN.md) (use `/portfolio-qa` skill)
- **Know the complete rules** → [CLAUDE.md](../CLAUDE.md) (comprehensive reference for AI agents)

## By Role

### Developers (First Time)

1. [Getting Started](GETTING_STARTED.md) — Setup and first run
2. [CONTRIBUTING.md](../CONTRIBUTING.md) — Workflow, branching, commits
3. [docs/DEVELOPMENT.md](DEVELOPMENT.md) — Commands and patterns
4. [docs/CODE_REVIEW.md](CODE_REVIEW.md) — Before you push

### Code Reviewers

1. [docs/CODE_REVIEW.md](CODE_REVIEW.md) — Full review checklist
2. [CONTRIBUTING.md](../CONTRIBUTING.md) — Development practices context
3. [docs/DEVELOPMENT.md](DEVELOPMENT.md) — Patterns and examples

### AI Agents

1. [CLAUDE.md](../CLAUDE.md) — Complete agent guidance
2. [docs/ARCHITECTURE_REFERENCE.md](ARCHITECTURE_REFERENCE.md) — Tech stack details

## By Topic

### Workflow & Contribution

- [Getting Started](GETTING_STARTED.md) — Project setup
- [CONTRIBUTING.md](../CONTRIBUTING.md) — GitHub workflow, branch strategy, PR process
- [docs/CODE_REVIEW.md](CODE_REVIEW.md) — Code review standards

### Development

- [docs/DEVELOPMENT.md](DEVELOPMENT.md) — Commands, setup, troubleshooting
- [docs/DATA_STRATEGY.md](DATA_STRATEGY.md) — Content updates and data maintenance
- [docs/QA_TEST_PLAN.md](QA_TEST_PLAN.md) — Browser QA test plan; run via `/portfolio-qa`

### Architecture & Reference

- [docs/ARCHITECTURE_REFERENCE.md](ARCHITECTURE_REFERENCE.md) — Tech stack, component hierarchy, decisions
- [docs/DESIGN.md](DESIGN.md) — Design system: tokens, typography, components, animation, a11y
- [CLAUDE.md](../CLAUDE.md) — Path-specific rules, complete reference for AI
- [docs/CODE_REVIEW.md](CODE_REVIEW.md) — Review standards (also contains detailed architecture rules)

### GitHub Templates

- [.github/pull_request_template.md](../.github/pull_request_template.md) — PR template
- [.github/ISSUE_TEMPLATE/](../.github/ISSUE_TEMPLATE/) — Issue templates

## Files & Their Purpose

| File                                 | Purpose                                      | Audience                |
| ------------------------------------ | -------------------------------------------- | ----------------------- |
| **README.md**                        | Project overview, quick links                | Everyone                |
| **GETTING_STARTED.md**               | Setup in 5 minutes                           | New developers          |
| **CONTRIBUTING.md**                  | GitHub workflow, coding standards            | Contributors            |
| **CODE_REVIEW.md**                   | Review checklist and standards               | Reviewers + authors     |
| **DEVELOPMENT.md**                   | Commands, how-to guides, troubleshooting     | Developers              |
| **ARCHITECTURE_REFERENCE.md**        | Tech stack, decisions, data schema           | Developers + architects |
| **DATA_STRATEGY.md**                 | How to maintain and update content           | Content editors         |
| **DESIGN.md**                        | Design system: tokens, components, a11y      | Developers + designers  |
| **QA_TEST_PLAN.md**                  | Browser QA test plan + `/portfolio-qa` skill | Developers + QA         |
| **CLAUDE.md**                        | Complete reference for AI agents             | AI agents               |
| **.github/pull_request_template.md** | PR submission format                         | Contributors            |
| **.github/ISSUE_TEMPLATE/**          | Issue submission format                      | Everyone                |

## Key Concepts (Single Source of Truth)

Where to find each topic:

| Topic                  | Primary Doc               | Secondary                     |
| ---------------------- | ------------------------- | ----------------------------- |
| Getting started        | GETTING_STARTED.md        | README.md                     |
| Branching/commits      | CONTRIBUTING.md           | —                             |
| Development practices  | CONTRIBUTING.md           | CLAUDE.md (path rules)        |
| Commands reference     | DEVELOPMENT.md            | README.md (quick start)       |
| Code review standards  | CODE_REVIEW.md            | CONTRIBUTING.md               |
| Type safety            | CLAUDE.md                 | CODE_REVIEW.md (in checklist) |
| Data schema            | ARCHITECTURE_REFERENCE.md | CLAUDE.md                     |
| Content updates        | DATA_STRATEGY.md          | DEVELOPMENT.md                |
| Component conventions  | CLAUDE.md                 | CONTRIBUTING.md               |
| Testing                | DEVELOPMENT.md            | CODE_REVIEW.md                |
| Architecture decisions | ARCHITECTURE_REFERENCE.md | CLAUDE.md                     |

## Progressive Disclosure

**5 minutes:** README.md + GETTING_STARTED.md  
**30 minutes:** + CONTRIBUTING.md  
**1 hour:** + DEVELOPMENT.md  
**2 hours:** + CODE_REVIEW.md + ARCHITECTURE_REFERENCE.md  
**Complete:** All docs + CLAUDE.md (full reference)

---

**Questions?** Check relevant doc above, or open an issue on GitHub.
