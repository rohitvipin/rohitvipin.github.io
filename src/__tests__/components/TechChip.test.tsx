// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TechChip } from "@/components/shared/TechChip";

describe("TechChip", () => {
  it("renders label text", () => {
    render(<TechChip label="TypeScript" />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    const { container } = render(<TechChip label="React" />);
    expect(container.querySelector("span")).toHaveTextContent("React");
  });
});
