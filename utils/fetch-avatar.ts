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
  const JPEG_MAGIC = [0xff, 0xd8, 0xff];
  const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];

  function hasValidMagicBytes(buf: Buffer): boolean {
    const matchesPrefix = (magic: number[]) => magic.every((byte, i) => buf[i] === byte);
    return matchesPrefix(JPEG_MAGIC) || matchesPrefix(PNG_MAGIC);
  }

  let buffer: Buffer;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`unexpected content-type: ${contentType}`);
    }
    // Early-exit optimisation — header is attacker-controlled so not trusted for enforcement
    const declaredLength = Number(res.headers.get("content-length") ?? 0);
    if (declaredLength > 0 && declaredLength > MAX_BYTES) {
      throw new Error(`content-length ${declaredLength} exceeds limit`);
    }
    // Stream body; abort if accumulated bytes exceed MAX_BYTES
    if (!res.body) throw new Error("response body is null");
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BYTES) {
        await reader.cancel();
        throw new Error(`response body exceeds limit of ${MAX_BYTES} bytes`);
      }
      chunks.push(value);
    }
    buffer = Buffer.concat(chunks);
    if (!hasValidMagicBytes(buffer)) {
      throw new Error("response body is not a valid JPEG or PNG");
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
  }
  writeFileSync(outputPath, buffer);
  console.log(`Avatar saved -> public/avatar.jpg (${buffer.length} bytes)`);
}

main().catch((err) => {
  console.error(`Unexpected error: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
