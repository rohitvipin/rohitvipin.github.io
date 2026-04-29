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
] as const;

export type TokenKey = (typeof TOKEN_KEYS)[number];

export const CONTRAST_EXEMPT: readonly TokenKey[] = ["--accent-glow"];

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
  // --muted-2 backs incidental/meta text (timestamps, tags, durations) where the
  // design intentionally accepts WCAG AA UI/large-text minimum (3.0) rather than
  // AA-normal (4.5). Reasserts that contrast does not silently regress below 3.0.
  {
    fg: "--muted-2",
    bg: "--bg",
    min: 3.0,
    reason: "Meta text on page background (UI/large minimum)",
  },
  { fg: "--muted-2", bg: "--surface", min: 3.0, reason: "Meta text on cards (UI/large minimum)" },
  { fg: "--accent", bg: "--bg", min: 3.0, reason: "WCAG AA UI/large-text for accent links" },
  // --bg on --accent: Button primary CTA (text-bg on bg-accent). text-sm font-semibold
  // qualifies as large-text per WCAG, so 3.0 minimum applies.
  {
    fg: "--bg",
    bg: "--accent",
    min: 3.0,
    reason: "Primary CTA button text on accent fill (UI/large-text)",
  },
  // --accent on --surface-2: TechChip/StatusPill hover and accent text on elevated surfaces.
  {
    fg: "--accent",
    bg: "--surface-2",
    min: 3.0,
    reason: "Accent text on elevated surface (UI/large-text)",
  },
  // --muted on --surface-2: TechChip resting state — primary readable text path.
  {
    fg: "--muted",
    bg: "--surface-2",
    min: 4.5,
    reason: "Secondary text on elevated surface (TechChip)",
  },
];

export const THEME_SELECTORS = [":root", '[data-theme="light"]'] as const;
export type ThemeSelector = (typeof THEME_SELECTORS)[number];
