import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { createWriteStream, renameSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";

import resumeConfigData from "../data/resume-config.json";
import {
  profile,
  socials,
  experience,
  skills,
  projects,
  leadership,
  education,
  community,
  awards,
} from "../src/lib/data";

import { ResumeDocument } from "./resume/ResumeDocument";
import type { ResumeConfig } from "../src/types";
import { ResumeConfigSchema } from "../src/lib/schemas";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../public/Rohit_Vipin_Mathews_Resume.pdf");

const resumeConfig: ResumeConfig = ResumeConfigSchema.parse(resumeConfigData);

const GENERATE_TIMEOUT_MS = 120_000;

export async function generate() {
  console.log("Generating resume PDF from data/*.json...");

  const element = React.createElement(ResumeDocument, {
    config: resumeConfig,
    profile,
    socials,
    experience,
    skills,
    projects,
    leadership,
    education,
    community,
    awards,
  });

  const stream = await renderToStream(element as unknown as Parameters<typeof renderToStream>[0]);
  const tmp = OUTPUT_PATH + ".tmp";
  const out = createWriteStream(tmp);
  await pipeline(stream, out);
  renameSync(tmp, OUTPUT_PATH);
  const { size } = statSync(OUTPUT_PATH);
  if (size < 25_000) {
    throw new Error(`Generated PDF is suspiciously small (${size} bytes) — render may have failed`);
  }
  console.log(`Resume PDF generated → ${OUTPUT_PATH} (${size} bytes)`);
}

if (process.env.NODE_ENV !== "test") {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("PDF generation timed out after 120s")), GENERATE_TIMEOUT_MS)
  );
  Promise.race([generate(), timeout]).catch((err) => {
    console.error(`Resume generation failed: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  });
}
