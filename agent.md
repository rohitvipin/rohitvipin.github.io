# Agent Guidelines: Building the Profile Website

## Project Goal
Build a modern, highly aesthetic, personal portfolio website for **Rohit Vipin Mathews**, a Software Developer specializing in C#, ASP.NET, and Xamarin.

## Constraints & Phase Context
*   **Current Phase:** The currently active phase is finished generating content. If you are reading this, you are likely shifting towards the **Development Phase**.
*   **Data Source:** DO NOT hardcode content into the HTML/UI. Use the JSON data stored in `/data/` (e.g., `profile.json`, `socials.json`, `skills.json`, `experience.json`).
*   **Stack:** 
    *   **Core:** HTML/Vanilla CSS initially, or frameworks (React/Next.js/Vite) based on the specific USER request.
    *   **Styling:** Prioritize Vanilla CSS for strict control, or TailwindCSS if instructed. Avoid default templates.

## Design Identity & Requirements
1.  **Immersive UI/UX:** Create a stunning first impression. Use deep dark modes with rich, subtle gradients or a highly curated, premium light mode template.
2.  **Typography:** Use modern web fonts (e.g., Inter, Roboto, Outfit) instead of system fonts to provide a sleek, polished look.
3.  **Dynamic Rendering:** Fetch the JSON files asynchronously (if acting as an SPA) or import them directly during the build (if using Next.js/Vite SSG).
4.  **Micro-animations:** Add subtle hover states on all cards (Experience, Skills) and links (Socials) to make the interface feel alive.
5.  **Layout Hierarchy:**
    *   **Hero Section:** Big, bold introduction taking data from `profile.json`. Should include links to `socials.json`.
    *   **About:** Expanding on the bio.
    *   **Skills:** A responsive grid showing technical domains from `skills.json`.
    *   **Experience:** A timeline or card-based view traversing `experience.json`.

## Steps for Execution
1.  **Initialize Project:** If the user indicates to start development, initialize the environment (e.g., `npx create-vite-app`).
2.  **Mount Data:** Write utilities to read from the `/data/` folder and supply it to the UI components.
3.  **Build Components:** Create semantic, reusable HTML structures (Hero, Section, Card).
4.  **Polish:** Emphasize styling and design adjustments before considering the task complete.
