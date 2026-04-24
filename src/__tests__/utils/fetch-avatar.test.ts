import { describe, it, expect, vi, beforeEach } from "vitest";
import { existsSync, readFileSync, renameSync, writeFileSync } from "fs";
import { main } from "../../../utils/fetch-avatar";
import { ProfileSchema } from "@/lib/schemas";

vi.mock("fs", () => {
  const existsSync = vi.fn();
  const readFileSync = vi.fn();
  const writeFileSync = vi.fn();
  const renameSync = vi.fn();
  return {
    existsSync,
    readFileSync,
    writeFileSync,
    renameSync,
    default: { existsSync, readFileSync, writeFileSync, renameSync },
  };
});

vi.mock("../../../data/profile.json", () => ({
  default: { github_avatar: "https://avatars.githubusercontent.com/u/123?v=4" },
}));

vi.mock("@/lib/schemas", () => ({
  ProfileSchema: { parse: vi.fn((d: unknown) => d) },
}));

const JPEG_BODY = new Uint8Array([0xff, 0xd8, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
const BAD_BODY = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

function makeBody(data: Uint8Array): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  });
}

function makeResponse(opts: {
  ok?: boolean;
  status?: number;
  contentType?: string;
  contentLength?: string;
  body?: ReadableStream<Uint8Array> | null;
}): Response {
  const headers = new Headers();
  headers.set("content-type", opts.contentType ?? "image/jpeg");
  if (opts.contentLength) headers.set("content-length", opts.contentLength);
  return {
    ok: opts.ok ?? true,
    status: opts.status ?? 200,
    headers,
    body: "body" in opts ? opts.body : makeBody(JPEG_BODY),
  } as unknown as Response;
}

describe("fetch-avatar main()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(existsSync).mockReturnValue(false);
    vi.mocked(writeFileSync).mockImplementation(() => {});
    vi.mocked(renameSync).mockImplementation(() => {});
    vi.mocked(readFileSync).mockReturnValue("");
    vi.mocked(ProfileSchema.parse).mockImplementation(
      (d) => d as ReturnType<typeof ProfileSchema.parse>
    );
  });

  it("writes avatar and pins digest on first successful fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue(makeResponse({}));
    await main();
    expect(writeFileSync).toHaveBeenCalledTimes(2);
    expect(String(vi.mocked(writeFileSync).mock.calls[0][0])).toContain("avatar.sha256");
    expect(String(vi.mocked(writeFileSync).mock.calls[1][0])).toContain("avatar.jpg");
  });

  it("verifies digest and passes when matching", async () => {
    const { createHash } = await import("crypto");
    const realDigest = createHash("sha256").update(Buffer.from(JPEG_BODY)).digest("hex");
    vi.mocked(existsSync).mockImplementation((p) => String(p).endsWith("avatar.sha256"));
    vi.mocked(readFileSync).mockReturnValue(realDigest);
    global.fetch = vi.fn().mockResolvedValue(makeResponse({}));
    await main();
    expect(writeFileSync).toHaveBeenCalledOnce();
    expect(String(vi.mocked(writeFileSync).mock.calls[0][0])).toContain("avatar.jpg");
  });

  it("throws on digest mismatch", async () => {
    vi.mocked(existsSync).mockImplementation((p) => String(p).endsWith("avatar.sha256"));
    vi.mocked(readFileSync).mockReturnValue("aaaaaa");
    global.fetch = vi.fn().mockResolvedValue(makeResponse({}));
    await expect(main()).rejects.toThrow("Avatar digest mismatch");
  });

  it("verifies digest in sha256sum multi-line format", async () => {
    const { createHash } = await import("crypto");
    const realDigest = createHash("sha256").update(Buffer.from(JPEG_BODY)).digest("hex");
    const sha256sumContent = `${realDigest}  avatar.jpg\ndeadbeef  avatar.webp\n`;
    vi.mocked(existsSync).mockImplementation((p) => String(p).endsWith("avatar.sha256"));
    vi.mocked(readFileSync).mockReturnValue(sha256sumContent);
    global.fetch = vi.fn().mockResolvedValue(makeResponse({}));
    await main();
    expect(writeFileSync).toHaveBeenCalledOnce();
    expect(String(vi.mocked(writeFileSync).mock.calls[0][0])).toContain("avatar.jpg");
  });

  it("falls back to existing avatar on HTTP error", async () => {
    global.fetch = vi.fn().mockResolvedValue(makeResponse({ ok: false, status: 404, body: null }));
    vi.mocked(existsSync).mockImplementation((p) => String(p).endsWith("avatar.jpg"));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await main();
    expect(writeFileSync).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("throws on HTTP error with no fallback", async () => {
    global.fetch = vi.fn().mockResolvedValue(makeResponse({ ok: false, status: 404, body: null }));
    await expect(main()).rejects.toThrow("Avatar fetch failed and no fallback exists");
  });

  it("throws on non-ok 3xx status (unresolved redirect chain)", async () => {
    global.fetch = vi.fn().mockResolvedValue(makeResponse({ ok: false, status: 302, body: null }));
    await expect(main()).rejects.toThrow("unexpected redirect");
  });

  it("throws on non-image content-type", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(makeResponse({ contentType: "text/html", body: makeBody(JPEG_BODY) }));
    await expect(main()).rejects.toThrow("unexpected content-type");
  });

  it("throws when content-length header exceeds 2MB", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(
        makeResponse({ contentLength: String(3 * 1024 * 1024), body: makeBody(JPEG_BODY) })
      );
    await expect(main()).rejects.toThrow("content-length");
  });

  it("throws on invalid magic bytes", async () => {
    global.fetch = vi.fn().mockResolvedValue(makeResponse({ body: makeBody(BAD_BODY) }));
    await expect(main()).rejects.toThrow("not a valid JPEG or PNG");
  });

  it("throws on null response body", async () => {
    global.fetch = vi.fn().mockResolvedValue(makeResponse({ body: null }));
    await expect(main()).rejects.toThrow("response body is null");
  });

  it("throws when body completes with fewer than 8 bytes (magic bytes never checked)", async () => {
    // 4 bytes < PNG_MAGIC.length (8), so the magic check condition is never met
    const tinyBody = new Uint8Array([0xff, 0xd8, 0xff, 0x00]);
    global.fetch = vi.fn().mockResolvedValue(makeResponse({ body: makeBody(tinyBody) }));
    await expect(main()).rejects.toThrow("not a valid JPEG or PNG");
  });

  it("throws when accumulated streamed body exceeds 2MB limit", async () => {
    const OVER = 2 * 1024 * 1024 + 1;
    const bigChunk = new Uint8Array(OVER);
    const oversizedBody = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(bigChunk);
        controller.close();
      },
    });
    global.fetch = vi.fn().mockResolvedValue(makeResponse({ body: oversizedBody }));
    await expect(main()).rejects.toThrow("response body exceeds limit");
  });

  it("throws on non-https URL", async () => {
    vi.mocked(ProfileSchema.parse).mockReturnValueOnce({
      github_avatar: "http://avatars.githubusercontent.com/u/123?v=4",
    } as ReturnType<typeof ProfileSchema.parse>);
    await expect(main()).rejects.toThrow("avatar URL must use https");
  });

  it("throws on non-allowlisted host", async () => {
    vi.mocked(ProfileSchema.parse).mockReturnValueOnce({
      github_avatar: "https://evil.com/avatar.jpg",
    } as unknown as ReturnType<typeof ProfileSchema.parse>);
    await expect(main()).rejects.toThrow("host not allowlisted");
  });
});
