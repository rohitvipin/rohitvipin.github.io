import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockReaddirSync, mockReadFileSync } = vi.hoisted(() => ({
  mockReaddirSync: vi.fn(),
  mockReadFileSync: vi.fn(),
}));

vi.mock("fs", () => ({
  readdirSync: mockReaddirSync,
  readFileSync: mockReadFileSync,
  default: { readdirSync: mockReaddirSync, readFileSync: mockReadFileSync },
}));

vi.mock("../../../utils/lint-data-core", () => ({
  lintContent: vi.fn(),
  validateSchema: vi.fn(),
}));

import { lintContent, validateSchema } from "../../../utils/lint-data-core";
import { run } from "../../../utils/lint-data";

describe("lint-data run()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReaddirSync.mockReturnValue(["profile.json"]);
    mockReadFileSync.mockReturnValue('{"name":"Test"}');
    vi.mocked(lintContent).mockReturnValue({ valid: true, violations: [], schemaErrors: [] });
    vi.mocked(validateSchema).mockReturnValue([]);
  });

  it("returns 0 when all files pass", () => {
    expect(run("/fake/data")).toBe(0);
  });

  it("returns 1 for a JSON parse error", () => {
    vi.mocked(lintContent).mockReturnValue({
      valid: false,
      parseError: "bad json",
      violations: [],
      schemaErrors: [],
    });
    expect(run("/fake/data")).toBe(1);
  });

  it("skips violations after parse error", () => {
    vi.mocked(lintContent).mockReturnValue({
      valid: false,
      parseError: "bad",
      violations: [{ line: 1, label: "em dash" }],
      schemaErrors: [],
    });
    expect(run("/fake/data")).toBe(1);
  });

  it("counts one error per char violation", () => {
    vi.mocked(lintContent).mockReturnValue({
      valid: false,
      violations: [
        { line: 1, label: "em dash" },
        { line: 2, label: "en dash" },
      ],
      schemaErrors: [],
    });
    expect(run("/fake/data")).toBe(2);
  });

  it("counts schema errors", () => {
    vi.mocked(validateSchema).mockReturnValue(["profile.json [name]: Required"]);
    expect(run("/fake/data")).toBe(1);
  });

  it("ignores non-JSON files", () => {
    mockReaddirSync.mockReturnValue(["profile.json", "README.md"]);
    expect(run("/fake/data")).toBe(0);
    expect(mockReadFileSync).toHaveBeenCalledTimes(1);
  });

  it("accumulates errors across multiple files", () => {
    mockReaddirSync.mockReturnValue(["a.json", "b.json"]);
    vi.mocked(lintContent).mockReturnValue({
      valid: false,
      violations: [{ line: 1, label: "em dash" }],
      schemaErrors: [],
    });
    expect(run("/fake/data")).toBe(2);
  });
});
