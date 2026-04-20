# Data Strategy & Content Updates

How to maintain and update content in the portfolio.

## Philosophy

The `data/` directory is the **single source of truth** for all content. Never hardcode text into components.

## Updating Data

### Adding a New Skill

1. Edit `data/skills.json`
2. Add to appropriate `category` array:
   ```json
   {
     "id": "nextjs",
     "name": "Next.js",
     "category": "Frontend"
   }
   ```
3. Run `npm run lint:data` to validate
4. Commit: `git add data/skills.json && git commit -m "Add Next.js to frontend skills"`

### Adding Experience

1. Edit `data/experience.json`
2. Add to **beginning** of array (reverse-chronological):
   ```json
   {
     "id": "new-role",
     "company": "Acme Corp",
     "title": "Senior Engineer",
     "duration": "2024-present",
     "highlights": ["Built X", "Led Y"]
   }
   ```
3. Validate + commit

### Adding a Project

1. Edit `data/projects.json`
2. Add entry with required fields:
   ```json
   {
     "id": "project-slug",
     "name": "Project Name",
     "description": "What it does",
     "tech": ["TypeScript", "React"],
     "link": "https://..."
   }
   ```
3. Validate + commit

### Updating Socials

1. Edit `data/socials.json`
2. Keep to **professional/active** platforms only:
   - GitHub, LinkedIn, Twitter/X, Dev.to, Medium, Bluesky, etc.
   - Skip Facebook, Instagram, TikTok, etc.
3. Format:
   ```json
   {
     "platform": "GitHub",
     "url": "https://github.com/rohitvipin",
     "icon": "FaGithub"
   }
   ```

## Writing Standards

All content in `data/*.json` must follow:

- **ASCII punctuation only:** `-` not `–/—`, `...` not `…`, `"` not `"/"`
- **British English:** -ise not -ize, -our not -or, organised not organized
- **No corporate jargon:** "world-class", "seamlessly", "end-to-end", "at org scale"
- **No AI tells:** "proactive", "exceptional", "cutting-edge", "innovative", "robust"

## Validation

Before committing content changes:

```bash
npm run lint:data
```

This validates:

- JSON schema correctness
- No duplicate IDs or slugs
- Required fields present
- Writing standards met

## Required Fields by Type

| Type       | Required Fields                       |
| ---------- | ------------------------------------- |
| Skill      | `id`, `name`, `category`              |
| Experience | `id`, `company`, `title`, `duration`  |
| Project    | `id`, `name`, `description`, `tech`   |
| Education  | `id`, `degree`, `institution`, `year` |
| Award      | `id`, `title`, `organization`, `year` |
| Social     | `platform`, `url`, `icon`             |

## Adding a New Data Type

If adding an entirely new content type:

1. **Create JSON file:** `data/new-type.json`
2. **Define interface:** `src/types/index.ts` (new `NewType` interface)
3. **Create loader:** `src/lib/data.ts` (new `getNewTypes()` function)
4. **Build component:** `src/components/new-type/NewTypeSection.tsx`
5. **Validate:** `npm run lint:data`
6. **Test:** `npm run test`
7. **Push:** All changes in single commit

See [DEVELOPMENT.md](DEVELOPMENT.md#working-with-data) for step-by-step examples.

## Future Expansion Ideas

- **RSS feed aggregation:** Fetch latest articles from Medium/Dev.to at build time
- **GitHub stats:** Pull pinned repos + stats via GitHub API
- **Dynamic resume:** Generate PDF from JSON data (already implemented)

---

**Questions?** See [DEVELOPMENT.md](DEVELOPMENT.md) for more examples, or check [INDEX.md](INDEX.md).
