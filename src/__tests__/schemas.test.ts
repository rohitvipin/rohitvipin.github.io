import { describe, it, expect } from "vitest";
import {
  ProfileSchema,
  ExperienceSchema,
  ProjectSchema,
  SkillCategorySchema,
  EducationSchema,
  SocialSchema,
  AwardSchema,
  CommunityEntrySchema,
  LeadershipSchema,
  ImpactStorySchema,
  FILE_ZSCHEMAS,
} from "@/lib/schemas";

// ── ProfileSchema ─────────────────────────────────────────────────────────────

const validProfile = {
  name: "Test User",
  title: "Engineer",
  headline: "headline",
  location: "London, UK",
  bio: "bio text",
  email: "test@example.com",
  phone: "+44-1234567890",
  years_of_experience: 5,
  timezone: "UTC",
  availability_status: "open" as const,
  github_avatar: "https://avatars.githubusercontent.com/u/1",
  key_metrics: [{ label: "Metric", value: "10", detail: "detail" }],
};

describe("ProfileSchema", () => {
  it("parses valid profile", () => {
    const result = ProfileSchema.parse(validProfile);
    expect(result.name).toBe("Test User");
    expect(result.availability_status).toBe("open");
  });

  it("accepts all valid availability_status values", () => {
    for (const status of ["open", "closed", "passive"] as const) {
      expect(
        ProfileSchema.parse({ ...validProfile, availability_status: status }).availability_status
      ).toBe(status);
    }
  });

  it("rejects invalid availability_status", () => {
    expect(() =>
      ProfileSchema.parse({ ...validProfile, availability_status: "available" })
    ).toThrow();
  });

  it("rejects invalid email", () => {
    expect(() => ProfileSchema.parse({ ...validProfile, email: "not-an-email" })).toThrow();
  });

  it("rejects non-URL github_avatar", () => {
    expect(() => ProfileSchema.parse({ ...validProfile, github_avatar: "not-a-url" })).toThrow();
  });

  it("rejects non-positive years_of_experience", () => {
    expect(() => ProfileSchema.parse({ ...validProfile, years_of_experience: 0 })).toThrow();
    expect(() => ProfileSchema.parse({ ...validProfile, years_of_experience: -1 })).toThrow();
  });

  it("rejects fractional years_of_experience", () => {
    expect(() => ProfileSchema.parse({ ...validProfile, years_of_experience: 5.5 })).toThrow();
  });

  it("accepts optional profile_picture and tags", () => {
    const result = ProfileSchema.parse({ ...validProfile, profile_picture: "", tags: ["Speaker"] });
    expect(result.profile_picture).toBe("");
    expect(result.tags).toEqual(["Speaker"]);
  });

  it("rejects missing required field", () => {
    const { name: _name, ...withoutName } = validProfile;
    expect(() => ProfileSchema.parse(withoutName)).toThrow();
  });

  it("validates key_metrics tier enum", () => {
    const with_tier = ProfileSchema.parse({
      ...validProfile,
      key_metrics: [{ label: "L", value: "V", detail: "D", tier: "primary" }],
    });
    expect(with_tier.key_metrics[0].tier).toBe("primary");

    expect(() =>
      ProfileSchema.parse({
        ...validProfile,
        key_metrics: [{ label: "L", value: "V", detail: "D", tier: "invalid" }],
      })
    ).toThrow();
  });
});

// ── ExperienceSchema ──────────────────────────────────────────────────────────

const validExperience = {
  company: "Acme Corp",
  role: "Director",
  location: "London",
  duration: "2020 - Present",
  current: true,
  description: "Led engineering team",
  techStack: ["TypeScript", "React"],
  highlights: ["Scaled to 100 engineers"],
};

describe("ExperienceSchema", () => {
  it("parses valid entry", () => {
    expect(ExperienceSchema.parse(validExperience).company).toBe("Acme Corp");
  });

  it("rejects non-boolean current", () => {
    expect(() => ExperienceSchema.parse({ ...validExperience, current: "yes" })).toThrow();
  });

  it("rejects empty techStack strings", () => {
    expect(() => ExperienceSchema.parse({ ...validExperience, techStack: [""] })).toThrow();
  });
});

// ── ProjectSchema ─────────────────────────────────────────────────────────────

const validProject = {
  name: "Platform",
  domain: "Education",
  client: "Acme",
  role: "Architect",
  duration: "2021 - 2023",
  description: "Built the platform",
  products: [{ name: "App", description: "Mobile app" }],
  highlights: ["99.9% uptime"],
  tech: ["AWS", "React"],
};

describe("ProjectSchema", () => {
  it("parses valid project", () => {
    expect(ProjectSchema.parse(validProject).name).toBe("Platform");
  });

  it("accepts optional github URL", () => {
    const result = ProjectSchema.parse({ ...validProject, github: "https://github.com/org/repo" });
    expect(result.github).toBe("https://github.com/org/repo");
  });

  it("rejects invalid github URL", () => {
    expect(() => ProjectSchema.parse({ ...validProject, github: "not-a-url" })).toThrow();
  });
});

// ── SkillCategorySchema ───────────────────────────────────────────────────────

describe("SkillCategorySchema", () => {
  it("parses valid category", () => {
    expect(SkillCategorySchema.parse({ category: "Frontend", skills: ["React"] }).category).toBe(
      "Frontend"
    );
  });

  it("rejects empty skills array", () => {
    expect(() => SkillCategorySchema.parse({ category: "Frontend", skills: [] })).toThrow();
  });
});

