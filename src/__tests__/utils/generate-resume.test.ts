import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@react-pdf/renderer", () => ({
  renderToStream: vi.fn().mockResolvedValue({ pipe: vi.fn() }),
}));

vi.mock("fs", () => ({
  createWriteStream: vi.fn().mockReturnValue({ on: vi.fn() }),
  existsSync: vi.fn().mockReturnValue(false),
  default: {
    createWriteStream: vi.fn().mockReturnValue({ on: vi.fn() }),
    existsSync: vi.fn().mockReturnValue(false),
  },
}));

vi.mock("stream/promises", () => ({
  pipeline: vi.fn().mockResolvedValue(undefined),
  default: { pipeline: vi.fn().mockResolvedValue(undefined) },
}));

vi.mock("../../../utils/resume/ResumeDocument", () => ({
  ResumeDocument: () => null,
}));

vi.mock("../../../data/profile.json", () => ({
  default: { name: "Test", github_avatar: "https://avatars.githubusercontent.com/u/1?v=4" },
}));
vi.mock("../../../data/socials.json", () => ({ default: [] }));
vi.mock("../../../data/experience.json", () => ({ default: [] }));
vi.mock("../../../data/skills.json", () => ({ default: [] }));
vi.mock("../../../data/projects.json", () => ({ default: [] }));
vi.mock("../../../data/leadership.json", () => ({ default: { title: "", sections: [] } }));
vi.mock("../../../data/education.json", () => ({ default: [] }));
vi.mock("../../../data/community.json", () => ({ default: [] }));
vi.mock("../../../data/awards.json", () => ({ default: [] }));
vi.mock("../../../data/resume-config.json", () => ({ default: { sections: [] } }));

import { generate } from "../../../utils/generate-resume";

describe("generate-resume generate()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("completes without throwing", async () => {
    await expect(generate()).resolves.toBeUndefined();
  });
});
