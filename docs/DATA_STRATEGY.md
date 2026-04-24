# Data Strategy & Content Updates

How to maintain and update content in the portfolio.

## Philosophy

The `data/` directory is the **single source of truth** for all content. Never hardcode text into components.

## Updating Data

### Adding a New Skill

1. Edit `data/skills.json`
2. Find the right category object and append the skill string to its `skills` array:
   ```json
   { "category": "Frontend", "skills": ["React", "Next.js"] }
   ```
   To add an entirely new category, append a new object to the top-level array:
   ```json
   { "category": "New Category", "skills": ["Tool A", "Tool B"] }
   ```
3. Run `npm run lint:data` to validate
4. Commit: `git add data/skills.json && git commit -m "Add Next.js to frontend skills"`

### Adding Experience

1. Edit `data/experience.json`
2. Add entry (array is sorted by start year at runtime — JSON order does not matter):
   ```json
   {
     "company": "Acme Corp",
     "role": "Senior Engineer",
     "location": "Remote",
     "duration": "April 2024 - Present",
     "current": true,
     "description": "One-line summary of the role.",
     "techStack": ["TypeScript", "Node.js"],
     "highlights": ["Built X", "Led Y"]
   }
   ```
3. Validate + commit

**`duration` allowed formats** (parsed by `src/lib/duration.ts` for sort order):

| Format                      | Example                      |
| --------------------------- | ---------------------------- |
| `"Month YYYY - Present"`    | `"April 2024 - Present"`     |
| `"Month YYYY - Month YYYY"` | `"January 2012 - July 2013"` |
| `"YYYY"` (short/OSS items)  | `"2021"`                     |

Do not use other formats — `parseStartYear` will return `0` and the entry sorts last.

### Adding a Project

1. Edit `data/projects.json`
2. Add entry with required fields:
   ```json
   {
     "name": "Project Name",
     "domain": "Open Source / Developer Tooling",
     "client": "Internal",
     "role": "Lead Engineer",
     "duration": "2023",
     "description": "What it does.",
     "products": [],
     "highlights": ["Shipped X", "Reduced Y by Z%"],
     "tech": ["TypeScript", "React"]
   }
   ```
   `id` is optional (kebab-case slug). `github` URL is optional.
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

See the [Writing Standards section in CODE_REVIEW.md](CODE_REVIEW.md#writing-standards) for the full checklist (ASCII punctuation, British English, jargon rules).

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

| Type        | Required Fields                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------- |
| Skill       | `category`, `skills` (array)                                                                    |
| Experience  | `company`, `role`, `location`, `duration`, `current`, `description`, `techStack`, `highlights`  |
| Project     | `name`, `domain`, `client`, `role`, `duration`, `description`, `products`, `highlights`, `tech` |
| Education   | `degree`, `institution`, `location`, `year`                                                     |
| Award       | `title`, `organization`, `year`, `description`                                                  |
| Social      | `platform`, `url`, `icon`                                                                       |
| Community   | `type`, `title`, `description`, `highlights`                                                    |
| NavLink     | `label`, `href`                                                                                 |
| Leadership  | top-level `title` + `sections` array                                                            |
| ImpactStory | `id`, `title`, `domain`, `problem`, `scope`, `led`, `result`, `metrics` (web only)              |

## Adding a New Data Type

If adding an entirely new content type:

1. **Create JSON file:** `data/new-type.json`
2. **Define interface:** `src/types/index.ts` (new `NewType` interface)
3. **Export typed const:** `src/lib/data.ts` — `parseOrThrow` is module-private; add the new const inside `data.ts` following the existing pattern: `export const newTypes: NewType[] = parseOrThrow(z.array(NewTypeSchema), newTypeData, "newTypes")`
4. **Build component:** `src/components/new-type/NewTypeSection.tsx`
5. **Validate:** `npm run lint:data`
6. **Test:** `npm run test`
7. **Push:** All changes in single commit

See [DEVELOPMENT.md](DEVELOPMENT.md#working-with-data) for step-by-step examples.

---

**Questions?** See [DEVELOPMENT.md](DEVELOPMENT.md) for more examples, or check [INDEX.md](INDEX.md).
