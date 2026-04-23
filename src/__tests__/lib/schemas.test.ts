import { describe, it, expect } from "vitest";
import { FILE_ZSCHEMAS } from "@/lib/schemas";

describe("FILE_ZSCHEMAS parity", () => {
  // Data files loaded in src/lib/data.ts — must all be covered by FILE_ZSCHEMAS.
  // If data.ts imports a new file and FILE_ZSCHEMAS is not updated, lint-data silently
  // skips schema validation for that file.
  const DATA_TS_FILES = [
    "profile.json",
    "experience.json",
    "projects.json",
    "skills.json",
    "education.json",
    "socials.json",
    "awards.json",
    "community.json",
    "leadership.json",
    "nav.json",
    "impact.json",
  ];

  it("contains a schema entry for every data file loaded in data.ts", () => {
    const schemaKeys = Object.keys(FILE_ZSCHEMAS);
    for (const file of DATA_TS_FILES) {
      expect(schemaKeys, `FILE_ZSCHEMAS is missing an entry for "${file}"`).toContain(file);
    }
  });

  it("has no schema entries for files not loaded in data.ts (excluding resume-config.json)", () => {
    // resume-config.json is intentionally in FILE_ZSCHEMAS but NOT in data.ts
    // (consumed only by utils/generate-resume.ts). All other keys should map to data.ts files.
    const knownExtras = new Set(["resume-config.json"]);
    const schemaKeys = Object.keys(FILE_ZSCHEMAS);
    for (const key of schemaKeys) {
      if (!knownExtras.has(key)) {
        expect(
          DATA_TS_FILES,
          `FILE_ZSCHEMAS has an entry for "${key}" which is not loaded in data.ts`
        ).toContain(key);
      }
    }
  });
});
