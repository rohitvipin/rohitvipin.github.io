// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TechChip } from "@/components/shared/TechChip";
import { TagBadge } from "@/components/shared/TagBadge";
import { StatusPill } from "@/components/shared/StatusPill";
import { TabPill, tabPillClassName } from "@/components/shared/TabPill";
import { ButtonLink, buttonClassName } from "@/components/shared/Button";

/**
 * Class-contract tests for shared primitives. Inline snapshots double as the
 * canonical class string per pattern in docs/DESIGN.md. Anchor `toContain`
 * assertions catch silent token drift even if the snapshot is updated.
 */

describe("TechChip class contract", () => {
  it("matches DESIGN.md TechChip spec", () => {
    const { container } = render(<TechChip label="TS" />);
    const span = container.querySelector("span");
    expect(span?.className).toMatchInlineSnapshot(
      `"inline-block cursor-default rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-xs text-[var(--muted)] transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]"`
    );
    expect(span?.className).toContain("rounded-full");
    expect(span?.className).toContain("border-[var(--border)]");
    expect(span?.className).toContain("text-[var(--muted)]");
  });
});

describe("TagBadge class contract", () => {
  it("matches DESIGN.md tag badge spec", () => {
    const { container } = render(<TagBadge label="TS" />);
    const span = container.querySelector("span");
    expect(span?.className).toMatchInlineSnapshot(
      `"rounded-md border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted-2)]"`
    );
    expect(span?.className).toContain("rounded-md");
    expect(span?.className).toContain("text-[var(--muted-2)]");
  });
});

describe("StatusPill class contract", () => {
  it("matches DESIGN.md status pill spec", () => {
    const { container } = render(<StatusPill label="Current" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatchInlineSnapshot(
      `"inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-glow)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]"`
    );
    expect(root.className).toContain("bg-[var(--accent-glow)]");
    expect(root.className).toContain("text-[var(--accent)]");
    const pulse = root.querySelector("span");
    expect(pulse?.className).toContain("animate-pulse");
  });
});

describe("TabPill class contract", () => {
  it("active variant", () => {
    expect(tabPillClassName(true)).toMatchInlineSnapshot(
      `"flex min-h-[48px] items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150 active:scale-[0.97] bg-[var(--accent)] text-[var(--bg)]"`
    );
  });

  it("inactive variant", () => {
    expect(tabPillClassName(false)).toMatchInlineSnapshot(
      `"flex min-h-[48px] items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150 active:scale-[0.97] text-[var(--muted)] hover:text-[var(--text)]"`
    );
  });

  it("renders role=tab and 48px touch target", () => {
    const { getByRole } = render(
      <TabPill active aria-controls="tp-1">
        Label
      </TabPill>
    );
    const button = getByRole("tab");
    expect(button.className).toContain("min-h-[48px]");
  });
});

describe("Button class contract", () => {
  it("primary variant", () => {
    expect(buttonClassName("primary")).toMatchInlineSnapshot(
      `"inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 active:opacity-75"`
    );
  });

  it("secondary variant", () => {
    expect(buttonClassName("secondary")).toMatchInlineSnapshot(
      `"inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[var(--accent)]/50 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/8 active:bg-[var(--accent)]/15"`
    );
  });

  it("ghost variant", () => {
    expect(buttonClassName("ghost")).toMatchInlineSnapshot(
      `"inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] active:opacity-75"`
    );
  });

  it("ButtonLink renders an anchor with the variant classes", () => {
    const { container } = render(
      <ButtonLink variant="primary" href="#x">
        Go
      </ButtonLink>
    );
    const a = container.querySelector("a");
    expect(a?.getAttribute("href")).toBe("#x");
    expect(a?.className).toContain("min-h-[48px]");
    expect(a?.className).toContain("bg-[var(--accent)]");
  });

  it("appends extra className without losing variant", () => {
    expect(buttonClassName("primary", "extra-class")).toContain("extra-class");
    expect(buttonClassName("primary", "extra-class")).toContain("bg-[var(--accent)]");
  });
});
