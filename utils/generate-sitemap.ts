import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { join } from "path";

export function buildSitemap(baseUrl: string, lastmod: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

export function run(baseUrl: string, outputPath: string): void {
  let lastmod: string;
  try {
    lastmod = execSync("git log -1 --format=%cI -- data/", { encoding: "utf8" })
      .trim()
      .split("T")[0];
  } catch {
    lastmod = new Date().toISOString().split("T")[0];
  }
  const sitemap = buildSitemap(baseUrl, lastmod);
  writeFileSync(outputPath, sitemap, "utf8");
  console.log(`Sitemap generated → ${outputPath} (lastmod: ${lastmod})`);
}

if (process.env.NODE_ENV !== "test") {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rohitvipin.github.io";
  run(BASE_URL, join(process.cwd(), "public", "sitemap.xml"));
}
