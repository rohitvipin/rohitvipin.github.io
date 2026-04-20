import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import type { ExperienceEntry } from "@/types";

const baseExperience: ExperienceEntry[] = [
  {
    company: "Acme Corp",
    role: "Staff Engineer",
    location: "Remote",
    duration: "2020 - Present",
    current: true,
    description: "Led platform engineering.",
    highlights: ["Built microservices", "Reduced costs 40%"],
    techStack: ["TypeScript", "AWS"],
  },
  {
    company: "Beta Inc",
    role: "Senior Engineer",
    location: "Bangalore",
    duration: "2018 - 2020",
    current: false,
    description: "Full stack development.",
    highlights: ["Shipped v2"],
    techStack: ["React"],
  },
];

describe("ExperienceTimeline", () => {
  it("renders section with id=experience", () => {
    const { container } = render(
      <ExperienceTimeline experience={baseExperience} yearsOfExperience={14} />
    );
    expect(container.querySelector("#experience")).toBeInTheDocument();
  });

  it("renders years of experience in subtitle", () => {
    render(<ExperienceTimeline experience={baseExperience} yearsOfExperience={14} />);
    expect(screen.getByText(/14\+ years/)).toBeInTheDocument();
  });

  it("renders all experience entries", () => {
    render(<ExperienceTimeline experience={baseExperience} yearsOfExperience={14} />);
    expect(screen.getByText("Staff Engineer")).toBeInTheDocument();
    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Beta Inc")).toBeInTheDocument();
  });

  it("renders empty state with no entries", () => {
    const { container } = render(<ExperienceTimeline experience={[]} yearsOfExperience={0} />);
    expect(container.querySelector("#experience")).toBeInTheDocument();
    expect(screen.queryByText("Staff Engineer")).not.toBeInTheDocument();
  });
});
