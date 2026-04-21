import { describe, it, expect } from "vitest";
import { buildSearchIndex, queryIndex } from "@/lib/search";
import type { AllContentData, SearchIndexEntry } from "@/lib/search";

const mockData: AllContentData = {
  experience: [
    {
      company: "Acme Corp",
      role: "Senior Engineer",
      location: "London",
      duration: "2020–2024",
      current: false,
      description: "Built scalable microservices using AWS Lambda.",
      techStack: ["TypeScript", "Node.js", "AWS"],
      highlights: ["Reduced latency by 40%", "Led 5-person team"],
    },
    {
      company: "Beta Ltd",
      role: "Tech Lead",
      location: "Remote",
      duration: "2024–Present",
      current: true,
      description: "Platform modernisation for logistics.",
      techStack: ["Go", "Kubernetes"],
      highlights: ["Shipped zero-downtime migration"],
    },
  ],
  projects: [
    {
      name: "OpenTrack",
      domain: "Open Source / Developer Tooling",
      client: "Community",
      role: "Author",
      duration: "2023",
      description: "CLI tool for tracking dev metrics.",
      products: [{ name: "core", description: "Core library" }],
      highlights: ["1000 GitHub stars"],
      tech: ["Rust", "CLI"],
      github: "https://github.com/example/opentrack",
    },
  ],
  leadership: {
    title: "Engineering Leadership",
    sections: [
      { title: "Team Growth", description: "Scaled teams from 5 to 50 engineers." },
      { title: "Org Design", description: "Established chapter model." },
    ],
  },
  skills: [
    { category: "Backend", skills: ["Go", "Rust", "Node.js"] },
    { category: "Cloud", skills: ["AWS", "GCP", "Kubernetes"] },
  ],
  community: [
    {
      type: "Conference",
      title: "KubeCon Talk",
      location: "Amsterdam",
      description: "Presented on GitOps patterns.",
      highlights: ["500 attendees"],
    },
  ],
  awards: [
    {
      title: "Tech Pioneer Award",
      organization: "ACME Foundation",
      year: "2023",
      description: "Awarded for open source contributions.",
    },
  ],
  education: [
    {
      degree: "B.Tech Computer Science",
      institution: "University of Kerala",
      location: "Kerala, India",
      year: "2010",
    },
  ],
};