// ── EducationSchema ───────────────────────────────────────────────────────────

describe("EducationSchema", () => {
  it("parses valid entry", () => {
    const result = EducationSchema.parse({
      degree: "B.Tech",
      institution: "MIT",
      location: "Cambridge",
      year: "2012",
    });
    expect(result.degree).toBe("B.Tech");
  });
});

// ── SocialSchema ──────────────────────────────────────────────────────────────

describe("SocialSchema", () => {
  it("accepts https URLs", () => {
    const result = SocialSchema.parse({
      platform: "GitHub",
      url: "https://github.com/user",
      icon: "github",
    });
    expect(result.url).toMatch(/^https/);
  });

  it("accepts mailto: URLs", () => {
    const result = SocialSchema.parse({
      platform: "Email",
      url: "mailto:user@example.com",
      icon: "email",
    });
    expect(result.url).toMatch(/^mailto/);
  });

  it("rejects bare http or relative URLs", () => {
    expect(() => SocialSchema.parse({ platform: "X", url: "/relative", icon: "x" })).toThrow();
    expect(() => SocialSchema.parse({ platform: "X", url: "not-a-url", icon: "x" })).toThrow();
  });
});

// ── AwardSchema ───────────────────────────────────────────────────────────────

describe("AwardSchema", () => {
  it("parses valid award with string year", () => {
    const result = AwardSchema.parse({
      title: "Award",
      organization: "Org",
      year: "2020",
      description: "desc",
    });
    expect(result.year).toBe("2020");
  });

  it("accepts null year", () => {
    const result = AwardSchema.parse({
      title: "Award",
      organization: "Org",
      year: null,
      description: "desc",
    });
    expect(result.year).toBeNull();
  });

  it("rejects number year", () => {
    expect(() =>
      AwardSchema.parse({ title: "Award", organization: "Org", year: 2020, description: "desc" })
    ).toThrow();
  });
});

// ── CommunityEntrySchema ──────────────────────────────────────────────────────

describe("CommunityEntrySchema", () => {
  it("parses valid entry with optional location", () => {
    const result = CommunityEntrySchema.parse({
      type: "Meetup",
      title: "XHackers",
      description: "desc",
      highlights: ["500+ attendees"],
    });
    expect(result.location).toBeUndefined();
  });

  it("accepts optional location when present", () => {
    const result = CommunityEntrySchema.parse({
      type: "Meetup",
      title: "XHackers",
      location: "Chennai",
      description: "desc",
      highlights: [],
    });
    expect(result.location).toBe("Chennai");
  });
});

// ── LeadershipSchema ──────────────────────────────────────────────────────────

describe("LeadershipSchema", () => {
  it("parses valid leadership object", () => {
    const result = LeadershipSchema.parse({
      title: "Leadership",
      sections: [{ title: "Team building", description: "Built teams" }],
    });
    expect(result.sections).toHaveLength(1);
  });

  it("rejects empty sections array", () => {
    expect(() => LeadershipSchema.parse({ title: "Leadership", sections: [] })).toThrow();
  });
});

// ── ImpactStorySchema ─────────────────────────────────────────────────────────

const validImpactStory = {
  id: "k12-hcm",
  title: "K-12 Platform Modernisation",
  domain: "Education",
  problem: "Legacy platform could not scale.",
  scope: "350+ engineers across two geos.",
  led: "Full engineering org from architecture through delivery.",
  result: "Unified cloud-native platform with 45% fewer incidents.",
  metrics: ["30%+ productivity lift", "45% incident reduction"],
};

describe("ImpactStorySchema", () => {
  it("parses valid impact story", () => {
    expect(ImpactStorySchema.parse(validImpactStory).id).toBe("k12-hcm");
  });

  it("rejects missing required fields", () => {
    const { metrics: _m, ...withoutMetrics } = validImpactStory;
    expect(() => ImpactStorySchema.parse(withoutMetrics)).toThrow();
  });

  it.each(["id", "title", "domain", "problem", "scope", "led", "result"] as const)(
    "rejects empty string for required field: %s",
    (field) => {
      expect(() => ImpactStorySchema.parse({ ...validImpactStory, [field]: "" })).toThrow();
    }
  );

  it("rejects empty metrics array", () => {
    expect(() => ImpactStorySchema.parse({ ...validImpactStory, metrics: [] })).toThrow();
  });

  it("rejects id that does not match slug pattern", () => {
    expect(() => ImpactStorySchema.parse({ ...validImpactStory, id: "Has Spaces" })).toThrow();
    expect(() => ImpactStorySchema.parse({ ...validImpactStory, id: "1-starts-digit" })).toThrow();
  });

  it("accepts valid slugs with hyphens and internal digits", () => {
    expect(ImpactStorySchema.parse({ ...validImpactStory, id: "story-1" }).id).toBe("story-1");
    expect(ImpactStorySchema.parse({ ...validImpactStory, id: "k12-platform" }).id).toBe(
      "k12-platform"
    );
  });
});

// ── FILE_ZSCHEMAS coverage ────────────────────────────────────────────────────

describe("FILE_ZSCHEMAS", () => {
  it("covers all 11 data files", () => {
    const expected = [
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
    for (const file of expected) {
      expect(FILE_ZSCHEMAS[file]).toBeDefined();
    }
  });
});
