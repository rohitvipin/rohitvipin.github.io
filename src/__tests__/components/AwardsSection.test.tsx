// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AwardsSection } from "@/components/awards/AwardsSection";
import type { Award } from "@/types";

const awards: Award[] = [
  {
    title: "Best Engineer 2023",
    organization: "Tech Guild",
    year: "2023",
    description: "Awarded for platform work.",
  },
  {
    title: "Open Source Contributor",
    organization: "OSS Foundation",
    year: null,
    description: "For sustained contributions.",
  },
];

describe("AwardsSection", () => {
  it("renders section with id awards", () => {
    const { container } = render(<AwardsSection awards={awards} />);
    expect(container.querySelector("section#awards")).toBeInTheDocument();
  });

  it("renders all award titles", () => {
    render(<AwardsSection awards={awards} />);
    expect(screen.getByText("Best Engineer 2023")).toBeInTheDocument();
    expect(screen.getByText("Open Source Contributor")).toBeInTheDocument();
  });

  it("renders organizations and descriptions", () => {
    render(<AwardsSection awards={awards} />);
    expect(screen.getByText("Tech Guild")).toBeInTheDocument();
    expect(screen.getByText("Awarded for platform work.")).toBeInTheDocument();
  });

  it("renders year when provided", () => {
    render(<AwardsSection awards={awards} />);
    expect(screen.getByText("2023")).toBeInTheDocument();
  });

  it("omits year element when null", () => {
    render(<AwardsSection awards={awards} />);
    const yearSpans = screen.getAllByText(/^\d{4}$/).filter((el) => el.tagName === "SPAN");
    expect(yearSpans).toHaveLength(1);
  });

  it("renders empty grid for empty awards array", () => {
    const { container } = render(<AwardsSection awards={[]} />);
    expect(container.querySelectorAll(".card")).toHaveLength(0);
  });
});
