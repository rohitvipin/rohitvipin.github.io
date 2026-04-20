import { describe, it, expect } from "vitest";
import { lintContent } from "../../utils/lint-data-core";

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
