import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
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

      // Allow `any` in rare cases but flag implicit any
      "@typescript-eslint/no-explicit-any": "warn",

      // Avoid non-null assertions; prefer optional chaining
      "@typescript-eslint/no-non-null-assertion": "warn",

      // setState in effects is flagged too aggressively for mount-guard patterns
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["utils/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
]);

export default eslintConfig;
