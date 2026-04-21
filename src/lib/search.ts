import type {
  ExperienceEntry,
  Project,
  SkillCategory,
  CommunityEntry,
  Award,
  Education,
  Leadership,
} from "@/types";

export interface AllContentData {
  experience: ExperienceEntry[];
  projects: Project[];
  leadership: Leadership;
  skills: SkillCategory[];
  community: CommunityEntry[];
  awards: Award[];
  education: Education[];
}

export interface SearchIndexEntry {
  title: string;
  snippet: string;
  fullText: string;
  sectionId: string;
  sectionLabel: string;
  scrollAnchor: string;
}

export interface SearchResult {
  title: string;
  snippet: string;
  sectionId: string;
  sectionLabel: string;
  scrollAnchor: string;
  matchStart: number | null;
  matchEnd: number | null;
}

export type SearchIndex = SearchIndexEntry[];

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
}

function makeEntry(
  title: string,
  fields: string[],
  sectionId: string,
  sectionLabel: string,
  scrollAnchor: string
): SearchIndexEntry {
  const combined = [title, ...fields].join(" ");
  const snippet = truncate(combined, 120);
  return {
    title,
    snippet,
    fullText: combined.toLowerCase(),
    sectionId,
    sectionLabel,
    scrollAnchor,
  };
}

export function buildSearchIndex(data: AllContentData): SearchIndex {
  const entries: SearchIndexEntry[] = [];

  for (const e of data.experience) {
    entries.push(
      makeEntry(
        `${e.role} at ${e.company}`,
        [e.description, ...e.highlights, ...e.techStack],
        "experience",
        "Experience",
        "#experience"
      )
    );
  }

  for (const p of data.projects) {
    const products = p.products.map((pr) => `${pr.name} ${pr.description}`);
    entries.push(
      makeEntry(
        p.name,
        [p.domain, p.description, ...p.highlights, ...p.tech, ...products],
        "projects",
        "Projects",
        "#projects"
      )
    );
  }

  entries.push(
    makeEntry(
      data.leadership.title,
      data.leadership.sections.flatMap((s) => [s.title, s.description]),
      "leadership",
      "Leadership",
      "#leadership"
    )
  );

  for (const s of data.skills) {
    entries.push(makeEntry(s.category, s.skills, "skills", "Skills", "#skills"));
  }

  for (const c of data.community) {
    entries.push(
      makeEntry(
        c.title,
        [c.type, c.description, ...c.highlights],
        "community",
        "Community",
        "#community"
      )
    );
  }

  for (const a of data.awards) {
    entries.push(
      makeEntry(a.title, [a.organization, a.description], "awards", "Awards", "#awards")
    );
  }

  for (const ed of data.education) {
    entries.push(
      makeEntry(
        `${ed.degree} at ${ed.institution}`,
        [ed.location, ed.year],
        "education",
        "Education",
        "#education"
      )
    );
  }

  return entries;
}

export function queryIndex(index: SearchIndex, query: string): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const lower = trimmed.toLowerCase();
  const results: SearchResult[] = [];

  for (const entry of index) {
    if (!entry.fullText.includes(lower)) continue;

    const titleLower = entry.title.toLowerCase();
    const titleIdx = titleLower.indexOf(lower);
    const matchStart = titleIdx >= 0 ? titleIdx : null;
    const matchEnd = titleIdx >= 0 ? titleIdx + lower.length : null;

    results.push({
      title: entry.title,
      snippet: entry.snippet,
      sectionId: entry.sectionId,
      sectionLabel: entry.sectionLabel,
      scrollAnchor: entry.scrollAnchor,
      matchStart,
      matchEnd,
    });

    if (results.length === 10) break;
  }

  return results;
}
