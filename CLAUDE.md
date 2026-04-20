# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Type

Content-only repo acting as a **headless CMS** for Rohit Vipin Mathews' personal profile site. No build system, no package manager, no tests — only JSON content, markdown specs, and resume assets. UI has not been scaffolded yet; the "Development Phase" begins when the user explicitly requests it.

## Layout

- `data/` — Canonical content consumed by the future UI. JSON only. Source of truth for anything rendered on the site.
  - `profile.json`, `socials.json`, `skills.json`, `experience.json`, `education.json`
- `docs/` — Architecture and content-strategy specs (`architecture.md`, `content_strategy.md`, `resume.md`). Read these before proposing structural changes.
- `resume/` — PDF + plain-text resume. `Rohit_Resume_Final.txt` is the editable source; PDFs are exported artifacts.
- `agent.md` — Design brief and stack constraints for UI work. Binding when building the site.
- `README.md` — High-level repo intent.

## Working Conventions

- **Content lives in `data/*.json`.** Never hardcode profile content into UI code. UI reads JSON at build time (SSG) or runtime (SPA fetch).
- **Schema drift** — when adding fields to any `data/*.json`, update the matching section in `docs/architecture.md` or `docs/content_strategy.md` in the same change.
- **Resume sync** — edits to experience/education/skills should also be reflected in `resume/Rohit_Resume_Final.txt` if the same facts appear there. PDFs are regenerated separately; don't hand-edit them.

## When the User Starts UI Development

Per `agent.md`:
- Stack defaults: Vite or Next.js, React. Vanilla CSS preferred for control; TailwindCSS only if requested.
- No default templates. Design target is dark-mode-first, premium, Inter/Outfit-class typography, micro-animations on cards/links.
- Mandatory sections driven by JSON: Hero (`profile.json` + `socials.json`), About, Skills grid (`skills.json`), Experience timeline (`experience.json`), Education (`education.json`).
- Initialize the UI inside this repo root (not a sibling dir) unless the user says otherwise.

## No Build/Test Commands Yet

There is no `package.json`, `Makefile`, or CI. Do not invent lint/test commands. If the user scaffolds a UI, add commands to this file at that point.
