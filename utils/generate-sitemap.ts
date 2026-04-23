import { writeFileSync } from "fs";
import { join } from "path";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rohitvipin.github.io";
const today = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

writeFileSync(join(process.cwd(), "public", "sitemap.xml"), sitemap, "utf8");
console.log(`Sitemap generated → public/sitemap.xml (lastmod: ${today})`);
