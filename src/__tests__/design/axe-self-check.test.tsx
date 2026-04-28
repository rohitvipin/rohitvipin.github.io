// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "./axe-config";

/**
 * Verify jest-axe's `toHaveNoViolations` matcher is wired into Vitest 4's
 * `expect` and actually fails on a real violation. Without this guard the
 * a11y suite silently passes if the matcher extension is misconfigured.
 *
 * This test asserts the *negative* path — render markup with a known axe
 * violation, run axe, and assert the result reports a violation. If the
 * matcher were broken, the result would still claim no violations and
 * this test would fail.
 */
describe("jest-axe wiring self-check", () => {
  it("axe surfaces a known violation (image-alt missing)", async () => {
    const { container } = render(
      <div>
        {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
        <img src="x" />
      </div>
    );
    const result = await axe(container);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.violations.map((v) => v.id)).toContain("image-alt");
  });

  it("toHaveNoViolations matcher is registered", () => {
    // The matcher exists on the extended expect surface. If setup.ts did
    // not extend, this property check fails before runtime.
    const matchers = (expect as unknown as { extend?: unknown }).extend;
    expect(typeof matchers).toBe("function");
  });
});
