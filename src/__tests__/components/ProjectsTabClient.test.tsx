import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Project } from "@/types";

vi.mock("@/components/projects/ProjectCard", () => ({
  ProjectCard: ({ project }: { project: Project }) => (
    <div data-testid="project-card">{project.name}</div>
  ),
}));

vi.mock("@/lib/projects", () => ({
  partitionProjects: vi.fn(),
}));

import { partitionProjects } from "@/lib/projects";
import { ProjectsTabClient } from "@/components/projects/ProjectsTabClient";

const makeProject = (name: string): Project => ({
  name,
  domain: "Test",
  client: "Client",
  role: "Lead",
  duration: "2023",
  description: "Desc",
  products: [],
  highlights: [],
  tech: [],
});

const clientProjects = [makeProject("Client Alpha"), makeProject("Client Beta")];
const ossProjects = [makeProject("OSS Delta")];

beforeEach(() => {
  vi.mocked(partitionProjects).mockReturnValue({ clientProjects, ossProjects });
});

describe("ProjectsTabClient", () => {
  it("renders tablist with both tabs", () => {
    render(<ProjectsTabClient projects={[]} />);
    expect(screen.getByRole("tablist", { name: /project categories/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /client work/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /open source/i })).toBeInTheDocument();
  });

  it("Client Work tab selected by default", () => {
    render(<ProjectsTabClient projects={[]} />);
    expect(screen.getByRole("tab", { name: /client work/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: /open source/i })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("client projects visible in default panel", () => {
    render(<ProjectsTabClient projects={[]} />);
    expect(screen.getByText("Client Alpha")).toBeInTheDocument();
    expect(screen.getByText("Client Beta")).toBeInTheDocument();
  });

  it("OSS panel is hidden initially", () => {
    render(<ProjectsTabClient projects={[]} />);
    const ossPanel = document.getElementById("tabpanel-oss");
    expect(ossPanel).toHaveAttribute("hidden");
  });

  it("clicking Open Source tab switches active tab and panel", async () => {
    const user = userEvent.setup();
    render(<ProjectsTabClient projects={[]} />);

    await user.click(screen.getByRole("tab", { name: /open source/i }));

    expect(screen.getByRole("tab", { name: /open source/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: /client work/i })).toHaveAttribute(
      "aria-selected",
      "false"
    );
    expect(screen.getByText("OSS Delta")).toBeInTheDocument();

    const clientPanel = document.getElementById("tabpanel-client");
    expect(clientPanel).toHaveAttribute("hidden");
  });

  it("ArrowRight moves to next tab", async () => {
    const user = userEvent.setup();
    render(<ProjectsTabClient projects={[]} />);

    screen.getByRole("tab", { name: /client work/i }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: /open source/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("ArrowRight wraps from last to first tab", async () => {
    const user = userEvent.setup();
    render(<ProjectsTabClient projects={[]} />);

    await user.click(screen.getByRole("tab", { name: /open source/i }));
    screen.getByRole("tab", { name: /open source/i }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: /client work/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("ArrowLeft moves to previous tab", async () => {
    const user = userEvent.setup();
    render(<ProjectsTabClient projects={[]} />);

    await user.click(screen.getByRole("tab", { name: /open source/i }));
    screen.getByRole("tab", { name: /open source/i }).focus();
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("tab", { name: /client work/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("Home key jumps to first tab", async () => {
    const user = userEvent.setup();
    render(<ProjectsTabClient projects={[]} />);

    await user.click(screen.getByRole("tab", { name: /open source/i }));
    screen.getByRole("tab", { name: /open source/i }).focus();
    await user.keyboard("{Home}");

    expect(screen.getByRole("tab", { name: /client work/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("End key jumps to last tab", async () => {
    const user = userEvent.setup();
    render(<ProjectsTabClient projects={[]} />);

    screen.getByRole("tab", { name: /client work/i }).focus();
    await user.keyboard("{End}");

    expect(screen.getByRole("tab", { name: /open source/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("empty OSS list renders empty panel without crashing", () => {
    vi.mocked(partitionProjects).mockReturnValue({ clientProjects, ossProjects: [] });
    render(<ProjectsTabClient projects={[]} />);
    const ossPanel = document.getElementById("tabpanel-oss");
    expect(ossPanel).toBeInTheDocument();
  });
});
