export const TOKEN_KEYS = [
  "--bg",
  "--surface",
  "--surface-2",
  "--border",
  "--accent",
  "--accent-glow",
  "--accent-2",
  "--text",
  "--muted",
  "--muted-2",
  "--success",
  "--shadow-card",
] as const;

export type TokenKey = (typeof TOKEN_KEYS)[number];

export const CONTRAST_EXEMPT: readonly TokenKey[] = ["--accent-glow", "--shadow-card"];

export const CONTRAST_PAIRS: ReadonlyArray<{
  fg: TokenKey;
  bg: TokenKey;
  min: number;
  reason: string;
}> = [
  { fg: "--text", bg: "--bg", min: 4.5, reason: "WCAG AA normal text on page background" },
  { fg: "--text", bg: "--surface", min: 4.5, reason: "WCAG AA normal text on cards" },
  { fg: "--muted", bg: "--bg", min: 4.5, reason: "Secondary text remains readable on bg" },
  { fg: "--muted", bg: "--surface", min: 4.5, reason: "Secondary text on cards" },
  { fg: "--accent", bg: "--bg", min: 3.0, reason: "WCAG AA UI/large-text for accent links" },
];

export const THEME_SELECTORS = [":root", '[data-theme="light"]'] as const;
export type ThemeSelector = (typeof THEME_SELECTORS)[number];
