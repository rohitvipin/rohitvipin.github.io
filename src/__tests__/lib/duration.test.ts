import { describe, it, expect, vi } from "vitest";
import { parseStartYear, byStartYearDesc } from "@/lib/duration";

describe("parseStartYear", () => {
  it("parses year from month-year to present", () => {
    expect(parseStartYear("April 2024 - Present")).toBe(2024);
  });

  it("parses year from month-year to month-year", () => {
    expect(parseStartYear("April 2022 - March 2024")).toBe(2022);
  });

  it("parses year from full month names", () => {
    expect(parseStartYear("January 2012 - July 2013")).toBe(2012);
  });

  it("parses bare year string", () => {
    expect(parseStartYear("2018")).toBe(2018);
  });

  it("returns 0 and warns for unrecognised format", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parseStartYear("Present")).toBe(0);
    expect(warnSpy).toHaveBeenCalledWith('parseStartYear: no year found in "Present"');
    warnSpy.mockRestore();
  });
});

describe("byStartYearDesc", () => {
  it("sorts newer before older", () => {
    const items = [
      { duration: "2018", label: "old" },
      { duration: "April 2024 - Present", label: "new" },
      { duration: "April 2022 - March 2024", label: "mid" },
    ];
    items.sort(byStartYearDesc);
    expect(items.map((i) => i.label)).toEqual(["new", "mid", "old"]);
  });

  it("preserves relative order for equal years", () => {
    const items = [
      { duration: "2024", label: "a" },
      { duration: "2024", label: "b" },
    ];
    items.sort(byStartYearDesc);
    expect(items.map((i) => i.label)).toEqual(["a", "b"]);
  });
});
