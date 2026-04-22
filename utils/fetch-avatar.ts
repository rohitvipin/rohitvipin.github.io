import { existsSync, writeFileSync } from "fs";
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
  let res: Response;
  try {
    res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    if (existsSync(outputPath)) {
      console.warn(
        `Avatar fetch failed (${err instanceof Error ? err.message : err}) — using existing public/avatar.jpg`
      );
      return;
    }
    console.error(
      `Avatar fetch failed and no fallback exists: ${err instanceof Error ? err.message : err}`
    );
    process.exit(1);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buffer);
  console.log(`Avatar saved → public/avatar.jpg (${buffer.length} bytes)`);
}

main().catch((err) => {
  console.error(`Unexpected error: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
