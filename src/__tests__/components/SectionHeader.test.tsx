// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/shared/SectionHeader";

describe("SectionHeader", () => {
  it("renders title", () => {
    render(<SectionHeader title="Experience" />);
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<SectionHeader title="Skills" subtitle="Technical expertise" />);
    expect(screen.getByText("Technical expertise")).toBeInTheDocument();
  });

  it("omits subtitle when not provided", () => {
    const { container } = render(<SectionHeader title="Awards" />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });

  it("applies headingId to h2 when provided", () => {
    render(<SectionHeader title="Impact" headingId="impact-section-title" />);
    expect(screen.getByRole("heading", { name: "Impact" })).toHaveAttribute(
      "id",
      "impact-section-title"
    );
  });

  it("renders h2 without id when headingId is omitted", () => {
    render(<SectionHeader title="Skills" />);
    expect(screen.getByRole("heading", { name: "Skills" })).not.toHaveAttribute("id");
  });
});
