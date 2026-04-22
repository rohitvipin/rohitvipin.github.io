#!/usr/bin/env tsx
// Run: npm run generate-favicons
// Requires: sharp (devDependency)

import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public");

export function makeSvg(
  size: number,
  fontSize: number,
  tagline: string | null = null,
  taglineFontSize = 0
): string {
  const radius = Math.round(size * 0.18);
  const mainY = tagline ? Math.round(size * 0.46) : Math.round(size * 0.56);
  const taglineY = Math.round(size * 0.67);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#0f172a"/>
  <text
    x="50%" y="${mainY}"
    font-family="'Courier New', Courier, monospace"
    font-size="${fontSize}"
    font-weight="700"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="middle"
  >R</text>
  ${
    tagline
      ? `<text
    x="50%" y="${taglineY}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${taglineFontSize}"
    font-weight="400"
    fill="#94a3b8"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="1"
  >${tagline}</text>`
      : ""
  }
</svg>`;
}

export function makeOgSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0f172a"/>
  <line x1="0" y1="315" x2="1200" y2="315" stroke="#1e293b" stroke-width="1"/>
  <line x1="600" y1="0" x2="600" y2="630" stroke="#1e293b" stroke-width="1"/>
  <rect x="480" y="170" width="240" height="4" rx="2" fill="#3b82f6"/>
  <text
    x="600" y="310"
    font-family="Arial, Helvetica, sans-serif"
    font-size="148"
    font-weight="700"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="12"
  >RVM</text>
  <text
    x="600" y="410"
    font-family="Arial, Helvetica, sans-serif"
    font-size="32"
    font-weight="600"
    fill="#e2e8f0"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="2"
  >Rohit Vipin Mathews</text>
  <text
    x="600" y="460"
    font-family="Arial, Helvetica, sans-serif"
    font-size="22"
    font-weight="400"
    fill="#64748b"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="3"
  >Director · Engineering &amp; Architecture</text>
</svg>`;
}

interface FaviconSpec {
  name: string;
  size: number;
  fontSize: number;
}

export async function generate(): Promise<void> {
  const sizes: FaviconSpec[] = [
    { name: "favicon-16x16.png", size: 16, fontSize: 11 },
    { name: "favicon-32x32.png", size: 32, fontSize: 22 },
    { name: "apple-touch-icon.png", size: 180, fontSize: 115 },
    { name: "android-chrome-192x192.png", size: 192, fontSize: 122 },
    { name: "android-chrome-512x512.png", size: 512, fontSize: 320 },
  ];

  for (const { name, size, fontSize } of sizes) {
    const svg = Buffer.from(makeSvg(size, fontSize));
    await sharp(svg).png().toFile(path.join(OUT, name));
    console.log(`  ✓ ${name}`);
  }

  const ico32 = await sharp(Buffer.from(makeSvg(32, 22)))
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, "../src/app/favicon.ico"), ico32);
  console.log("  ✓ src/app/favicon.ico (replaced)");

  fs.writeFileSync(path.join(OUT, "favicon.ico"), ico32);
  console.log("  ✓ public/favicon.ico");

  await sharp(Buffer.from(makeOgSvg()))
    .jpeg({ quality: 95 })
    .toFile(path.join(OUT, "og-image.jpg"));
  console.log("  ✓ og-image.jpg");

  console.log("\nDone. All assets written to public/");
}

if (process.env.NODE_ENV !== "test") {
  generate().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
