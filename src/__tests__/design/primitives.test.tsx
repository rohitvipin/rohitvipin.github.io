// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TechChip } from "@/components/shared/TechChip";
import { TagBadge } from "@/components/shared/TagBadge";
import { StatusPill } from "@/components/shared/StatusPill";
import { TabPill } from "@/components/shared/TabPill";
import { ButtonLink } from "@/components/shared/Button";
import { IconButton, IconButtonLink } from "@/components/shared/IconButton";
import { DetailsSummary } from "@/components/shared/DetailsSummary";
import {
  BUTTON_VARIANT_CLASSES,
  TAB_PILL_BASE,
  TAB_PILL_ACTIVE_SUFFIX,
  TAB_PILL_INACTIVE_SUFFIX,
  TECH_CHIP_CLASSES,
  TAG_BADGE_CLASSES,
  TAG_BADGE_VARIANT_CLASSES,
  STATUS_PILL_CLASSES,
  ICON_BUTTON_VARIANT_CLASSES,
  DETAILS_SUMMARY_TONE_CLASSES,
  buttonClassName,
  iconButtonClassName,
  tabPillClassName,
  tagBadgeClassName,
  detailsSummaryClassName,
} from "@/lib/primitive-classes";

/**
 * Two-stage contract:
 *   1. snapshot the constant in src/lib/primitive-classes.ts (the canonical
 *      class string per pattern in docs/DESIGN.md). A drift in the constant
 *      fails the snapshot.
 *   2. assert each component renders the constant verbatim. A drift between
 *      component and constant fails the render-time `toContain` / `toBe`.
 *
 * Token-anchor `toContain` checks survive a `vitest -u` snapshot refresh —
 * they fail even if a contributor blindly accepts a snapshot update.
 */

