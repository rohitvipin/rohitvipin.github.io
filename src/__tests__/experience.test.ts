import { describe, it, expect } from "vitest";
import { parseStartYear } from "../lib/duration";

describe("parseStartYear (src/lib/duration)", () => {
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

  it("handles bare year format", () => {
    expect(parseStartYear("2021")).toBe(2021);
  });

  it("returns first year found in string", () => {
    expect(parseStartYear("Feb Present - Jan 2024")).toBe(2024);
  });

  it("handles leading whitespace", () => {
    expect(parseStartYear("  Jun 2018  - Dec 2020")).toBe(2018);
  });
});
