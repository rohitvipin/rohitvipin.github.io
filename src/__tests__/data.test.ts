import { describe, it, expect } from "vitest";
import {
  profile,
  experience,
  projects,
  skills,
  education,
  socials,
  awards,
  community,
  leadership,
} from "@/lib/data";

describe("profile", () => {
  it("has required string fields", () => {
    expect(typeof profile.name).toBe("string");
    expect(profile.name.length).toBeGreaterThan(0);
    expect(typeof profile.title).toBe("string");
    expect(typeof profile.email).toBe("string");
    expect(typeof profile.github_avatar).toBe("string");
  });

  it("has valid availability_status", () => {
    expect(["open", "closed", "passive"]).toContain(profile.availability_status);
  });

  it("has positive years_of_experience", () => {
    expect(profile.years_of_experience).toBeGreaterThan(0);
  });

  it("has key_metrics array with required fields", () => {
    expect(Array.isArray(profile.key_metrics)).toBe(true);
    expect(profile.key_metrics.length).toBeGreaterThan(0);
    for (const m of profile.key_metrics) {
      expect(typeof m.label).toBe("string");
      expect(typeof m.value).toBe("string");
      expect(typeof m.detail).toBe("string");
    }
  });
});

describe("experience", () => {
  it("is non-empty array", () => {
    expect(Array.isArray(experience)).toBe(true);
    expect(experience.length).toBeGreaterThan(0);
  });

  it("each entry has required fields", () => {
    for (const e of experience) {
      expect(typeof e.company).toBe("string");
      expect(typeof e.role).toBe("string");
      expect(typeof e.duration).toBe("string");
      expect(typeof e.current).toBe("boolean");
      expect(Array.isArray(e.techStack)).toBe(true);
      expect(Array.isArray(e.highlights)).toBe(true);
    }
  });

  it("exactly one entry is current", () => {
    const current = experience.filter((e) => e.current);
    expect(current).toHaveLength(1);
  });
});

describe("projects", () => {
  it("is non-empty array", () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it("each project has required fields", () => {
    for (const p of projects) {
      expect(typeof p.name).toBe("string");
      expect(typeof p.client).toBe("string");
      expect(typeof p.role).toBe("string");
      expect(Array.isArray(p.tech)).toBe(true);
      expect(Array.isArray(p.highlights)).toBe(true);
    }
  });

  it("optional github field is a string when present", () => {
    for (const p of projects) {
      if (p.github !== undefined) {
        expect(typeof p.github).toBe("string");
        expect(p.github.startsWith("https://")).toBe(true);
      }
    }
  });
});

describe("skills", () => {
  it("is non-empty array of categories", () => {
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);
  });

  it("each category has a name and non-empty skills list", () => {
    for (const s of skills) {
      expect(typeof s.category).toBe("string");
      expect(Array.isArray(s.skills)).toBe(true);
      expect(s.skills.length).toBeGreaterThan(0);
    }
  });
});

describe("education", () => {
  it("is non-empty array", () => {
    expect(Array.isArray(education)).toBe(true);
    expect(education.length).toBeGreaterThan(0);
  });

  it("each entry has required fields", () => {
    for (const e of education) {
      expect(typeof e.degree).toBe("string");
      expect(typeof e.institution).toBe("string");
      expect(typeof e.year).toBe("string");
    }
  });
});

describe("socials", () => {
  it("is non-empty array", () => {
    expect(Array.isArray(socials)).toBe(true);
    expect(socials.length).toBeGreaterThan(0);
  });

  it("each social has platform, url, and icon", () => {
    for (const s of socials) {
      expect(typeof s.platform).toBe("string");
      expect(typeof s.url).toBe("string");
      expect(s.url.startsWith("https://") || s.url.startsWith("mailto:")).toBe(true);
      expect(typeof s.icon).toBe("string");
    }
  });
});

describe("awards", () => {
  it("is non-empty array", () => {
    expect(Array.isArray(awards)).toBe(true);
    expect(awards.length).toBeGreaterThan(0);
  });

  it("each award has title and organization", () => {
    for (const a of awards) {
      expect(typeof a.title).toBe("string");
      expect(typeof a.organization).toBe("string");
      expect(typeof a.description).toBe("string");
    }
  });
});

describe("community", () => {
  it("is non-empty array", () => {
    expect(Array.isArray(community)).toBe(true);
    expect(community.length).toBeGreaterThan(0);
  });

  it("each entry has type, title, and highlights", () => {
    for (const c of community) {
      expect(typeof c.type).toBe("string");
      expect(typeof c.title).toBe("string");
      expect(Array.isArray(c.highlights)).toBe(true);
    }
  });
});

describe("leadership", () => {
  it("has title and sections array", () => {
    expect(typeof leadership.title).toBe("string");
    expect(Array.isArray(leadership.sections)).toBe(true);
    expect(leadership.sections.length).toBeGreaterThan(0);
  });

  it("each section has title and description", () => {
    for (const s of leadership.sections) {
      expect(typeof s.title).toBe("string");
      expect(typeof s.description).toBe("string");
    }
  });
});
