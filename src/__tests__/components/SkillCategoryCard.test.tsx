import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    render(<SkillCategoryCard category="Backend" skills={["Node.js", "Go"]} />);
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /more/ })).not.toBeInTheDocument();
  });

  it("shows first 10 skills and hides overflow by default", () => {
    render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.queryByText("Storybook")).not.toBeInTheDocument();
    expect(screen.queryByText("Figma")).not.toBeInTheDocument();
  });

  it("shows expand button with hidden count", () => {
    render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    expect(screen.getByRole("button", { name: /Show 2 more Frontend skills/ })).toBeInTheDocument();
  });

  it("expand button reveals all skills", async () => {
    const user = userEvent.setup();
    render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    await user.click(screen.getByRole("button", { name: /Show 2 more Frontend skills/ }));
    expect(screen.getByText("Storybook")).toBeInTheDocument();
    expect(screen.getByText("Figma")).toBeInTheDocument();
  });

  it("show less button collapses back to 10", async () => {
    const user = userEvent.setup();
    render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    await user.click(screen.getByRole("button", { name: /Show 2 more Frontend skills/ }));
    await user.click(screen.getByRole("button", { name: /Show fewer Frontend skills/ }));
    expect(screen.queryByText("Storybook")).not.toBeInTheDocument();
    expect(screen.queryByText("Figma")).not.toBeInTheDocument();
  });
});
