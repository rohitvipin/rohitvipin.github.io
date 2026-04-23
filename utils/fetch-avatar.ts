import { createHash } from "crypto";
import { existsSync, readFileSync, renameSync, writeFileSync } from "fs";
import { join } from "path";
import profileJson from "../data/profile.json";
import { ProfileSchema } from "../src/lib/schemas";

const outputPath = join(process.cwd(), "public", "avatar.jpg");
const digestPath = join(process.cwd(), "public", "avatar.sha256");
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_HOST = "avatars.githubusercontent.com";

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function hasValidMagicBytes(buf: Buffer): boolean {
  const matchesPrefix = (magic: number[]) => magic.every((byte, i) => buf[i] === byte);
  return matchesPrefix(JPEG_MAGIC) || matchesPrefix(PNG_MAGIC);
}

export async function main() {
  const { github_avatar: url } = ProfileSchema.parse(profileJson);

  const parsed = new URL(url);
  if (parsed.hostname !== ALLOWED_HOST) {
    throw new Error(`host not allowlisted: ${parsed.hostname}`);
  }

  console.log(`Fetching avatar from ${url}...`);
  let buffer: Buffer;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000), redirect: "manual" });
    if (res.status >= 300 && res.status < 400) {
      throw new Error(
        `unexpected redirect to ${res.headers.get("location")} — re-pin the avatar URL`
      );
    }
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
      const msg = `Avatar fetch failed (${err instanceof Error ? err.message : err}) - using existing public/avatar.jpg`;
      console.warn(msg);
      console.log(`::warning::${msg}`);
      return;
    }
    throw new Error(
      `Avatar fetch failed and no fallback exists: ${err instanceof Error ? err.message : err}`
    );
  }

  // Integrity: verify SHA-256 against pinned digest, or pin on first run.
  // Commit public/avatar.sha256 to the repo so future builds detect CDN/account tampering.
  // To intentionally re-pin after a legitimate avatar change: delete public/avatar.sha256.
  const digest = createHash("sha256").update(buffer).digest("hex");
  if (existsSync(digestPath)) {
    const raw = readFileSync(digestPath, "utf8").trim();
    // Support sha256sum format ("hash  filename" per line) and legacy bare-hash format
    const pinnedEntry = raw
      .split("\n")
      .map((line) => line.trim().split(/\s+/))
      .find(([, name]) => name === "avatar.jpg");
    const pinned = pinnedEntry ? pinnedEntry[0] : raw;
    if (pinned !== digest) {
      throw new Error(
        `Avatar digest mismatch — expected ${pinned}, got ${digest}. Delete public/avatar.sha256 to re-pin if the avatar changed intentionally.`
      );
    }
  } else {
    writeFileSync(digestPath, `${digest}  avatar.jpg\n`);
    console.log(`Avatar digest pinned -> public/avatar.sha256`);
  }

  const tmpPath = `${outputPath}.tmp`;
  writeFileSync(tmpPath, buffer);
  renameSync(tmpPath, outputPath);
  console.log(`Avatar saved -> public/avatar.jpg (${buffer.length} bytes)`);
}

if (process.env.NODE_ENV !== "test") {
  main().catch((err) => {
    console.error(`Avatar generation failed: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  });
}
