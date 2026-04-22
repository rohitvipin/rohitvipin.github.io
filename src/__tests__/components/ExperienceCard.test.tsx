// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    render(<ExperienceCard entry={base} />);
    expect(screen.queryByText("Shipped feature A")).not.toBeInTheDocument();
  });

  it("auto-expands highlights for current entry", () => {
    render(<ExperienceCard entry={{ ...base, current: true }} />);
    expect(screen.getByText("Shipped feature A")).toBeInTheDocument();
  });

  it("shows Current badge for current entry", () => {
    render(<ExperienceCard entry={{ ...base, current: true }} />);
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("toggle expands then collapses highlights", async () => {
    const user = userEvent.setup();
    render(<ExperienceCard entry={base} />);
    await user.click(screen.getByRole("button", { name: /Expand Senior Engineer/ }));
    expect(screen.getByText("Shipped feature A")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Collapse Senior Engineer/ }));
    expect(screen.queryByText("Shipped feature A")).not.toBeInTheDocument();
  });

  it("renders tech stack chips", () => {
    render(<ExperienceCard entry={base} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });
});
