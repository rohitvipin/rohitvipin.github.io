import { describe, it, expect } from "vitest";
import { escapeJsonLd } from "@/lib/escape";

describe("escapeJsonLd", () => {
  it("leaves plain strings unchanged", () => {
    expect(escapeJsonLd("hello world")).toBe("hello world");
  });

  it("escapes & to \\u0026", () => {
    expect(escapeJsonLd("a & b")).toBe("a \\u0026 b");
  });

  it("escapes < to \\u003c", () => {
    expect(escapeJsonLd("a < b")).toBe("a \\u003c b");
  });

  it("escapes > to \\u003e", () => {
    expect(escapeJsonLd("a > b")).toBe("a \\u003e b");
  });

  it("neutralises </script> injection pattern", () => {
    const input = '{"text": "</script><script>alert(1)</script>"}';
    const result = escapeJsonLd(input);
    expect(result).not.toContain("</script>");
    expect(result).toContain("\\u003c/script\\u003e");
  });

  it("escapes U+2028 line separator", () => {
    expect(escapeJsonLd("line\u2028break")).toBe("line\\u2028break");
  });

  it("escapes U+2029 paragraph separator", () => {
    expect(escapeJsonLd("para\u2029break")).toBe("para\\u2029break");
  });

  it("escapes all five special characters together", () => {
    expect(escapeJsonLd(`<>&\u2028\u2029`)).toBe("\\u003c\\u003e\\u0026\\u2028\\u2029");
  });
});
