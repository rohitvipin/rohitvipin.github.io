import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
  {
    rules: {
      // Prettier handles formatting — disable conflicting rules
      ...prettierConfig.rules,

      // No console.log in production source
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Prefer const; flag unused vars (but allow _-prefixed)
      "prefer-const": "error",
      "no-var": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Explicit return types on exported functions catch API surface drift
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // No any types — use generics or discriminated unions (per CLAUDE.md)
      "@typescript-eslint/no-explicit-any": "error",

      // No non-null assertions — prefer optional chaining
      "@typescript-eslint/no-non-null-assertion": "error",

      // setState in effects is flagged too aggressively for mount-guard patterns
      "react-hooks/set-state-in-effect": "off",

      // escapeForJsonLdScript is safe only in JSON-LD script context — not for HTML attributes
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/escape",
              importNames: ["escapeForJsonLdScript"],
              message:
                "escapeForJsonLdScript is safe only inside <script type='application/ld+json'>. Import only in src/app/layout.tsx.",
            },
          ],
        },
      ],
    },
  },
  // Ban hardcoded colour literals in components and app routes — tokens only.
  // globals.css is the sole legitimate home for raw colour values.
  {
    files: ["src/components/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/#[0-9a-fA-F]{3}([0-9a-fA-F]{1,5})?\\b/]:not(JSXAttribute[name.name='id'] > Literal):not(JSXAttribute[name.name='href'] > Literal)",
          message:
            "Hardcoded colour literal. Use a CSS custom property (e.g. var(--accent)) defined in src/app/globals.css.",
        },
        {
          selector: "Literal[value=/\\b(?:rgb|rgba|hsl|hsla)\\s*\\(/]",
          message:
            "Hardcoded colour function. Use a CSS custom property (e.g. var(--accent-glow)) defined in src/app/globals.css.",
        },
        {
          selector: "TemplateElement[value.raw=/#[0-9a-fA-F]{3}([0-9a-fA-F]{1,5})?\\b/]",
          message:
            "Hardcoded colour literal in template string. Use a CSS custom property defined in src/app/globals.css.",
        },
        {
          selector: "TemplateElement[value.raw=/\\b(?:rgb|rgba|hsl|hsla)\\s*\\(/]",
          message:
            "Hardcoded colour function in template string. Use a CSS custom property defined in src/app/globals.css.",
        },
      ],
    },
  },
  // Browser theme-color meta needs literal hex; CSS vars don't resolve in <meta>.
  {
    files: ["src/app/layout.tsx"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  {
    files: ["utils/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: [
      "src/app/layout.tsx",
      "src/__tests__/lib/jsonld.test.ts",
      "src/__tests__/lib/escape.test.ts",
      "src/__tests__/app/layout.test.tsx",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
]);

export default eslintConfig;
