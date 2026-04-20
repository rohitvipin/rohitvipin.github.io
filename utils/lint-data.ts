import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { lintContent } from "./lint-data-core";

const dataDir = join(process.cwd(), "data");
const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));

let errors = 0;

for (const file of files) {
  const path = join(dataDir, file);
  const raw = readFileSync(path, "utf8");
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
}

if (errors > 0) {
  console.error(`\n${errors} error(s) found in data/*.json`);
  process.exit(1);
} else {
  console.log("data/*.json - all valid");
}
