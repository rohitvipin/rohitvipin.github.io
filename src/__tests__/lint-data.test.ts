import { describe, it, expect } from "vitest";
import { lintContent, validateSchema } from "../../utils/lint-data-core";

describe("lintContent - JSON validation", () => {
  it("accepts valid JSON", () => {
    const result = lintContent('{"name": "Rohit"}');
    expect(result.valid).toBe(true);
    expect(result.parseError).toBeUndefined();
  });

  it("rejects invalid JSON", () => {
    const result = lintContent("{bad json}");
    expect(result.valid).toBe(false);
    expect(result.parseError).toBeTruthy();
    expect(result.violations).toHaveLength(0);
  });

  it("stops at parse error — does not report char violations", () => {
    const result = lintContent("{bad \u2014 json}");
    expect(result.valid).toBe(false);
    expect(result.parseError).toBeTruthy();
    expect(result.violations).toHaveLength(0);
  });
});

describe("lintContent - forbidden characters", () => {
  it("detects em dash", () => {
    const result = lintContent('{"x": "foo \u2014 bar"}');
    expect(result.valid).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].label).toMatch("em dash");
  });

  it("detects en dash", () => {
    const result = lintContent('{"x": "foo \u2013 bar"}');
    expect(result.violations[0].label).toMatch("en dash");
  });

  it("detects ellipsis", () => {
    const result = lintContent('{"x": "wait\u2026"}');
    expect(result.violations[0].label).toMatch("ellipsis");
  });

  it("detects smart quotes", () => {
    const ldq = lintContent('{"x": "\u201Chello\u201D"}');
    expect(ldq.violations).toHaveLength(2);

    // \u2018 appears twice but includes() fires once per char type per line
    const lsq = lintContent('{"x": "\u2018it\u2019s\u2018"}');
    expect(lsq.violations).toHaveLength(2);
  });

  it("reports correct 1-indexed line number", () => {
    const raw = '{"a": "ok",\n"b": "bad \u2014 value"}';
    const result = lintContent(raw);
    expect(result.violations[0].line).toBe(2);
  });

  it("reports multiple violations on same line", () => {
    const result = lintContent('{"x": "\u2014 and \u2013"}');
    expect(result.violations).toHaveLength(2);
    expect(result.violations.map((v) => v.line)).toEqual([1, 1]);
  });

  it("passes clean JSON with no violations", () => {
    const result = lintContent('{"name": "Rohit", "role": "Director of Engineering"}');
    expect(result.valid).toBe(true);
    expect(result.violations).toHaveLength(0);
  });
});

describe("validateSchema - Zod-backed validation", () => {
  const validProfileJson = JSON.stringify({
    name: "Test",
    title: "Engineer",
    headline: "headline",
    location: "London",
    bio: "bio",
    email: "test@example.com",
    phone: "+44-0000",
    years_of_experience: 5,
    timezone: "UTC",
    availability_status: "open",
    github_avatar: "https://avatars.githubusercontent.com/u/1",
    key_metrics: [{ label: "L", value: "V", detail: "D" }],
  });

  it("returns no errors for valid profile.json", () => {
    expect(validateSchema(validProfileJson, "profile.json")).toHaveLength(0);
  });

  it("reports invalid availability_status enum", () => {
    const bad = JSON.stringify({
      ...JSON.parse(validProfileJson),
      availability_status: "available",
    });
    const errors = validateSchema(bad, "profile.json");
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toMatch("availability_status");
  });

  it("reports invalid email", () => {
    const bad = JSON.stringify({ ...JSON.parse(validProfileJson), email: "not-an-email" });
    const errors = validateSchema(bad, "profile.json");
    expect(errors.length).toBeGreaterThan(0);
  });

  it("reports non-URL github_avatar", () => {
    const bad = JSON.stringify({ ...JSON.parse(validProfileJson), github_avatar: "not-a-url" });
    const errors = validateSchema(bad, "profile.json");
    expect(errors.length).toBeGreaterThan(0);
  });

  it("returns no errors for valid skills.json array", () => {
    const json = JSON.stringify([{ category: "Frontend", skills: ["React"] }]);
    expect(validateSchema(json, "skills.json")).toHaveLength(0);
  });

  it("returns empty array for unknown file", () => {
    expect(validateSchema("{}", "unknown.json")).toHaveLength(0);
  });

  it("returns empty array on invalid JSON", () => {
    expect(validateSchema("{bad json}", "profile.json")).toHaveLength(0);
  });
});
