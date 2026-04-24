import { describe, it, expect, vi, beforeEach } from "vitest";

const _state = {
  pipelineShouldReject: false,
  statSyncSize: 100_000,
};

vi.mock("@react-pdf/renderer", () => ({
  renderToStream: vi.fn().mockResolvedValue({ pipe: vi.fn() }),
}));

vi.mock("fs", () => ({
  createWriteStream: vi.fn().mockReturnValue({ on: vi.fn() }),
  existsSync: vi.fn().mockReturnValue(false),
  renameSync: vi.fn(),
  statSync: vi.fn(() => ({ size: _state.statSyncSize })),
  default: {
    createWriteStream: vi.fn().mockReturnValue({ on: vi.fn() }),
    existsSync: vi.fn().mockReturnValue(false),
    renameSync: vi.fn(),
    statSync: vi.fn(() => ({ size: _state.statSyncSize })),
  },
}));

vi.mock("stream/promises", () => ({
  pipeline: vi.fn(async () => {
    if (_state.pipelineShouldReject) {
      throw new Error("pipe broken");
    }
  }),
  default: {
    pipeline: vi.fn(async () => {
      if (_state.pipelineShouldReject) {
        throw new Error("pipe broken");
      }
    }),
  },
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
    _state.pipelineShouldReject = false;
    _state.statSyncSize = 100_000;
  });

  it("completes without throwing", async () => {
    await expect(generate()).resolves.toBeUndefined();
  });

  it("throws when pipeline rejects", async () => {
    _state.pipelineShouldReject = true;
    await expect(generate()).rejects.toThrow("pipe broken");
  });

  it("throws when PDF is suspiciously small (< 25000 bytes)", async () => {
    _state.statSyncSize = 24_999;
    await expect(generate()).rejects.toThrow("suspiciously small");
  });
});
