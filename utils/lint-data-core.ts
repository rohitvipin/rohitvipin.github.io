import { FILE_ZSCHEMAS } from "@/lib/schemas";

export const FORBIDDEN: Array<{ char: string; label: string }> = [
  { char: "\u2014", label: "em dash (—)" },
  { char: "\u2013", label: "en dash (–)" },
  { char: "\u00B7", label: "middle dot (·)" },
  { char: "\u2026", label: "ellipsis (…)" },
  { char: "\u201C", label: "left double quote (\u201C)" },
  { char: "\u201D", label: "right double quote (\u201D)" },
  { char: "\u2018", label: "left single quote (\u2018)" },
  { char: "\u2019", label: "right single quote (\u2019)" },
];

export interface LintViolation {
  line: number;
  label: string;
}

export interface LintResult {
  valid: boolean;
  parseError?: string;
  violations: LintViolation[];
  schemaErrors: string[];
}

export function validateSchema(raw: string, fileName: string): string[] {
  const schema = FILE_ZSCHEMAS[fileName];
  if (!schema) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  const result = schema.safeParse(parsed);
  if (result.success) return [];

  return result.error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "root";
    return `${fileName} [${path}]: ${issue.message}`;
  });
}

export function lintContent(raw: string): LintResult {
  try {
    JSON.parse(raw);
  } catch (e) {
    return { valid: false, parseError: (e as Error).message, violations: [], schemaErrors: [] };
  }

  const violations: LintViolation[] = [];
  const lines = raw.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const { char, label } of FORBIDDEN) {
      if (lines[i].includes(char)) {
        violations.push({ line: i + 1, label });
      }
    }
  }

  return { valid: violations.length === 0, violations, schemaErrors: [] };
}