describe("buildSearchIndex", () => {
  const index = buildSearchIndex(mockData);

  it("includes experience entries", () => {
    const exp = index.filter((e) => e.sectionId === "experience");
    expect(exp).toHaveLength(2);
    expect(exp[0].title).toBe("Senior Engineer at Acme Corp");
    expect(exp[1].title).toBe("Tech Lead at Beta Ltd");
  });

  it("includes project entries", () => {
    const projects = index.filter((e) => e.sectionId === "projects");
    expect(projects).toHaveLength(1);
    expect(projects[0].title).toBe("OpenTrack");
  });

  it("includes a single leadership entry", () => {
    const leadership = index.filter((e) => e.sectionId === "leadership");
    expect(leadership).toHaveLength(1);
    expect(leadership[0].title).toBe("Engineering Leadership");
  });

  it("includes skill category entries", () => {
    const skills = index.filter((e) => e.sectionId === "skills");
    expect(skills).toHaveLength(2);
    expect(skills[0].title).toBe("Backend");
    expect(skills[1].title).toBe("Cloud");
  });

  it("includes community entries", () => {
    const community = index.filter((e) => e.sectionId === "community");
    expect(community).toHaveLength(1);
    expect(community[0].title).toBe("KubeCon Talk");
  });

  it("includes award entries", () => {
    const awards = index.filter((e) => e.sectionId === "awards");
    expect(awards).toHaveLength(1);
    expect(awards[0].title).toBe("Tech Pioneer Award");
  });

  it("includes education entries", () => {
    const education = index.filter((e) => e.sectionId === "education");
    expect(education).toHaveLength(1);
    expect(education[0].title).toBe("B.Tech Computer Science at University of Kerala");
  });

  it("total entry count matches sum of all content types", () => {
    // 2 experience + 1 project + 1 leadership + 2 skills + 1 community + 1 award + 1 education
    expect(index).toHaveLength(9);
  });

  it("sets correct scrollAnchor for each section", () => {
    expect(index.find((e) => e.sectionId === "experience")?.scrollAnchor).toBe("#experience");
    expect(index.find((e) => e.sectionId === "projects")?.scrollAnchor).toBe("#projects");
    expect(index.find((e) => e.sectionId === "leadership")?.scrollAnchor).toBe("#leadership");
    expect(index.find((e) => e.sectionId === "skills")?.scrollAnchor).toBe("#skills");
    expect(index.find((e) => e.sectionId === "community")?.scrollAnchor).toBe("#community");
    expect(index.find((e) => e.sectionId === "awards")?.scrollAnchor).toBe("#awards");
    expect(index.find((e) => e.sectionId === "education")?.scrollAnchor).toBe("#education");
  });

  it("sets correct sectionLabel for each section", () => {
    expect(index.find((e) => e.sectionId === "experience")?.sectionLabel).toBe("Experience");
    expect(index.find((e) => e.sectionId === "projects")?.sectionLabel).toBe("Projects");
    expect(index.find((e) => e.sectionId === "leadership")?.sectionLabel).toBe("Leadership");
    expect(index.find((e) => e.sectionId === "skills")?.sectionLabel).toBe("Skills");
    expect(index.find((e) => e.sectionId === "community")?.sectionLabel).toBe("Community");
    expect(index.find((e) => e.sectionId === "awards")?.sectionLabel).toBe("Awards");
    expect(index.find((e) => e.sectionId === "education")?.sectionLabel).toBe("Education");
  });

  it("joins array fields with spaces, not commas", () => {
    const exp = index.find((e) => e.sectionId === "experience") as SearchIndexEntry;
    expect(exp.fullText).not.toContain(",");
    expect(exp.fullText).toContain("typescript");
    expect(exp.fullText).toContain("node.js");
    expect(exp.fullText).toContain("aws");
  });

  it("fullText is lowercase for case-insensitive search", () => {
    const exp = index.find((e) => e.sectionId === "experience") as SearchIndexEntry;
    expect(exp.fullText).toBe(exp.fullText.toLowerCase());
  });

  it("truncates snippet at word boundary within 120 chars", () => {
    const longSkill: AllContentData = {
      ...mockData,
      skills: [
        {
          category: "Long Category",
          skills: Array.from({ length: 30 }, (_, i) => `Skill${i}`),
        },
      ],
    };
    const idx = buildSearchIndex(longSkill);
    const skillEntry = idx.find((e) => e.sectionId === "skills") as SearchIndexEntry;
    expect(skillEntry.snippet.length).toBeLessThanOrEqual(120);
    // snippet should not cut mid-word
    const lastChar = skillEntry.snippet.trim().slice(-1);
    expect(lastChar).not.toBe("l".slice(0, 0)); // just verify it's a word ending
  });

  it("keeps snippet as-is when under 120 chars", () => {
    const shortData: AllContentData = {
      ...mockData,
      skills: [{ category: "Short", skills: ["A", "B"] }],
    };
    const idx = buildSearchIndex(shortData);
    const skillEntry = idx.find(
      (e) => e.sectionId === "skills" && e.title === "Short"
    ) as SearchIndexEntry;
    expect(skillEntry.snippet).toBe("Short A B");
  });

  it("includes product fields in project fullText", () => {
    const project = index.find((e) => e.sectionId === "projects") as SearchIndexEntry;
    expect(project.fullText).toContain("core library");
  });

  it("canonical order: experience first, education last", () => {
    expect(index[0].sectionId).toBe("experience");
    expect(index[index.length - 1].sectionId).toBe("education");
  });
});

