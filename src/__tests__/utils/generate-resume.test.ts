import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@react-pdf/renderer", () => ({
  renderToStream: vi.fn().mockResolvedValue({ pipe: vi.fn() }),
}));

vi.mock("fs", () => ({
  createWriteStream: vi.fn().mockReturnValue({ on: vi.fn() }),
  existsSync: vi.fn().mockReturnValue(false),
  renameSync: vi.fn(),
  statSync: vi.fn().mockReturnValue({ size: 100_000 }),
  default: {
    createWriteStream: vi.fn().mockReturnValue({ on: vi.fn() }),
    existsSync: vi.fn().mockReturnValue(false),
    renameSync: vi.fn(),
    statSync: vi.fn().mockReturnValue({ size: 100_000 }),
  },
}));

vi.mock("stream/promises", () => ({
  pipeline: vi.fn().mockResolvedValue(undefined),
  default: { pipeline: vi.fn().mockResolvedValue(undefined) },
}));

vi.mock("../../../utils/resume/ResumeDocument", () => ({
  ResumeDocument: () => null,
}));

vi.mock("@/lib/data", () => ({
  profile: {
    name: "Test",
    title: "Director",
    headline: "Test headline",
    location: "Kerala, India",
    bio: "Test bio",
    email: "test@test.com",
    years_of_experience: 15,
    timezone: "IST",
    availability_status: "open",
    github_avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    key_metrics: [],
  },
  socials: [],
  experience: [],
  skills: [],
  projects: [],
  leadership: { title: "", sections: [] },
  education: [],
  community: [],
  awards: [],
}));
vi.mock("../../../data/resume-config.json", () => ({
  default: {
    pageSize: "A4",
    font: "Helvetica",
    showKeyMetrics: true,
    sectionOrder: [],
    sections: {},
  },
}));

import { generate } from "../../../utils/generate-resume";

describe("generate-resume generate()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("completes without throwing", async () => {
    await expect(generate()).resolves.toBeUndefined();
  });
});
