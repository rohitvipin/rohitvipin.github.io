/**
 * Single source of truth for the class strings emitted by shared primitive
 * components. Components import from here; tests snapshot these constants
 * directly, then assert each component emits the matching value.
 *
 * Renaming a token only touches:
 *   1. src/app/globals.css (the declaration)
 *   2. src/lib/tokens.ts (canonical key list, if a token is added/removed)
 *   3. src/lib/primitive-classes.ts (this file — every consumer downstream)
 *   4. docs/DESIGN.md (the canonical class reference)
 *
 * Snapshots in primitives.test.tsx will fail if the constant value drifts;
 * component-render tests will fail if a primitive stops emitting the constant.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost";

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 active:opacity-75",
  secondary:
    "inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[var(--accent)]/50 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/8 active:bg-[var(--accent)]/15",
  ghost:
    "inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] active:opacity-75",
};

export function buttonClassName(variant: ButtonVariant, extra?: string): string {
  return extra ? `${BUTTON_VARIANT_CLASSES[variant]} ${extra}` : BUTTON_VARIANT_CLASSES[variant];
}

export const TAB_PILL_BASE =
  "flex min-h-[48px] items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150 active:scale-[0.97]";

export const TAB_PILL_ACTIVE_SUFFIX = "bg-[var(--accent)] text-[var(--bg)]";
export const TAB_PILL_INACTIVE_SUFFIX = "text-[var(--muted)] hover:text-[var(--text)]";

export function tabPillClassName(active: boolean): string {
  return `${TAB_PILL_BASE} ${active ? TAB_PILL_ACTIVE_SUFFIX : TAB_PILL_INACTIVE_SUFFIX}`;
}

export const STATUS_PILL_CLASSES =
  "inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-glow)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]";

export type TagBadgeVariant = "neutral" | "accent";

export const TAG_BADGE_VARIANT_CLASSES: Record<TagBadgeVariant, string> = {
  neutral: "rounded-md border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted-2)]",
  accent:
    "rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/8 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]",
};

export const TAG_BADGE_CLASSES = TAG_BADGE_VARIANT_CLASSES.neutral;

export function tagBadgeClassName(variant: TagBadgeVariant = "neutral"): string {
  return TAG_BADGE_VARIANT_CLASSES[variant];
}

export const TECH_CHIP_CLASSES =
  "inline-block cursor-default rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-xs text-[var(--muted)] transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]";

export type IconButtonVariant = "outline" | "outline-accent-hover" | "outline-accent";

const ICON_BUTTON_BASE =
  "flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg transition-all duration-200";

export const ICON_BUTTON_VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  outline: `${ICON_BUTTON_BASE} border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]`,
  "outline-accent-hover": `${ICON_BUTTON_BASE} border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]`,
  "outline-accent": `${ICON_BUTTON_BASE} border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)]`,
};

export function iconButtonClassName(variant: IconButtonVariant, extra?: string): string {
  return extra
    ? `${ICON_BUTTON_VARIANT_CLASSES[variant]} ${extra}`
    : ICON_BUTTON_VARIANT_CLASSES[variant];
}

export type DetailsSummaryTone = "accent" | "muted";

const DETAILS_SUMMARY_BASE = "flex min-h-[48px] items-center gap-1.5 text-xs";

export const DETAILS_SUMMARY_TONE_CLASSES: Record<DetailsSummaryTone, string> = {
  accent: `${DETAILS_SUMMARY_BASE} text-[var(--accent)] transition-opacity hover:opacity-80`,
  muted: `${DETAILS_SUMMARY_BASE} text-[var(--muted)] transition-colors hover:text-[var(--text)]`,
};

export function detailsSummaryClassName(tone: DetailsSummaryTone): string {
  return DETAILS_SUMMARY_TONE_CLASSES[tone];
}