describe("primitive-classes constants — canonical values", () => {
  it("BUTTON_VARIANT_CLASSES.primary", () => {
    expect(BUTTON_VARIANT_CLASSES.primary).toMatchInlineSnapshot(
      `"inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 active:opacity-75"`
    );
    expect(BUTTON_VARIANT_CLASSES.primary).toContain("min-h-[48px]");
    expect(BUTTON_VARIANT_CLASSES.primary).toContain("bg-[var(--accent)]");
    expect(BUTTON_VARIANT_CLASSES.primary).toContain("text-[var(--bg)]");
  });

  it("BUTTON_VARIANT_CLASSES.secondary", () => {
    expect(BUTTON_VARIANT_CLASSES.secondary).toMatchInlineSnapshot(
      `"inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[var(--accent)]/50 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/8 active:bg-[var(--accent)]/15"`
    );
    expect(BUTTON_VARIANT_CLASSES.secondary).toContain("min-h-[48px]");
    expect(BUTTON_VARIANT_CLASSES.secondary).toContain("border-[var(--accent)]/50");
    expect(BUTTON_VARIANT_CLASSES.secondary).toContain("text-[var(--accent)]");
  });

  it("BUTTON_VARIANT_CLASSES.ghost", () => {
    expect(BUTTON_VARIANT_CLASSES.ghost).toMatchInlineSnapshot(
      `"inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] active:opacity-75"`
    );
    expect(BUTTON_VARIANT_CLASSES.ghost).toContain("min-h-[48px]");
    expect(BUTTON_VARIANT_CLASSES.ghost).toContain("border-[var(--border)]");
    expect(BUTTON_VARIANT_CLASSES.ghost).toContain("text-[var(--muted)]");
  });

  it("TAB_PILL_BASE", () => {
    expect(TAB_PILL_BASE).toMatchInlineSnapshot(
      `"flex min-h-[48px] items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150 active:scale-[0.97]"`
    );
    expect(TAB_PILL_BASE).toContain("min-h-[48px]");
    expect(TAB_PILL_BASE).toContain("active:scale-[0.97]");
  });

  it("TAB_PILL_ACTIVE_SUFFIX", () => {
    expect(TAB_PILL_ACTIVE_SUFFIX).toMatchInlineSnapshot(`"bg-[var(--accent)] text-[var(--bg)]"`);
  });

  it("TAB_PILL_INACTIVE_SUFFIX", () => {
    expect(TAB_PILL_INACTIVE_SUFFIX).toMatchInlineSnapshot(
      `"text-[var(--muted)] hover:text-[var(--text)]"`
    );
  });

  it("STATUS_PILL_CLASSES", () => {
    expect(STATUS_PILL_CLASSES).toMatchInlineSnapshot(
      `"inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-glow)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]"`
    );
    expect(STATUS_PILL_CLASSES).toContain("bg-[var(--accent-glow)]");
    expect(STATUS_PILL_CLASSES).toContain("text-[var(--accent)]");
  });

  it("TAG_BADGE_CLASSES (alias of neutral variant)", () => {
    expect(TAG_BADGE_CLASSES).toMatchInlineSnapshot(
      `"rounded-md border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted-2)]"`
    );
    expect(TAG_BADGE_CLASSES).toContain("text-[var(--muted-2)]");
    expect(TAG_BADGE_CLASSES).toBe(TAG_BADGE_VARIANT_CLASSES.neutral);
  });

  it("TAG_BADGE_VARIANT_CLASSES.accent", () => {
    expect(TAG_BADGE_VARIANT_CLASSES.accent).toMatchInlineSnapshot(
      `"rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/8 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]"`
    );
    expect(TAG_BADGE_VARIANT_CLASSES.accent).toContain("text-[var(--accent)]");
    expect(TAG_BADGE_VARIANT_CLASSES.accent).toContain("bg-[var(--accent)]/8");
  });

  it("TECH_CHIP_CLASSES", () => {
    expect(TECH_CHIP_CLASSES).toMatchInlineSnapshot(
      `"inline-block cursor-default rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-xs text-[var(--muted)] transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]"`
    );
    expect(TECH_CHIP_CLASSES).toContain("rounded-full");
    expect(TECH_CHIP_CLASSES).toContain("text-[var(--muted)]");
  });

  it("ICON_BUTTON_VARIANT_CLASSES.outline", () => {
    expect(ICON_BUTTON_VARIANT_CLASSES.outline).toMatchInlineSnapshot(
      `"flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg transition-all duration-200 border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"`
    );
    expect(ICON_BUTTON_VARIANT_CLASSES.outline).toContain("min-h-[48px]");
    expect(ICON_BUTTON_VARIANT_CLASSES.outline).toContain("min-w-[48px]");
    expect(ICON_BUTTON_VARIANT_CLASSES.outline).toContain("border-[var(--border)]");
  });

  it("ICON_BUTTON_VARIANT_CLASSES.outline-accent-hover", () => {
    expect(ICON_BUTTON_VARIANT_CLASSES["outline-accent-hover"]).toMatchInlineSnapshot(
      `"flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg transition-all duration-200 border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"`
    );
    expect(ICON_BUTTON_VARIANT_CLASSES["outline-accent-hover"]).toContain(
      "hover:text-[var(--accent)]"
    );
  });

  it("ICON_BUTTON_VARIANT_CLASSES.outline-accent", () => {
    expect(ICON_BUTTON_VARIANT_CLASSES["outline-accent"]).toMatchInlineSnapshot(
      `"flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg transition-all duration-200 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)]"`
    );
    expect(ICON_BUTTON_VARIANT_CLASSES["outline-accent"]).toContain("border-[var(--accent)]");
    expect(ICON_BUTTON_VARIANT_CLASSES["outline-accent"]).toContain("hover:bg-[var(--accent)]");
  });

  it("DETAILS_SUMMARY_TONE_CLASSES.accent", () => {
    expect(DETAILS_SUMMARY_TONE_CLASSES.accent).toMatchInlineSnapshot(
      `"flex min-h-[48px] items-center gap-1.5 text-xs text-[var(--accent)] transition-opacity hover:opacity-80"`
    );
    expect(DETAILS_SUMMARY_TONE_CLASSES.accent).toContain("min-h-[48px]");
    expect(DETAILS_SUMMARY_TONE_CLASSES.accent).toContain("text-[var(--accent)]");
  });

  it("DETAILS_SUMMARY_TONE_CLASSES.muted", () => {
    expect(DETAILS_SUMMARY_TONE_CLASSES.muted).toMatchInlineSnapshot(
      `"flex min-h-[48px] items-center gap-1.5 text-xs text-[var(--muted)] transition-colors hover:text-[var(--text)]"`
    );
    expect(DETAILS_SUMMARY_TONE_CLASSES.muted).toContain("min-h-[48px]");
    expect(DETAILS_SUMMARY_TONE_CLASSES.muted).toContain("text-[var(--muted)]");
  });
});

