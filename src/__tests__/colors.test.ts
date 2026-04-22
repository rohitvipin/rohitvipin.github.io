import { describe, it, expect } from "vitest";
import { getCompanyColor, getDomainColor } from "@/lib/colors";

const FALLBACK = "#6366f1";

describe("getCompanyColor", () => {
  it("returns mapped color for known company", () => {
    expect(getCompanyColor("CES IT")).toBe("#6366f1");
    expect(getCompanyColor("Vofox Solutions")).toBe("#22d3ee");
    expect(getCompanyColor("Essel Swolutions")).toBe("#f59e0b");
  });

  it("returns fallback for unknown company", () => {
    expect(getCompanyColor("Unknown Corp")).toBe(FALLBACK);
    expect(getCompanyColor("")).toBe(FALLBACK);
  });

  it("is case-sensitive", () => {
    expect(getCompanyColor("ces")).toBe(FALLBACK);
    expect(getCompanyColor("vofox solutions")).toBe(FALLBACK);
  });
});

describe("getDomainColor", () => {
  it("returns color for exact prefix match", () => {
    expect(getDomainColor("Education Technology")).toBe("#6366f1");
    expect(getDomainColor("Agriculture Platform")).toBe("#22c55e");
    expect(getDomainColor("Logistics App")).toBe("#fbbf24");
    expect(getDomainColor("Hospitality SaaS")).toBe("#ec4899");
  });

  it("returns fallback for unknown domain", () => {
    expect(getDomainColor("FinTech")).toBe(FALLBACK);
    expect(getDomainColor("")).toBe(FALLBACK);
  });

  it("open source sub-domains match before generic Open Source", () => {
    expect(getDomainColor("Open Source / Mobile SDK")).toBe("#22d3ee");
    expect(getDomainColor("Open Source / Developer Tooling CLI")).toBe("#8b5cf6");
    expect(getDomainColor("Open Source / Cloud Native")).toBe("#fb923c");
    // generic prefix
    expect(getDomainColor("Open Source Library")).toBe("#22d3ee");
  });

  it("does not match domain that merely contains prefix mid-string", () => {
    // "MyK-12" does not start with "K-12"
    expect(getDomainColor("MyK-12 Platform")).toBe(FALLBACK);
  });
});
