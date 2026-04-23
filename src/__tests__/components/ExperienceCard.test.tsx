// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import type { ExperienceEntry } from "@/types";

const base: ExperienceEntry = {
  role: "Senior Engineer",
  company: "Test Co",
  location: "Remote",
  duration: "Jan 2023 - Present",
  current: false,
  description: "Built great things.",
  highlights: ["Shipped feature A", "Reduced latency by 30%"],
  techStack: ["TypeScript", "React"],
};

describe("ExperienceCard", () => {
  it("renders role, company, location, and duration", () => {
    render(<ExperienceCard entry={base} />);
    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
    expect(screen.getByText("Test Co")).toBeInTheDocument();
    expect(screen.getByText(/Remote/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 2023/)).toBeInTheDocument();
  });

  it("collapses highlights for non-current entries by default", () => {
    const { container } = render(<ExperienceCard entry={base} />);
    expect(container.querySelector("details")).not.toHaveAttribute("open");
  });

  it("auto-expands highlights for current entry", () => {
    const { container } = render(<ExperienceCard entry={{ ...base, current: true }} />);
    expect(container.querySelector("details")).toHaveAttribute("open");
  });

  it("shows Current badge for current entry", () => {
    render(<ExperienceCard entry={{ ...base, current: true }} />);
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("renders summary toggle with correct accessible label", () => {
    const { container } = render(<ExperienceCard entry={base} />);
    const summary = container.querySelector("summary");
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveAttribute(
      "aria-label",
      "Toggle highlights for Senior Engineer at Test Co"
    );
  });

  it("renders tech stack chips", () => {
    render(<ExperienceCard entry={base} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });
});
