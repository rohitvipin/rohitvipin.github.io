import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectsSection from "@/components/projects/ProjectsSection";
import type { Project } from "@/types";

const clientProject: Project = {
  name: "Client Platform",
  domain: "Education",
  client: "Acme",
  role: "Architect",
  duration: "2020 - Present",
  description: "Built K-12 platform.",
  products: [],
  highlights: ["99.9% uptime"],
  tech: ["AWS", "React"],
};

const ossProject: Project = {
  name: "OSS Library",
  domain: "Open Source",
  client: "Personal",
  role: "Author",
  duration: "2019",
  description: "NuGet package for Xamarin.",
  products: [],
  highlights: [],
  tech: ["C#"],
  github: "https://github.com/test/lib",
};

describe("ProjectsSection", () => {
  it("renders section with id=projects", () => {
    const { container } = render(<ProjectsSection projects={[clientProject, ossProject]} />);
    expect(container.querySelector("#projects")).toBeInTheDocument();
  });

  it("shows client projects by default", () => {
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    expect(screen.getByText("Client Platform")).toBeInTheDocument();
    expect(screen.queryByText("OSS Library")).not.toBeInTheDocument();
  });

  it("switches to OSS tab on click", async () => {
    const user = userEvent.setup();
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    await user.click(screen.getByRole("tab", { name: /Open Source/ }));
    expect(screen.getByText("OSS Library")).toBeInTheDocument();
    expect(screen.queryByText("Client Platform")).not.toBeInTheDocument();
  });

  it("switches back to Client tab on click", async () => {
    const user = userEvent.setup();
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    await user.click(screen.getByRole("tab", { name: /Open Source/ }));
    await user.click(screen.getByRole("tab", { name: /Client/ }));
    expect(screen.getByText("Client Platform")).toBeInTheDocument();
    expect(screen.queryByText("OSS Library")).not.toBeInTheDocument();
  });

  it("renders empty project list without crashing", () => {
    const { container } = render(<ProjectsSection projects={[]} />);
    expect(container.querySelector("#projects")).toBeInTheDocument();
  });
});