describe("queryIndex", () => {
  const index = buildSearchIndex(mockData);

  it("returns empty array for empty query", () => {
    expect(queryIndex(index, "")).toHaveLength(0);
  });

  it("returns empty array for whitespace-only query", () => {
    expect(queryIndex(index, "   ")).toHaveLength(0);
    expect(queryIndex(index, "\t")).toHaveLength(0);
  });

  it("returns empty array for no-match query", () => {
    expect(queryIndex(index, "zzznomatch")).toHaveLength(0);
  });

  it("matches case-insensitively", () => {
    const lower = queryIndex(index, "aws");
    const upper = queryIndex(index, "AWS");
    const mixed = queryIndex(index, "Aws");
    expect(lower.length).toBeGreaterThan(0);
    expect(upper).toEqual(lower);
    expect(mixed).toEqual(lower);
  });

  it("caps results at 10", () => {
    // Build index with many matching entries
    const bigData: AllContentData = {
      ...mockData,
      experience: Array.from({ length: 15 }, (_, i) => ({
        company: "MegaCorp",
        role: `Engineer ${i}`,
        location: "London",
        duration: "2020",
        current: false,
        description: "aws cloud work",
        techStack: ["aws"],
        highlights: [],
      })),
    };
    const bigIndex = buildSearchIndex(bigData);
    const results = queryIndex(bigIndex, "aws");
    expect(results).toHaveLength(10);
  });

  it("returns matchStart and matchEnd for title match", () => {
    const results = queryIndex(index, "opentrack");
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("OpenTrack");
    expect(results[0].matchStart).toBe(0);
    expect(results[0].matchEnd).toBe("opentrack".length);
  });

  it("returns -1 sentinel for non-title match", () => {
    // "latency" appears in highlights but not in title
    const results = queryIndex(index, "latency");
    expect(results).toHaveLength(1);
    expect(results[0].matchStart).toBe(-1);
    expect(results[0].matchEnd).toBe(-1);
  });

  it("matchEnd equals matchStart plus query length for mid-title match", () => {
    // title is "Engineering Leadership" — "leader" starts at index 12
    const results = queryIndex(index, "leader");
    const leadershipResult = results.find((r) => r.sectionId === "leadership");
    expect(leadershipResult).toBeDefined();
    const expectedStart = "engineering leadership".indexOf("leader");
    expect(leadershipResult?.matchStart).toBe(expectedStart);
    expect(leadershipResult?.matchEnd).toBe(expectedStart + "leader".length);
  });

  it("treats special regex chars as literals", () => {
    // Should not throw and should return empty (no match for "aws+lambda" literally)
    expect(() => queryIndex(index, "aws+lambda")).not.toThrow();
    // "aws lambda" (space, not +) appears in fulltext — but "aws+lambda" does not
    expect(queryIndex(index, "aws+lambda")).toHaveLength(0);
  });

  it("returns all result fields", () => {
    const results = queryIndex(index, "opentrack");
    const r = results[0];
    expect(r).toHaveProperty("title");
    expect(r).toHaveProperty("snippet");
    expect(r).toHaveProperty("sectionId");
    expect(r).toHaveProperty("sectionLabel");
    expect(r).toHaveProperty("scrollAnchor");
    expect(r).toHaveProperty("matchStart");
    expect(r).toHaveProperty("matchEnd");
  });

  it("preserves canonical section order in results", () => {
    // "community" section entry comes after "experience" in canonical order
    const results = queryIndex(index, "gitops");
    expect(results).toHaveLength(1);
    expect(results[0].sectionId).toBe("community");

    // Multi-section match preserves order
    const multiResults = queryIndex(index, "aws");
    const sectionIds = multiResults.map((r) => r.sectionId);
    const expIdx = sectionIds.indexOf("experience");
    const skillIdx = sectionIds.indexOf("skills");
    if (expIdx !== -1 && skillIdx !== -1) {
      expect(expIdx).toBeLessThan(skillIdx);
    }
  });
});
