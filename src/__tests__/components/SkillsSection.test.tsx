import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillsSection from "@/components/skills/SkillsSection";
import type { SkillCategory } from "@/types";

const baseSkills: SkillCategory[] = [
  { category: "Frontend", skills: ["React", "TypeScript"] },
  { category: "Backend", skills: ["Node.js", "Go"] },
];

describe("SkillsSection", () => {
  it("renders section with id=skills", () => {
    const { container } = render(<SkillsSection skills={baseSkills} />);
    expect(container.querySelector("#skills")).toBeInTheDocument();
  });

  it("renders each category name", () => {
    render(<SkillsSection skills={baseSkills} />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("renders skill chips within each category", () => {
    render(<SkillsSection skills={baseSkills} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
  });

  it("renders empty state without crashing", () => {
    const { container } = render(<SkillsSection skills={[]} />);
    expect(container.querySelector("#skills")).toBeInTheDocument();
  });
});
