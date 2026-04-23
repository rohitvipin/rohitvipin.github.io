import { describe, it, expect } from "vitest";
import {
  FILE_ZSCHEMAS,
  ExperienceSchema,
  ProjectSchema,
  EducationSchema,
  AwardSchema,
} from "@/lib/schemas";

describe("FILE_ZSCHEMAS parity", () => {
  // Data files loaded in src/lib/data.ts — must all be covered by FILE_ZSCHEMAS.
  // If data.ts imports a new file and FILE_ZSCHEMAS is not updated, lint-data silently
  // skips schema validation for that file.
  const DATA_TS_FILES = [
    "profile.json",
    "experience.json",
    "projects.json",
    "skills.json",
    "education.json",
    "socials.json",
    "awards.json",
    "community.json",
    "leadership.json",
    "nav.json",
    "impact.json",
  ];

  it("contains a schema entry for every data file loaded in data.ts", () => {
    const schemaKeys = Object.keys(FILE_ZSCHEMAS);
    for (const file of DATA_TS_FILES) {
      expect(schemaKeys, `FILE_ZSCHEMAS is missing an entry for "${file}"`).toContain(file);
    }
  });

  it("has no schema entries for files not loaded in data.ts (excluding resume-config.json)", () => {
    // resume-config.json is intentionally in FILE_ZSCHEMAS but NOT in data.ts
    // (consumed only by utils/generate-resume.ts). All other keys should map to data.ts files.
    const knownExtras = new Set(["resume-config.json"]);
    const schemaKeys = Object.keys(FILE_ZSCHEMAS);
    for (const key of schemaKeys) {
      if (!knownExtras.has(key)) {
        expect(
          DATA_TS_FILES,
          `FILE_ZSCHEMAS has an entry for "${key}" which is not loaded in data.ts`
        ).toContain(key);
      }
    }
  });
});

const baseExperience = {
  company: "Acme",
  role: "Engineer",
  location: "Remote",
  description: "desc",
  techStack: ["TypeScript"],
  highlights: ["shipped it"],
};

describe("ExperienceSchema cross-field validation", () => {
  it("accepts current:true with Present duration", () => {
    const result = ExperienceSchema.safeParse({
      ...baseExperience,
      duration: "January 2022 - Present",
      current: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts current:false with closed duration", () => {
    const result = ExperienceSchema.safeParse({
      ...baseExperience,
      duration: "January 2020 - December 2021",
      current: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects current:true with closed duration", () => {
    const result = ExperienceSchema.safeParse({
      ...baseExperience,
      duration: "January 2020 - December 2021",
      current: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects current:false with Present duration", () => {
    const result = ExperienceSchema.safeParse({
      ...baseExperience,
      duration: "January 2022 - Present",
      current: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects duration where end year < start year", () => {
    const result = ExperienceSchema.safeParse({
      ...baseExperience,
      duration: "January 2023 - December 2022",
      current: false,
    });
    expect(result.success).toBe(false);
  });

  it("accepts bare YYYY duration with current:false", () => {
    const result = ExperienceSchema.safeParse({
      ...baseExperience,
      duration: "2021",
      current: false,
    });
    expect(result.success).toBe(true);
  });
});

const baseProject = {
  name: "My Project",
  domain: "Tech",
  client: "Client",
  role: "Lead",
  description: "desc",
  products: [],
  highlights: [],
  tech: ["TypeScript"],
};

describe("ProjectSchema validation", () => {
  it("rejects duration where end year < start year", () => {
    const result = ProjectSchema.safeParse({
      ...baseProject,
      duration: "March 2023 - January 2022",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid date range", () => {
    const result = ProjectSchema.safeParse({
      ...baseProject,
      duration: "January 2022 - March 2023",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-https github URL", () => {
    const result = ProjectSchema.safeParse({
      ...baseProject,
      duration: "2022",
      github: "http://github.com/foo/bar",
    });
    expect(result.success).toBe(false);
  });

  it("accepts https github URL", () => {
    const result = ProjectSchema.safeParse({
      ...baseProject,
      duration: "2022",
      github: "https://github.com/foo/bar",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional id in kebab-case", () => {
    const result = ProjectSchema.safeParse({
      ...baseProject,
      duration: "2022",
      id: "my-project",
    });
    expect(result.success).toBe(true);
  });

  it("rejects id with uppercase letters", () => {
    const result = ProjectSchema.safeParse({
      ...baseProject,
      duration: "2022",
      id: "MyProject",
    });
    expect(result.success).toBe(false);
  });
});

describe("EducationSchema year format", () => {
  it("accepts YYYY format", () => {
    const result = EducationSchema.safeParse({
      degree: "B.Tech",
      institution: "MIT",
      location: "USA",
      year: "2009",
    });
    expect(result.success).toBe(true);
  });

  it("accepts YYYY-YYYY range format", () => {
    const result = EducationSchema.safeParse({
      degree: "B.Tech",
      institution: "MIT",
      location: "USA",
      year: "2005-2009",
    });
    expect(result.success).toBe(true);
  });

  it("rejects free-form year string", () => {
    const result = EducationSchema.safeParse({
      degree: "B.Tech",
      institution: "MIT",
      location: "USA",
      year: "ongoing",
    });
    expect(result.success).toBe(false);
  });
});

describe("AwardSchema year format", () => {
  it("accepts null year", () => {
    const result = AwardSchema.safeParse({
      title: "Award",
      organization: "Org",
      year: null,
      description: "desc",
    });
    expect(result.success).toBe(true);
  });

  it("accepts YYYY year", () => {
    const result = AwardSchema.safeParse({
      title: "Award",
      organization: "Org",
      year: "2021",
      description: "desc",
    });
    expect(result.success).toBe(true);
  });

  it("rejects free-form year string", () => {
    const result = AwardSchema.safeParse({
      title: "Award",
      organization: "Org",
      year: "last decade",
      description: "desc",
    });
    expect(result.success).toBe(false);
  });
});

describe("ImpactStory id uniqueness", () => {
  const impactSchema = FILE_ZSCHEMAS["impact.json"];

  const makeImpact = (id: string) => ({
    id,
    title: "Title",
    domain: "Domain",
    problem: "Problem",
    scope: "Scope",
    led: "Led",
    result: "Result",
    metrics: ["metric"],
  });

  it("accepts unique ids", () => {
    const result = impactSchema.safeParse([makeImpact("story-one"), makeImpact("story-two")]);
    expect(result.success).toBe(true);
  });

  it("rejects duplicate ids", () => {
    const result = impactSchema.safeParse([makeImpact("same-id"), makeImpact("same-id")]);
    expect(result.success).toBe(false);
  });
});
