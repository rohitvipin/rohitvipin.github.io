import { describe, it, expect, vi } from "vitest";

vi.mock("../../data/profile.json", () => ({
  default: {
    name: "Test User",
    title: "Director",
    headline: "Test headline for the profile.",
    location: "Remote",
    bio: "Test bio paragraph one.\n\nTest bio paragraph two.",
    bio_quote: "A test engineering quote.",
    email: "test@example.com",
    years_of_experience: 14,
    timezone: "UTC",
    availability_status: "open",
    profile_picture: "",
    github_avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    cta_primary: "See Impact",
    open_to: "Open to Director roles",
    availability_note: "Available remotely.",
    tags: ["Platform Architecture"],
    key_metrics: [
      { label: "Engineers Led", value: "100+", detail: "across teams", tier: "primary" },
      { label: "Cost Reduction", value: "40%", detail: "$100K annually", tier: "secondary" },
    ],
    value_propositions: [{ audience: "Track Record", value: "5 years in leadership" }],
  },
}));

vi.mock("../../data/experience.json", () => ({
  default: [
    {
      company: "Acme Corp",
      role: "Director of Engineering",
      location: "Remote",
      duration: "April 2022 - Present",
      current: true,
      description: "Led engineering org.",
      highlights: ["Built platform"],
      techStack: ["TypeScript", "AWS"],
    },
    {
      company: "Beta Inc",
      role: "Staff Engineer",
      location: "Remote",
      duration: "January 2018 - December 2022",
      current: false,
      description: "Platform work.",
      highlights: ["Shipped product"],
      techStack: ["C#"],
    },
  ],
}));

vi.mock("../../data/projects.json", () => ({
  default: [
    {
      name: "K-12 Platform",
      domain: "Education",
      client: "Acme",
      role: "Architect",
      duration: "April 2022 - Present",
      description: "Built K-12 platform.",
      products: [],
      highlights: ["99.9% uptime"],
      tech: ["AWS", "React"],
    },
    {
      name: "OSS Library",
      domain: "Open Source",
      client: "Personal",
      role: "Author",
      duration: "2019",
      description: "NuGet package.",
      products: [],
      highlights: [],
      tech: ["C#"],
      github: "https://github.com/test/lib",
    },
  ],
}));

vi.mock("../../data/skills.json", () => ({
  default: [
    { category: "Cloud", skills: ["AWS", "Azure"] },
    { category: "Languages", skills: ["TypeScript", "C#"] },
  ],
}));

vi.mock("../../data/education.json", () => ({
  default: [
    {
      degree: "B.Tech Computer Science",
      institution: "Test University",
      location: "India",
      year: "2009",
    },
  ],
}));

vi.mock("../../data/socials.json", () => ({
  default: [
    { platform: "GitHub", url: "https://github.com/test", icon: "FaGithub" },
    { platform: "Email", url: "mailto:test@example.com", icon: "FiMail" },
  ],
}));

vi.mock("../../data/awards.json", () => ({
  default: [
    {
      title: "Best Engineer Award",
      organization: "Acme Corp",
      year: "2023",
      description: "Top performer.",
    },
  ],
}));

vi.mock("../../data/community.json", () => ({
  default: [
    {
      type: "Community Leadership",
      title: "XHackers Founder",
      description: "Founded XHackers user group.",
      highlights: ["Organised 20+ meetups"],
    },
  ],
}));

vi.mock("../../data/leadership.json", () => ({
  default: {
    title: "Technical Depth",
    sections: [{ title: "AI Engineering", description: "Shipped production AI systems." }],
  },
}));

vi.mock("../../data/nav.json", () => ({
  default: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
  ],
}));

vi.mock("../../data/impact.json", () => ({
  default: [
    {
      id: "test-story",
      title: "K-12 Platform Modernisation",
      domain: "Education Technology",
      problem: "Legacy system needed modernisation.",
      scope: "350+ engineers across two geographies.",
      led: "Full architecture design.",
      result: "45% incident reduction.",
      metrics: ["30%+ productivity lift", "95% AI accuracy"],
    },
    {
      id: "another-story",
      title: "Logistics Rebuild",
      domain: "Freight",
      problem: "Legacy system could not scale.",
      scope: "Full platform rewrite.",
      led: "Architecture and technology selection.",
      result: "500K+ daily transactions.",
      metrics: ["$2M+ investment secured"],
    },
  ],
}));

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
  navLinks,
  impact,
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

describe("navLinks", () => {
  it("is non-empty array", () => {
    expect(Array.isArray(navLinks)).toBe(true);
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it("each link has non-empty label and anchor href", () => {
    for (const link of navLinks) {
      expect(typeof link.label).toBe("string");
      expect(link.label.length).toBeGreaterThan(0);
      expect(link.href.startsWith("#")).toBe(true);
    }
  });
});

describe("impact", () => {
  it("is non-empty array", () => {
    expect(Array.isArray(impact)).toBe(true);
    expect(impact.length).toBeGreaterThan(0);
  });

  it("each story has required fields", () => {
    for (const story of impact) {
      expect(typeof story.id).toBe("string");
      expect(story.id.length).toBeGreaterThan(0);
      expect(typeof story.title).toBe("string");
      expect(typeof story.domain).toBe("string");
      expect(typeof story.problem).toBe("string");
      expect(typeof story.scope).toBe("string");
      expect(typeof story.led).toBe("string");
      expect(typeof story.result).toBe("string");
      expect(Array.isArray(story.metrics)).toBe(true);
      expect(story.metrics.length).toBeGreaterThan(0);
    }
  });

  it("each story id matches slug pattern", () => {
    for (const story of impact) {
      expect(story.id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });
});
