// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter", className: "mock-inter" }),
}));

vi.mock("@/lib/data", () => ({
  socials: [],
}));

vi.mock("@/lib/escape", () => ({
  escapeJsonLd: (s: string) => s,
}));

vi.mock("@/lib/jsonld", () => ({
  buildPersonJsonLd: () => ({ "@type": "Person", name: "Test" }),
}));

vi.mock("@/lib/paths", () => ({
  avatarHref: "/avatar.jpg",
  avatarWebpHref: "/avatar.webp",
  resumeHref: "/resume.pdf",
}));

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
  it("renders children", () => {
    render(<RootLayout>test content</RootLayout>);
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("renders skip to main content link", () => {
    render(<RootLayout>children</RootLayout>);
    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
  });

  it("includes JSON-LD script tag", () => {
    const { container } = render(<RootLayout>children</RootLayout>);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeInTheDocument();
  });

  it("preloads WebP avatar", () => {
    const { container } = render(<RootLayout>children</RootLayout>);
    const webpLink = container.querySelector('link[rel="preload"][type="image/webp"]');
    expect(webpLink).toBeInTheDocument();
    expect(webpLink).toHaveAttribute("href", "/avatar.webp");
  });

  it("preloads JPEG avatar as fallback", () => {
    const { container } = render(<RootLayout>children</RootLayout>);
    const jpegLink = container.querySelector('link[rel="preload"][type="image/jpeg"]');
    expect(jpegLink).toBeInTheDocument();
    expect(jpegLink).toHaveAttribute("href", "/avatar.jpg");
  });
});
