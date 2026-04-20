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

type FieldType = "string" | "number" | "boolean" | "array" | "object";

interface FieldSchema {
  key: string;
  type: FieldType;
}

interface FileSchema {
  shape: "singleton" | "array";
  fields: FieldSchema[];
}

export const FILE_SCHEMAS: Record<string, FileSchema> = {
  "profile.json": {
    shape: "singleton",
    fields: [
      { key: "name", type: "string" },
      { key: "title", type: "string" },
      { key: "headline", type: "string" },
      { key: "location", type: "string" },
      { key: "bio", type: "string" },
      { key: "email", type: "string" },
      { key: "phone", type: "string" },
      { key: "years_of_experience", type: "number" },
      { key: "timezone", type: "string" },
      { key: "availability_status", type: "string" },
      { key: "github_avatar", type: "string" },
      { key: "key_metrics", type: "array" },
    ],
  },
  "experience.json": {
    shape: "array",
    fields: [
      { key: "company", type: "string" },
      { key: "role", type: "string" },
      { key: "location", type: "string" },
      { key: "duration", type: "string" },
      { key: "current", type: "boolean" },
      { key: "description", type: "string" },
      { key: "techStack", type: "array" },
      { key: "highlights", type: "array" },
    ],
  },
  "projects.json": {
    shape: "array",
    fields: [
      { key: "name", type: "string" },
      { key: "domain", type: "string" },
      { key: "client", type: "string" },
      { key: "role", type: "string" },
      { key: "duration", type: "string" },
      { key: "description", type: "string" },
      { key: "products", type: "array" },
      { key: "highlights", type: "array" },
      { key: "tech", type: "array" },
    ],
  },
  "skills.json": {
    shape: "array",
    fields: [
      { key: "category", type: "string" },
      { key: "skills", type: "array" },
    ],
  },
  "education.json": {
    shape: "array",
    fields: [
      { key: "degree", type: "string" },
      { key: "institution", type: "string" },
      { key: "location", type: "string" },
      { key: "year", type: "string" },
    ],
  },
  "socials.json": {
    shape: "array",
    fields: [
      { key: "platform", type: "string" },
      { key: "url", type: "string" },
      { key: "icon", type: "string" },
    ],
  },
  "awards.json": {
    shape: "array",
    fields: [
      { key: "title", type: "string" },
      { key: "organization", type: "string" },
      { key: "description", type: "string" },
    ],
  },
  "community.json": {
    shape: "array",
    fields: [
      { key: "type", type: "string" },
      { key: "title", type: "string" },
      { key: "description", type: "string" },
      { key: "highlights", type: "array" },
    ],
  },
  "leadership.json": {
    shape: "singleton",
    fields: [
      { key: "title", type: "string" },
      { key: "sections", type: "array" },
    ],
  },
};

function checkFields(
  record: Record<string, unknown>,
  fields: FieldSchema[],
  context: string
): string[] {
  const errors: string[] = [];
  for (const { key, type } of fields) {
    if (!(key in record)) {
      errors.push(`${context}: missing required field "${key}"`);
      continue;
    }
    const val = record[key];
    const actual = val === null ? "null" : Array.isArray(val) ? "array" : typeof val;
    if (actual !== type) {
      errors.push(`${context}: field "${key}" expected ${type}, got ${actual}`);
    }
  }
  return errors;
}

export function validateSchema(raw: string, fileName: string): string[] {
  const schema = FILE_SCHEMAS[fileName];
  if (!schema) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (schema.shape === "singleton") {
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return [`${fileName}: expected a JSON object at root`];
    }
    return checkFields(parsed as Record<string, unknown>, schema.fields, fileName);
  }

  if (!Array.isArray(parsed)) {
    return [`${fileName}: expected a JSON array at root`];
  }

  const errors: string[] = [];
  for (let i = 0; i < parsed.length; i++) {
    const item = parsed[i];
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      errors.push(`${fileName}[${i}]: expected an object`);
      continue;
    }
    errors.push(
      ...checkFields(item as Record<string, unknown>, schema.fields, `${fileName}[${i}]`)
    );
  }
  return errors;
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
