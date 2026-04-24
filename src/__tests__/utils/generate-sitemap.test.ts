import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, readFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { buildSitemap, run } from "../../../utils/generate-sitemap";

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

describe("run()", () => {
  let tmpFile: string;

  beforeEach(() => {
    tmpFile = join(tmpdir(), `sitemap-test-${Date.now()}.xml`);
  });

  afterEach(() => {
    if (existsSync(tmpFile)) unlinkSync(tmpFile);
  });

  it("writes valid sitemap XML with correct structure", () => {
    run("https://example.com", tmpFile);
    const content = readFileSync(tmpFile, "utf8");
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(content).toContain("<loc>https://example.com/</loc>");
    expect(content).toContain("<changefreq>weekly</changefreq>");
  });

  it("lastmod is a valid YYYY-MM-DD date", () => {
    run("https://example.com", tmpFile);
    const content = readFileSync(tmpFile, "utf8");
    expect(content).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
  });

  it("uses provided baseUrl in loc element", () => {
    run("https://custom.example.com", tmpFile);
    const content = readFileSync(tmpFile, "utf8");
    expect(content).toContain("<loc>https://custom.example.com/</loc>");
  });

  it("writes to the specified output path", () => {
    run("https://example.com", tmpFile);
    expect(existsSync(tmpFile)).toBe(true);
  });
});
