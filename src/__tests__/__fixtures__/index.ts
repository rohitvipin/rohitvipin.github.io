import type { ExperienceEntry, Profile, Social, Project } from "@/types";

export const fixtureProfile: Profile = {
  name: "Test Person",
  title: "Engineering Lead",
  headline: "Headline copy with two short clauses to satisfy schema length.",
  location: "Singapore",
  bio: "Short bio for fixture.",
  email: "test@example.com",
  years_of_experience: 14,
  timezone: "GMT+8",
  availability_status: "open",
  github_avatar: "https://example.com/avatar.png",
  key_metrics: [{ tier: "primary", label: "Years", value: "14", detail: "shipping production" }],
  tags: ["TS", "React"],
  cta_primary: "See Impact",
  value_propositions: [],
};

export const fixtureSocials: readonly Social[] = [
  { platform: "GitHub", url: "https://github.com/test", icon: "github" },
];

export const fixtureExperience: ExperienceEntry = {
  company: "Test Co",
  role: "Director of Engineering",
  location: "Singapore",
  duration: "January 2024 - Present",
  current: true,
  description: "Description paragraph long enough for schema validation to accept the value.",
  techStack: ["TypeScript", "React"],
  highlights: ["Shipped X", "Led team Y"],
};

export const fixtureProject: Project = {
  name: "Demo Project",
  domain: "Test Domain",
  client: "Acme",
  role: "Lead",
  duration: "2024",
  description: "Description copy describing the project for fixture purposes.",
  products: [],
  highlights: ["Highlight A"],
  tech: ["TypeScript"],
};
