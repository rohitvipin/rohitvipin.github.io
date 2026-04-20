# Content Strategy & Updates

## Philosophy
The data in this repository represents the "single source of truth" for Rohit Vipin Mathews' professional identity.

## Updating Data
1.  **Skills (`data/skills.json`):** Group new technologies into the correct `category` array. Avoid cluttering; maintain a curated list of active skills.
2.  **Experience (`data/experience.json`):** Add new objects to the beginning of the array (reverse-chronological). Ensure `highlights` are concise and impact-driven.
3.  **Socials (`data/socials.json`):** Keep this to professional or active development hubs (LinkedIn, GitHub, StackOverflow, SlideShare, Medium/Dev.to).

## Future Expansion Ideas
*   **Blogs/Articles Hub:** Create a script or API call to fetch public RSS feeds from Medium/Dev.to, saving the latest 3-5 articles into an `articles.json` cache during the build step.
*   **GitHub Pinned Repos:** Set up a GitHub Action to ping the GitHub API and fetch repository stats for `rohitvipin`, outputting them to a `projects.json` file.
*   **Resume Generation:** The JSON structural data can later be used to output a PDF directly using a headless browser script.
