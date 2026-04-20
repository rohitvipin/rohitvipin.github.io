# Rohit Vipin Mathews - Personal Profile Repository

## Overview

This repository serves as the central hub and content aggregation platform for the personal profile website of **Rohit Vipin Mathews**. It is structured to act as a headless CMS, separating the content (JSON/Markdown) from the presentation layer (which will be built in the future).

## Current Phase

The current phase is strictly **Planning and Content Aggregation**. No UI, HTML, or active development represents this state.

## Folder Structure

```text
rohit-profile/
├── README.md              # Project overview and setup documentation
├── agent.md               # Guidelines and instructions for AI agents building the UI
├── data/                  # Dynamic content to be fetched via API or read by SSG
│   ├── profile.json       # Core profile details and bio
│   ├── socials.json       # Social media footprint and links
│   ├── skills.json        # Technical skills and competencies
│   └── experience.json    # Work history and roles
└── docs/                  # Markdown files containing extensive project documentation
    ├── content_strategy.md# How content will be managed and updated
    └── architecture.md    # Proposed architecture for the future frontend build
```

## How to use this data

All data in the `data/` directory is structured in JSON. The future UI build allows this to be dynamically routed inside a React/Next.js/Vite application.
The markdown files in `docs/` provide the technical structure for how to expand this repository once the development phase begins.