describe("primitives emit canonical class strings", () => {
  it("TechChip emits TECH_CHIP_CLASSES verbatim", () => {
    const { container } = render(<TechChip label="TS" />);
    expect(container.querySelector("span")?.className).toBe(TECH_CHIP_CLASSES);
  });

  it("TagBadge (default neutral) emits TAG_BADGE_CLASSES verbatim", () => {
    const { container } = render(<TagBadge label="TS" />);
    expect(container.querySelector("span")?.className).toBe(TAG_BADGE_CLASSES);
  });

  it("TagBadge variant=accent emits TAG_BADGE_VARIANT_CLASSES.accent", () => {
    const { container } = render(<TagBadge label="2x" variant="accent" />);
    expect(container.querySelector("span")?.className).toBe(TAG_BADGE_VARIANT_CLASSES.accent);
  });

  it("tagBadgeClassName helper returns canonical variant string", () => {
    expect(tagBadgeClassName("neutral")).toBe(TAG_BADGE_VARIANT_CLASSES.neutral);
    expect(tagBadgeClassName("accent")).toBe(TAG_BADGE_VARIANT_CLASSES.accent);
  });

  it("StatusPill emits STATUS_PILL_CLASSES verbatim on root span", () => {
    const { container } = render(<StatusPill label="Current" />);
    expect((container.firstElementChild as HTMLElement).className).toBe(STATUS_PILL_CLASSES);
  });

  it("TabPill (active) emits TAB_PILL_BASE + active suffix and aria-selected=true", () => {
    const { getByRole } = render(
      <TabPill active aria-controls="tp-1">
        x
      </TabPill>
    );
    const tab = getByRole("tab");
    expect(tab.className).toBe(`${TAB_PILL_BASE} ${TAB_PILL_ACTIVE_SUFFIX}`);
    expect(tab.getAttribute("aria-selected")).toBe("true");
  });

  it("TabPill (inactive) emits TAB_PILL_BASE + inactive suffix and aria-selected=false", () => {
    const { getByRole } = render(
      <TabPill active={false} aria-controls="tp-2">
        y
      </TabPill>
    );
    const tab = getByRole("tab");
    expect(tab.className).toBe(`${TAB_PILL_BASE} ${TAB_PILL_INACTIVE_SUFFIX}`);
    expect(tab.getAttribute("aria-selected")).toBe("false");
  });

  it("tabPillClassName helper composes constants", () => {
    expect(tabPillClassName(true)).toBe(`${TAB_PILL_BASE} ${TAB_PILL_ACTIVE_SUFFIX}`);
    expect(tabPillClassName(false)).toBe(`${TAB_PILL_BASE} ${TAB_PILL_INACTIVE_SUFFIX}`);
  });

  it.each([["primary" as const], ["secondary" as const], ["ghost" as const]])(
    "ButtonLink %s emits BUTTON_VARIANT_CLASSES[variant] verbatim",
    (variant) => {
      const { container } = render(
        <ButtonLink variant={variant} href="#x">
          Go
        </ButtonLink>
      );
      expect(container.querySelector("a")?.className).toBe(BUTTON_VARIANT_CLASSES[variant]);
    }
  );

  it("buttonClassName helper appends extra without losing variant", () => {
    expect(buttonClassName("primary", "extra-class")).toBe(
      `${BUTTON_VARIANT_CLASSES.primary} extra-class`
    );
  });

  it.each([["outline" as const], ["outline-accent-hover" as const], ["outline-accent" as const]])(
    "IconButton %s emits ICON_BUTTON_VARIANT_CLASSES[variant] verbatim",
    (variant) => {
      const { container } = render(
        <IconButton variant={variant} aria-label="test">
          x
        </IconButton>
      );
      expect(container.querySelector("button")?.className).toBe(
        ICON_BUTTON_VARIANT_CLASSES[variant]
      );
    }
  );

  it("IconButtonLink outline-accent emits ICON_BUTTON_VARIANT_CLASSES['outline-accent']", () => {
    const { container } = render(
      <IconButtonLink variant="outline-accent" href="#x" aria-label="home">
        x
      </IconButtonLink>
    );
    expect(container.querySelector("a")?.className).toBe(
      ICON_BUTTON_VARIANT_CLASSES["outline-accent"]
    );
  });

  it("iconButtonClassName helper appends extra without losing variant", () => {
    expect(iconButtonClassName("outline", "extra-class")).toBe(
      `${ICON_BUTTON_VARIANT_CLASSES.outline} extra-class`
    );
  });

  it.each([["accent" as const], ["muted" as const]])(
    "DetailsSummary %s emits DETAILS_SUMMARY_TONE_CLASSES[tone] verbatim and renders chevron",
    (tone) => {
      const { container } = render(
        <details>
          <DetailsSummary tone={tone} aria-label="x">
            label
          </DetailsSummary>
        </details>
      );
      const summary = container.querySelector("summary");
      expect(summary?.className).toBe(DETAILS_SUMMARY_TONE_CLASSES[tone]);
      expect(summary?.querySelector(".card-details-chevron")).not.toBeNull();
    }
  );

  it("detailsSummaryClassName helper returns canonical tone string", () => {
    expect(detailsSummaryClassName("accent")).toBe(DETAILS_SUMMARY_TONE_CLASSES.accent);
    expect(detailsSummaryClassName("muted")).toBe(DETAILS_SUMMARY_TONE_CLASSES.muted);
  });
});
