// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter", className: "mock-inter" }),
}));

vi.mock("@/lib/data", () => ({
  socials: [],
  profile: { knows_about: ["AWS", "Engineering Leadership"] },
  experience: [],
  education: [],
}));

vi.mock("@/lib/escape", () => ({
  escapeJsonLd: vi.fn((s: string) => s),
}));

vi.mock("@/lib/jsonld", () => ({
  buildPersonJsonLd: () => ({ "@type": "Person", name: "Test" }),
}));

vi.mock("@/lib/paths", () => ({
  avatarHref: "/avatar.jpg",
  avatarWebpHref: "/avatar.webp",
  resumeHref: "/resume.pdf",
}));

import { escapeJsonLd } from "@/lib/escape";
import RootLayout, { metadata, viewport } from "@/app/layout";

describe("metadata", () => {
  it("has title containing Rohit Vipin Mathews", () => {
    expect(JSON.stringify(metadata.title)).toContain("Rohit Vipin Mathews");
  });

  it("has robots set to index and follow", () => {
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("has OpenGraph type website", () => {
    expect((metadata.openGraph as { type: string }).type).toBe("website");
  });

  it("has Twitter card summary_large_image", () => {
    expect((metadata.twitter as { card: string }).card).toBe("summary_large_image");
  });
});

describe("viewport", () => {
  it("has two theme color entries for dark and light", () => {
    expect(viewport.themeColor).toHaveLength(2);
  });

  it("supports both color schemes", () => {
    expect(viewport.colorScheme).toBe("dark light");
  });
});

describe("RootLayout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls escapeJsonLd before injecting JSON-LD into DOM", () => {
    render(<RootLayout>children</RootLayout>);
    expect(vi.mocked(escapeJsonLd)).toHaveBeenCalledOnce();
  });

  it("renders children", () => {
    render(<RootLayout>test content</RootLayout>);
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("renders skip to main content link", () => {
    render(<RootLayout>children</RootLayout>);
    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
  });

  it("includes JSON-LD script tag", () => {
    render(<RootLayout>children</RootLayout>);
    expect(document.querySelector('script[type="application/ld+json"]')).toBeInTheDocument();
  });

  it("preloads WebP avatar", () => {
    render(<RootLayout>children</RootLayout>);
    const webpLink = document.querySelector('link[rel="preload"][type="image/webp"]');
    expect(webpLink).toBeInTheDocument();
    expect(webpLink).toHaveAttribute("href", "/avatar.webp");
  });

  it("does not preload JPEG avatar", () => {
    render(<RootLayout>children</RootLayout>);
    const jpegLink = document.querySelector('link[rel="preload"][type="image/jpeg"]');
    expect(jpegLink).not.toBeInTheDocument();
  });

  it("CSP meta tag omits frame-ancestors (not honoured in meta elements)", () => {
    render(<RootLayout>children</RootLayout>);
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    expect(cspMeta?.getAttribute("content")).not.toContain("frame-ancestors");
  });
});
