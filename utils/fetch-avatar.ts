import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import profileJson from "../data/profile.json";

const outputPath = join(process.cwd(), "public", "avatar.jpg");
const MAX_BYTES = 2 * 1024 * 1024;

async function main() {
  const url = profileJson.github_avatar;
  if (!url) {
    console.warn("No github_avatar in profile.json - skipping avatar fetch");
    return;
  }
  console.log(`Fetching avatar from ${url}...`);
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`unexpected content-type: ${contentType}`);
    }
  } catch (err) {
    if (existsSync(outputPath)) {
      console.warn(
        `Avatar fetch failed (${err instanceof Error ? err.message : err}) - using existing public/avatar.jpg`
      );
      return;
    }
    console.error(
      `Avatar fetch failed and no fallback exists: ${err instanceof Error ? err.message : err}`
    );
    process.exit(1);
    return;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    console.error(`Avatar response too large: ${buffer.length} bytes (max ${MAX_BYTES})`);
    process.exit(1);
  }
  writeFileSync(outputPath, buffer);
  console.log(`Avatar saved -> public/avatar.jpg (${buffer.length} bytes)`);
}

main().catch((err) => {
  console.error(`Unexpected error: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
