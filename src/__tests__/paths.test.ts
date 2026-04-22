import { describe, it, expect, vi, afterEach } from "vitest";

describe("avatarHref", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("defaults to root path when basePath is empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    vi.resetModules();
    const { avatarHref } = await import("@/lib/paths");
    expect(avatarHref).toBe("/avatar.jpg");
  });

  it("prepends basePath when set", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/portfolio");
    vi.resetModules();
    const { avatarHref } = await import("@/lib/paths");
    expect(avatarHref).toBe("/portfolio/avatar.jpg");
  });

  it("strips trailing slash from basePath", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/portfolio/");
    vi.resetModules();
    const { avatarHref } = await import("@/lib/paths");
    expect(avatarHref).toBe("/portfolio/avatar.jpg");
  });
});

describe("resumeHref", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("defaults to root path when basePath is empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    vi.resetModules();
    const { resumeHref } = await import("@/lib/paths");
    expect(resumeHref).toBe("/Rohit_Vipin_Mathews_Resume.pdf");
  });

  it("prepends basePath when set", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/portfolio");
    vi.resetModules();
    const { resumeHref } = await import("@/lib/paths");
    expect(resumeHref).toBe("/portfolio/Rohit_Vipin_Mathews_Resume.pdf");
  });

  it("strips trailing slash from basePath", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/portfolio/");
    vi.resetModules();
    const { resumeHref } = await import("@/lib/paths");
    expect(resumeHref).toBe("/portfolio/Rohit_Vipin_Mathews_Resume.pdf");
  });

  it("filename ends with the PDF name", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    vi.resetModules();
    const { resumeHref } = await import("@/lib/paths");
    expect(resumeHref).toMatch(/Rohit_Vipin_Mathews_Resume\.pdf$/);
  });
});
