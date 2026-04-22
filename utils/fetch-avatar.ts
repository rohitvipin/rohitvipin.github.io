import { writeFileSync } from "fs";
import { join } from "path";
import profileJson from "../data/profile.json";

const outputPath = join(process.cwd(), "public", "avatar.jpg");

async function main() {
  const url = profileJson.github_avatar;
  if (!url) {
    console.warn("No github_avatar in profile.json — skipping avatar fetch");
    return;
  }
  console.log(`Fetching avatar from ${url}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching avatar`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buffer);
  console.log(`Avatar saved → public/avatar.jpg (${buffer.length} bytes)`);
}

main().catch((err) => {
  console.warn(
    `Warning: avatar fetch failed — ${err instanceof Error ? err.message : err}. Build will continue.`
  );
  process.exit(0);
});
