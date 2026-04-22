import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ImpactSection from "@/components/impact/ImpactSection";
import type { ImpactStory } from "@/types";

const stories: ImpactStory[] = [
  {
    id: "story-one",
    title: "K-12 Platform Modernisation",
    domain: "Education Technology",
    problem: "Legacy platform could not scale to meet district demand.",
    scope: "350+ engineers across two geos.",
    led: "Full engineering org from architecture through delivery.",
    result: "Unified cloud-native platform with 45% fewer incidents.",
    metric: "30%+ productivity lift. 45% incident reduction.",
  },
  {
    id: "story-two",
    title: "Logistics Platform Rebuild",
    domain: "Freight & Logistics",
    problem: "Legacy .NET MVC system could not support real-time tracking.",
    scope: "Full platform rewrite across freight and warehousing.",
    led: "Architecture design and pre-sales proposal.",
    result: "500K+ daily transactions with real-time cargo tracking.",
    metric: "$2M+ investment secured. 45% load time reduction.",
  },
];

describe("ImpactSection", () => {
  it("renders section with id=impact", () => {
    const { container } = render(<ImpactSection impact={stories} />);
    expect(container.querySelector("#impact")).toBeInTheDocument();
  });

  it("renders all story titles", () => {
    render(<ImpactSection impact={stories} />);
    expect(screen.getByText("K-12 Platform Modernisation")).toBeInTheDocument();
    expect(screen.getByText("Logistics Platform Rebuild")).toBeInTheDocument();
  });

  it("renders domain badges", () => {
    render(<ImpactSection impact={stories} />);
    expect(screen.getByText("Education Technology")).toBeInTheDocument();
    expect(screen.getByText("Freight & Logistics")).toBeInTheDocument();
  });

  it("renders metric callouts as individual bullets", () => {
    render(<ImpactSection impact={stories} />);
    expect(screen.getByText("30%+ productivity lift")).toBeInTheDocument();
    expect(screen.getByText("45% incident reduction")).toBeInTheDocument();
  });

  it("renders scope, role, and outcome labels", () => {
    render(<ImpactSection impact={stories} />);
    expect(screen.getAllByText("Scope").length).toBeGreaterThan(0);
    expect(screen.getAllByText("My Role").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Outcome").length).toBeGreaterThan(0);
  });

  it("renders empty state without error when no stories provided", () => {
    const { container } = render(<ImpactSection impact={[]} />);
    expect(container.querySelector("#impact")).toBeInTheDocument();
  });
});
