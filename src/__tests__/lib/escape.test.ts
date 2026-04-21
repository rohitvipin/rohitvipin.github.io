import { describe, it, expect } from "vitest";
import { escapeJsonLd } from "@/lib/escape";

describe("escapeJsonLd", () => {
  it("passes normal strings through unchanged", () => {
    expect(escapeJsonLd("hello world")).toBe("hello world");
  });

  it("escapes & to \\u0026", () => {
    expect(escapeJsonLd("foo & bar")).toBe("foo \\u0026 bar");
  });

  it("escapes < to \\u003c", () => {
    expect(escapeJsonLd("a < b")).toBe("a \\u003c b");
  });

  it("escapes > to \\u003e", () => {
    expect(escapeJsonLd("a > b")).toBe("a \\u003e b");
  });

  it("neutralises </script> injection strings", () => {
    const input = '{"text": "</script><script>alert(1)</script>"}';
    const result = escapeJsonLd(input);
    expect(result).not.toContain("</script>");
    expect(result).toContain("\\u003c/script\\u003e");
  });

  it("escapes Unicode line separator (U+2028)", () => {
    const input = "line break";
    expect(escapeJsonLd(input)).toBe("line\\u2028break");
  });

  it("escapes Unicode paragraph separator (U+2029)", () => {
    const input = "para break";
    expect(escapeJsonLd(input)).toBe("para\\u2029break");
  });
});
