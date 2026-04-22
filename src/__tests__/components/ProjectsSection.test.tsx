import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import type { Project } from "@/types";

const clientProject: Project = {
  name: "Client Platform",
  domain: "Education",
  client: "Acme",
  role: "Architect",
  duration: "April 2020 - Present",
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
    expect(screen.getByText("Client Platform")).toBeVisible();
    expect(screen.getByText("OSS Library")).not.toBeVisible();
  });

  it("switches to OSS tab on click", async () => {
    const user = userEvent.setup();
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    await user.click(screen.getByRole("tab", { name: /Open Source/ }));
    expect(screen.getByText("OSS Library")).toBeVisible();
    expect(screen.getByText("Client Platform")).not.toBeVisible();
  });

  it("switches back to Client tab on click", async () => {
    const user = userEvent.setup();
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    await user.click(screen.getByRole("tab", { name: /Open Source/ }));
    await user.click(screen.getByRole("tab", { name: /Client/ }));
    expect(screen.getByText("Client Platform")).toBeVisible();
    expect(screen.getByText("OSS Library")).not.toBeVisible();
  });

  it("renders empty project list without crashing", () => {
    const { container } = render(<ProjectsSection projects={[]} />);
    expect(container.querySelector("#projects")).toBeInTheDocument();
  });

  it("ArrowRight moves focus to next tab and activates it", async () => {
    const user = userEvent.setup();
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    const clientTab = screen.getByRole("tab", { name: /Client Work/ });
    clientTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Open Source/ })).toHaveFocus();
    expect(screen.getByText("OSS Library")).toBeVisible();
  });

  it("ArrowLeft wraps from first tab to last", async () => {
    const user = userEvent.setup();
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    const clientTab = screen.getByRole("tab", { name: /Client Work/ });
    clientTab.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: /Open Source/ })).toHaveFocus();
    expect(screen.getByText("OSS Library")).toBeVisible();
  });

  it("Home key jumps to first tab", async () => {
    const user = userEvent.setup();
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    const ossTab = screen.getByRole("tab", { name: /Open Source/ });
    await user.click(ossTab);
    ossTab.focus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: /Client Work/ })).toHaveFocus();
    expect(screen.getByText("Client Platform")).toBeVisible();
  });

  it("End key jumps to last tab", async () => {
    const user = userEvent.setup();
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    const clientTab = screen.getByRole("tab", { name: /Client Work/ });
    clientTab.focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /Open Source/ })).toHaveFocus();
    expect(screen.getByText("OSS Library")).toBeVisible();
  });

  it("only active tab has tabIndex 0", () => {
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    expect(screen.getByRole("tab", { name: /Client Work/ })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: /Open Source/ })).toHaveAttribute("tabindex", "-1");
  });

  it("aria-selected reflects active tab", async () => {
    const user = userEvent.setup();
    render(<ProjectsSection projects={[clientProject, ossProject]} />);
    expect(screen.getByRole("tab", { name: /Client Work/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: /Open Source/ })).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await user.click(screen.getByRole("tab", { name: /Open Source/ }));
    expect(screen.getByRole("tab", { name: /Open Source/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: /Client Work/ })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });
});
