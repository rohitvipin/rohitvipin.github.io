const LS = /\u2028/g;
const PS = /\u2029/g;

/**
 * Safe ONLY inside <script type="application/ld+json">. Do NOT reuse for HTML attributes — quotes are unescaped.
 */
export function escapeJsonLd(json: string): string {
  return json
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(LS, "\\u2028")
    .replace(PS, "\\u2029");
}
