import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LeadershipSection } from "@/components/leadership/LeadershipSection";
import type { Leadership } from "@/types";

const baseLeadership: Leadership = {
  title: "Leadership Philosophy",
  sections: [
    {
      title: "Engineering Culture",
      description: "Ownership is non-negotiable. Teams win on trust, not cost.",
    },
    {
      title: "Team Scaling",
      description: "Hire for ownership mindset and learning velocity.",
    },
  ],
};

describe("LeadershipSection", () => {
  it("renders section with id=expertise", () => {
    const { container } = render(<LeadershipSection leadership={baseLeadership} />);
    expect(container.querySelector("#expertise")).toBeInTheDocument();
  });

  it("renders leadership title as section header", () => {
    render(<LeadershipSection leadership={baseLeadership} />);
    expect(screen.getByText("Leadership Philosophy")).toBeInTheDocument();
  });

  it("renders all subsection titles", () => {
    render(<LeadershipSection leadership={baseLeadership} />);
    expect(screen.getByText("Engineering Culture")).toBeInTheDocument();
    expect(screen.getByText("Team Scaling")).toBeInTheDocument();
  });

  it("renders all subsection descriptions", () => {
    render(<LeadershipSection leadership={baseLeadership} />);
    expect(
      screen.getByText("Ownership is non-negotiable. Teams win on trust, not cost.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hire for ownership mindset and learning velocity.")
    ).toBeInTheDocument();
  });

  it("renders empty sections without crashing", () => {
    const { container } = render(
      <LeadershipSection leadership={{ title: "Leadership", sections: [] }} />
    );
    expect(container.querySelector("#expertise")).toBeInTheDocument();
  });
});
