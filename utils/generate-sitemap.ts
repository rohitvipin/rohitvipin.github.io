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

if (process.env.NODE_ENV !== "test") {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rohitvipin.github.io";

  let lastmod: string;
  try {
    lastmod = execSync("git log -1 --format=%cI -- data/", { encoding: "utf8" })
      .trim()
      .split("T")[0];
  } catch {
    lastmod = new Date().toISOString().split("T")[0];
  }

  const sitemap = buildSitemap(BASE_URL, lastmod);
  writeFileSync(join(process.cwd(), "public", "sitemap.xml"), sitemap, "utf8");
  console.log(`Sitemap generated → public/sitemap.xml (lastmod: ${lastmod})`);
}
