import { describe, it, expect, vi, beforeEach } from "vitest";

const validProfile = {
  name: "Test User",
  title: "Director",
  headline: "Test headline.",
  location: "Remote",
  bio: "Bio paragraph.",
  bio_quote: "A quote.",
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
  key_metrics: [{ label: "Engineers Led", value: "100+", detail: "across teams", tier: "primary" }],
  value_propositions: [{ audience: "Track Record", value: "5 years in leadership" }],
};

vi.mock("../../../data/experience.json", () => ({ default: [] }));
vi.mock("../../../data/projects.json", () => ({ default: [] }));
vi.mock("../../../data/skills.json", () => ({ default: [] }));
vi.mock("../../../data/education.json", () => ({ default: [] }));
vi.mock("../../../data/socials.json", () => ({ default: [] }));
vi.mock("../../../data/awards.json", () => ({ default: [] }));
vi.mock("../../../data/community.json", () => ({ default: [] }));
vi.mock("../../../data/leadership.json", () => ({
  default: { title: "Technical Depth", sections: [{ title: "AI", description: "Shipped AI." }] },
}));
vi.mock("../../../data/nav.json", () => ({ default: [] }));
vi.mock("../../../data/impact.json", () => ({ default: [] }));

describe("parseOrThrow error path", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("throws with annotated message when profile data is invalid", async () => {
    vi.doMock("../../../data/profile.json", () => ({ default: null }));
    await expect(() => import("@/lib/data")).rejects.toThrow("[data] profile validation failed");
  });

  it("loads successfully with valid profile data", async () => {
    vi.doMock("../../../data/profile.json", () => ({ default: validProfile }));
    const { profile } = await import("@/lib/data");
    expect(profile.name).toBe("Test User");
  });
});
