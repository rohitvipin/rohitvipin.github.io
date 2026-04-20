import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const FORBIDDEN: Array<{ char: string; label: string }> = [
  { char: "\u2014", label: "em dash (—)" },
  { char: "\u2013", label: "en dash (–)" },
  { char: "\u00B7", label: "middle dot (·)" },
  { char: "\u2026", label: "ellipsis (…)" },
  { char: "\u201C", label: "left double quote (\u201C)" },
  { char: "\u201D", label: "right double quote (\u201D)" },
  { char: "\u2018", label: "left single quote (\u2018)" },
  { char: "\u2019", label: "right single quote (\u2019)" },
];

const dataDir = join(process.cwd(), "data");
const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));

let errors = 0;

for (const file of files) {
  const path = join(dataDir, file);
  const lines = readFileSync(path, "utf8").split("\n");

  for (let i = 0; i < lines.length; i++) {
    for (const { char, label } of FORBIDDEN) {
      if (lines[i].includes(char)) {
        console.error(`data/${file}:${i + 1} - forbidden character ${label}`);
        errors++;
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} forbidden character(s) found in data/*.json`);
  process.exit(1);
} else {
  console.log("data/*.json - no forbidden characters found");
}
