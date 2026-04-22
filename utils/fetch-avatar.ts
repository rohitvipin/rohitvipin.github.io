import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import profileJson from "../data/profile.json";
import { ProfileSchema } from "../src/lib/schemas";

const outputPath = join(process.cwd(), "public", "avatar.jpg");
const MAX_BYTES = 2 * 1024 * 1024;

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function hasValidMagicBytes(buf: Buffer): boolean {
  const matchesPrefix = (magic: number[]) => magic.every((byte, i) => buf[i] === byte);
  return matchesPrefix(JPEG_MAGIC) || matchesPrefix(PNG_MAGIC);
}

async function main() {
  const { github_avatar: url } = ProfileSchema.parse(profileJson);
  console.log(`Fetching avatar from ${url}...`);
  let res: Response;
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
    let magicChecked = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BYTES) {
        await reader.cancel();
        throw new Error(`response body exceeds limit of ${MAX_BYTES} bytes`);
      }
      chunks.push(value);
      // Validate magic bytes on the first chunk large enough — fail fast before buffering the rest
      if (!magicChecked && totalBytes >= PNG_MAGIC.length) {
        const peek = chunks.length === 1 ? Buffer.from(chunks[0]) : Buffer.concat(chunks);
        if (!hasValidMagicBytes(peek)) {
          await reader.cancel();
          throw new Error("response body is not a valid JPEG or PNG");
        }
        magicChecked = true;
      }
    }
    if (!magicChecked) {
      throw new Error("response body is not a valid JPEG or PNG");
    }
    buffer = Buffer.concat(chunks, totalBytes);
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
