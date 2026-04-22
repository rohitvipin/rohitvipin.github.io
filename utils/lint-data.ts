import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { lintContent, validateSchema } from "./lint-data-core";

export function run(dataDir: string): number {
  const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));
  let errors = 0;

  for (const file of files) {
    const filePath = join(dataDir, file);
    const raw = readFileSync(filePath, "utf8");
    const result = lintContent(raw);

    if (result.parseError) {
      console.error(`data/${file} - invalid JSON: ${result.parseError}`);
      errors++;
      continue;
    }

    for (const { line, label } of result.violations) {
      console.error(`data/${file}:${line} - forbidden character ${label}`);
      errors++;
    }

    for (const msg of validateSchema(raw, file)) {
      console.error(msg);
      errors++;
    }
  }

  return errors;
}

if (process.env.NODE_ENV !== "test") {
  const dataDir = join(process.cwd(), "data");
  const errors = run(dataDir);
  if (errors > 0) {
    console.error(`\n${errors} error(s) found in data/*.json`);
    process.exit(1);
  } else {
    console.log("data/*.json - all valid");
  }
}
