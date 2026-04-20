# Frontend Architecture & Tech Stack

## Overview
This document outlines the proposed architecture for developing the profile website in the subsequent phase.

## Approach: Headless & Data-Driven
To maintain separation of concerns, the website will act as a rendering layer for the structured data currently living in the `/data` directory.
This enables easy modifications later without altering core UI components.

## Proposed Technology Stack
1. **Framework:** React based framework like Vite (for a lightweight SPA) or Next.js (if Server Side Generation for SEO is a strong requirement). 
2. **Styling:**
   - **Primary Option:** Vanilla CSS encapsulating modern CSS features (CSS variables, Grid/Flexbox) to ensure maximum design control, maintaining an ultra-premium visual aesthetic.
   - **Secondary Option:** Tailwind CSS (if requested) paired with a strict UI component system.
3. **Typography:** Remote fetch via Google Fonts (Inter, Roboto Mono for code/technical areas).
4. **Icons:** Phosphor Icons, Lucide, or FontAwesome.

## Data Files Schema

| File | Key Fields |
|------|-----------|
| `profile.json` | `name`, `title`, `headline`, `location`, `bio`, `email`, `phone`, `profile_picture`, `github_avatar`, `key_metrics[]` |
| `experience.json` | `company`, `role`, `location`, `duration`, `description`, `highlights[]` |
| `projects.json` | `name`, `domain`, `client`, `role`, `duration`, `description`, `products[]` (`name`, `description`), `highlights[]`, `tech[]` |
| `skills.json` | `category`, `skills[]` |
| `education.json` | `degree`, `institution`, `location`, `year` |
| `socials.json` | `platform`, `url`, `icon` |
| `awards.json` | `title`, `organization`, `year`, `description` |
| `community.json` | `type`, `title`, `location`, `description`, `highlights[]` |

## Component Hierarchy
- `App` (Main Container)
  - `Header` (Navigation & Theme Toggle)
  - `HeroSection` (Bio & Profile Data from `profile.json`)
  - `ExperienceTimeline` (Visual representation of roles from `experience.json`)
  - `ProjectsSection` (Platform project cards from `projects.json`)
  - `SkillsGrid` (Categorized skill blocks from `skills.json`)
  - `Footer` (Socials & Contact)

## State Management
Due to the static nature of a profile site, minimal state management is required. Standard Context API or simple component-level state will suffice for UI interactions (like dark mode toggles or modal dialogs).
