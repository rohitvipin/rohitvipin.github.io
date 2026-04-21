// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TechChip from "@/components/shared/TechChip";

describe("TechChip", () => {
  it("renders label text", () => {
    render(<TechChip label="TypeScript" />);
    const chips = screen.getAllByText("TypeScript");
    expect(chips.length).toBeGreaterThan(0);
  });

  it("renders as a span element", () => {
    const { container } = render(<TechChip label="React" />);
    expect(container.querySelector("span")).toHaveTextContent("React");
  });

  it("renders tooltip with full label", () => {
    render(<TechChip label="TypeScript" />);
    const instances = screen.getAllByText("TypeScript");
    expect(instances).toHaveLength(2);
  });
});
