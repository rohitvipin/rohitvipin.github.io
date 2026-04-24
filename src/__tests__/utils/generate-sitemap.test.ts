import { describe, it, expect } from "vitest";
import { buildSitemap } from "../../../utils/generate-sitemap";

describe("buildSitemap", () => {
  it("produces valid XML declaration and urlset", () => {
    const xml = buildSitemap("https://example.com", "2024-01-15");
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  });

  it("inserts baseUrl as loc with trailing slash", () => {
    const xml = buildSitemap("https://example.com", "2024-01-15");
    expect(xml).toContain("<loc>https://example.com/</loc>");
  });

  it("inserts lastmod date", () => {
    const xml = buildSitemap("https://example.com", "2024-06-30");
    expect(xml).toContain("<lastmod>2024-06-30</lastmod>");
  });

  it("sets changefreq to weekly and priority to 1.0", () => {
    const xml = buildSitemap("https://example.com", "2024-01-15");
    expect(xml).toContain("<changefreq>weekly</changefreq>");
    expect(xml).toContain("<priority>1.0</priority>");
  });

  it("reflects different baseUrls correctly", () => {
    const xml = buildSitemap("https://rohitvipin.github.io", "2024-01-15");
    expect(xml).toContain("<loc>https://rohitvipin.github.io/</loc>");
  });
});
