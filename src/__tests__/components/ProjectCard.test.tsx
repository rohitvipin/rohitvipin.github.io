// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/types";

const base: Project = {
  name: "Test Project",
  domain: "FinTech",
  role: "Lead Engineer",
  client: "ACME Corp",
  duration: "2023",
  description: "A test project.",
  highlights: ["Improved throughput by 40%"],
  tech: ["TypeScript", "Node.js"],
  products: [],
};

describe("ProjectCard", () => {
  it("renders name, domain, description, role, and client", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("FinTech")).toBeInTheDocument();
    expect(screen.getByText("A test project.")).toBeInTheDocument();
    expect(screen.getByText(/Lead Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/ACME Corp/)).toBeInTheDocument();
  });

  it("renders highlight bullets", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByText("Improved throughput by 40%")).toBeInTheDocument();
  });

  it("renders tech chips", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("renders GitHub link when provided", () => {
    render(<ProjectCard project={{ ...base, github: "https://github.com/test/repo" }} />);
    expect(
      screen.getByRole("link", { name: "GitHub repository for Test Project" })
    ).toHaveAttribute("href", "https://github.com/test/repo");
  });

  it("omits GitHub link when not provided", () => {
    render(<ProjectCard project={base} />);
    expect(
      screen.queryByRole("link", { name: "GitHub repository for Test Project" })
    ).not.toBeInTheDocument();
  });

  it("hides products section when products array is empty", () => {
    const { container } = render(<ProjectCard project={base} />);
    expect(container.querySelector("details")).not.toBeInTheDocument();
  });

  it("renders products summary with toggle label when products exist", () => {
    const withProducts: Project = {
      ...base,
      products: [{ name: "Product Alpha", description: "Core platform." }],
    };
    const { container } = render(<ProjectCard project={withProducts} />);
    const summary = container.querySelector("summary");
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveAttribute("aria-label", expect.stringContaining("Toggle products"));
  });

  it("renders product names in collapsed details", () => {
    const withProducts: Project = {
      ...base,
      products: [{ name: "Product Alpha", description: "Core platform." }],
    };
    render(<ProjectCard project={withProducts} />);
    expect(screen.getByText("Product Alpha")).toBeInTheDocument();
  });
});
