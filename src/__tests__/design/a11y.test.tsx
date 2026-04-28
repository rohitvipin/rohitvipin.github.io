// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "./axe-config";
import { TechChip } from "@/components/shared/TechChip";
import { TagBadge } from "@/components/shared/TagBadge";
import { StatusPill } from "@/components/shared/StatusPill";
import { TabPill } from "@/components/shared/TabPill";
import { Button, ButtonLink } from "@/components/shared/Button";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { fixtureSocials } from "@/__tests__/__fixtures__";

/**
 * jest-axe runs in jsdom and only catches structural a11y. Layout-,
 * contrast-, and focus-order-dependent rules are disabled in axe-config.ts
 * — those dimensions are owned by the Playwright suite (real browser).
 */
describe("design primitives — structural a11y", () => {
  it("TechChip has no axe violations", async () => {
    const { container } = render(<TechChip label="TypeScript" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TagBadge has no axe violations", async () => {
    const { container } = render(<TagBadge label="React" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("StatusPill has no axe violations", async () => {
    const { container } = render(<StatusPill label="Current" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TabPill needs a tablist parent — assert structural soundness on a complete pill group", async () => {
    const { container } = render(
      <div>
        <div role="tablist" aria-label="categories">
          <TabPill active id="design-tp-tab-1" aria-controls="design-tp-panel-1">
            A
          </TabPill>
          <TabPill active={false} id="design-tp-tab-2" aria-controls="design-tp-panel-2">
            B
          </TabPill>
        </div>
        <div role="tabpanel" id="design-tp-panel-1" aria-labelledby="design-tp-tab-1">
          Panel A
        </div>
        <div role="tabpanel" id="design-tp-panel-2" aria-labelledby="design-tp-tab-2" hidden>
          Panel B
        </div>
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Button (primary) has no axe violations", async () => {
    const { container } = render(<Button variant="primary">Go</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ButtonLink has no axe violations", async () => {
    const { container } = render(
      <ButtonLink variant="ghost" href="#main" aria-label="Scroll to main">
        Skip
      </ButtonLink>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SectionHeader has no axe violations", async () => {
    const { container } = render(<SectionHeader title="Skills" subtitle="What I work with" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SocialLinks has no axe violations", async () => {
    const { container } = render(<SocialLinks socials={[...fixtureSocials]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
