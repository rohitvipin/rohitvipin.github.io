import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillCategoryCard } from "@/components/skills/SkillCategoryCard";

const manySkills = [
  "React",
  "TypeScript",
  "CSS",
  "HTML",
  "Next.js",
  "Tailwind",
  "Vite",
  "Webpack",
  "Jest",
  "Vitest",
  "Storybook",
  "Figma",
];

describe("SkillCategoryCard", () => {
  it("renders category name", () => {
    render(<SkillCategoryCard category="Frontend" skills={["React"]} />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
  });

  it("shows all skills when count is within initial limit", () => {
    const { container } = render(
      <SkillCategoryCard category="Backend" skills={["Node.js", "Go"]} />
    );
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
    expect(container.querySelector("summary")).not.toBeInTheDocument();
  });

  it("shows first 10 skills and collapses overflow by default", () => {
    const { container } = render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(container.querySelector("details")).not.toHaveAttribute("open");
  });

  it("renders summary with correct accessible label and overflow count", () => {
    const { container } = render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    const summary = container.querySelector("summary");
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveAttribute("aria-label", "Show 2 more Frontend skills");
  });

  it("renders overflow skills in collapsed details", () => {
    render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    expect(screen.getByText("Storybook")).toBeInTheDocument();
    expect(screen.getByText("Figma")).toBeInTheDocument();
  });
});
