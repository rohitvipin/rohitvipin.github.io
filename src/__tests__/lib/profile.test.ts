import { describe, it, expect } from "vitest";
import { getInitials } from "@/lib/profile";

describe("getInitials", () => {
  it("returns first two initials uppercase", () => {
    expect(getInitials("Rohit Vipin Mathews")).toBe("RV");
  });

  it("single word returns one initial", () => {
    expect(getInitials("Rohit")).toBe("R");
  });

  it("empty string returns fallback", () => {
    expect(getInitials("")).toBe("?");
  });

  it("trims to two characters for long names", () => {
    expect(getInitials("John Michael Andrew Doe")).toBe("JM");
  });
});
