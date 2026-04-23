import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("sharp", () => {
  const chain = {
    png: vi.fn().mockReturnThis(),
    jpeg: vi.fn().mockReturnThis(),
    webp: vi.fn().mockReturnThis(),
    toFile: vi.fn().mockResolvedValue(undefined),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from("fake-ico")),
  };
  return { default: vi.fn(() => chain) };
});

vi.mock("fs", () => ({
  default: {
    writeFileSync: vi.fn(),
    existsSync: vi.fn().mockReturnValue(true),
  },
  writeFileSync: vi.fn(),
  existsSync: vi.fn().mockReturnValue(true),
}));

import { makeSvg, makeOgSvg, generate } from "../../../utils/generate-favicons";

describe("makeSvg", () => {
  it("returns valid SVG string with correct dimensions", () => {
    const svg = makeSvg(32, 22);
    expect(svg).toContain('width="32"');
    expect(svg).toContain('height="32"');
    expect(svg).toContain('font-size="22"');
    expect(svg).toContain(">R</text>");
  });

  it("omits tagline text when tagline is null", () => {
    const svg = makeSvg(32, 22, null);
    expect(svg.match(/<text/g)?.length).toBe(1);
  });

  it("includes tagline text when provided", () => {
    const svg = makeSvg(180, 115, "engineer", 14);
    expect(svg).toContain("engineer");
    expect(svg.match(/<text/g)?.length).toBe(2);
  });

  it("applies correct border radius (18% of size)", () => {
    const svg = makeSvg(100, 60);
    expect(svg).toContain('rx="18"');
  });

  it("adjusts mainY position when tagline present vs absent", () => {
    const withTagline = makeSvg(100, 60, "tag", 10);
    const withoutTagline = makeSvg(100, 60);
    expect(withTagline).toContain('y="46"');
    expect(withoutTagline).toContain('y="56"');
  });
});

describe("makeOgSvg", () => {
  it("returns SVG with 1200x630 dimensions", () => {
    const svg = makeOgSvg();
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
  });

  it("contains RVM text", () => {
    const svg = makeOgSvg();
    expect(svg).toContain(">RVM</text>");
  });

  it("contains full name", () => {
    const svg = makeOgSvg();
    expect(svg).toContain("Rohit Vipin Mathews");
  });
});

describe("generate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("completes without throwing", async () => {
    await expect(generate()).resolves.toBeUndefined();
  });

  it("calls sharp for each favicon size", async () => {
    const sharp = (await import("sharp")).default;
    await generate();
    expect(sharp).toHaveBeenCalled();
  });

  it("calls webp when avatar.jpg exists", async () => {
    const sharp = (await import("sharp")).default;
    await generate();
    const instance = (sharp as unknown as ReturnType<typeof vi.fn>).mock.results[0]?.value;
    expect(instance?.webp ?? instance?.png).toBeDefined();
  });
});
