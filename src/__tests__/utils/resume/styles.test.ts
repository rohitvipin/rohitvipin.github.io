import { vi, describe, it, expect } from "vitest";

vi.mock("@react-pdf/renderer", () => ({
  StyleSheet: {
    create: <T extends Record<string, unknown>>(s: T): T => s,
  },
}));

import { styles } from "../../../../utils/resume/styles";

describe("resume styles", () => {
  it("exports page layout style", () => {
    expect(styles).toHaveProperty("page");
  });

  it("exports header style", () => {
    expect(styles).toHaveProperty("header");
  });

  it("exports section and entry styles", () => {
    expect(styles).toHaveProperty("section");
    expect(styles).toHaveProperty("entry");
  });

  it("exports bullet styles", () => {
    expect(styles).toHaveProperty("bulletRow");
    expect(styles).toHaveProperty("bulletText");
  });

  it("exports skill layout styles", () => {
    expect(styles).toHaveProperty("skillRow");
    expect(styles).toHaveProperty("skillLabel");
    expect(styles).toHaveProperty("skillValue");
  });
});
