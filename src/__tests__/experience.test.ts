import { describe, it, expect } from "vitest";
import { parseStartYear } from "../../utils/resume/sections/Experience";

describe("parseStartYear", () => {
  it("parses standard duration format", () => {
    expect(parseStartYear("Feb 2020 - Jan 2024")).toBe(2020);
    expect(parseStartYear("Jan 2015 - Dec 2019")).toBe(2015);
  });

  it("handles 'Present' as end date", () => {
    expect(parseStartYear("Mar 2022 - Present")).toBe(2022);
  });

  it("returns 0 for missing year", () => {
    expect(parseStartYear("")).toBe(0);
    expect(parseStartYear("Some Role")).toBe(0);
  });

  it("handles no separator — uses full string as start token", () => {
    expect(parseStartYear("2021")).toBe(2021);
  });

  it("returns 0 for non-numeric last token", () => {
    expect(parseStartYear("Feb Present - Jan 2024")).toBe(0);
  });

  it("trims whitespace around start token", () => {
    expect(parseStartYear("  Jun 2018  - Dec 2020")).toBe(2018);
  });
});
