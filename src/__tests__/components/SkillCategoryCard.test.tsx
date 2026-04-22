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

  it("shows first 10 skills and collapses overflow by default", () => {
    const { container } = render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(container.querySelector("details")).not.toHaveAttribute("open");
  });

  it("shows expand button with hidden count", () => {
    render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    expect(screen.getByRole("button", { name: /Show 2 more Frontend skills/ })).toBeInTheDocument();
  });

  it("expand button opens the details", async () => {
    const user = userEvent.setup();
    const { container } = render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    await user.click(screen.getByRole("button", { name: /Show 2 more Frontend skills/ }));
    expect(container.querySelector("details")).toHaveAttribute("open");
  });

  it("clicking again closes the details", async () => {
    const user = userEvent.setup();
    const { container } = render(<SkillCategoryCard category="Frontend" skills={manySkills} />);
    const summary = screen.getByRole("button", { name: /Show 2 more Frontend skills/ });
    await user.click(summary);
    await user.click(summary);
    expect(container.querySelector("details")).not.toHaveAttribute("open");
  });
});
