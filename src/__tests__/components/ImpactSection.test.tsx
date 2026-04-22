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
    metrics: ["30%+ productivity lift", "45% incident reduction"],
  },
  {
    id: "story-two",
    title: "Logistics Platform Rebuild",
    domain: "Freight & Logistics",
    problem: "Legacy .NET MVC system could not support real-time tracking.",
    scope: "Full platform rewrite across freight and warehousing.",
    led: "Architecture design and pre-sales proposal.",
    result: "500K+ daily transactions with real-time cargo tracking.",
    metrics: ["$2M+ investment secured", "45% load time reduction"],
  },
];

describe("ImpactSection", () => {
  it("renders section as a region landmark", () => {
    render(<ImpactSection impact={stories} />);
    expect(screen.getByRole("region", { name: "Transformations" })).toBeInTheDocument();
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

  it("renders each metric in the array as a bullet", () => {
    render(<ImpactSection impact={stories} />);
    expect(screen.getByText("30%+ productivity lift")).toBeInTheDocument();
    expect(screen.getByText("45% incident reduction")).toBeInTheDocument();
    expect(screen.getByText("$2M+ investment secured")).toBeInTheDocument();
  });

  it("renders Problem label alongside story problem text", () => {
    render(<ImpactSection impact={stories} />);
    expect(screen.getAllByText("Problem:").length).toBe(stories.length);
    expect(
      screen.getByText("Legacy platform could not scale to meet district demand.")
    ).toBeInTheDocument();
  });

  it("renders scope, role, and outcome labels", () => {
    render(<ImpactSection impact={stories} />);
    expect(screen.getAllByText("Scope").length).toBe(stories.length);
    expect(screen.getAllByText("My Role").length).toBe(stories.length);
    expect(screen.getAllByText("Outcome").length).toBe(stories.length);
  });

  it("renders empty state without error when no stories provided", () => {
    render(<ImpactSection impact={[]} />);
    expect(screen.getByRole("region", { name: "Transformations" })).toBeInTheDocument();
  });

  it("renders a story with a single metric", () => {
    const single: ImpactStory[] = [{ ...stories[0], metrics: ["45% cost reduction"] }];
    render(<ImpactSection impact={single} />);
    expect(screen.getByText("45% cost reduction")).toBeInTheDocument();
  });

  it("articles have aria-labelledby referencing story title id", () => {
    const { container } = render(<ImpactSection impact={stories} />);
    const articles = container.querySelectorAll("article");
    articles.forEach((article) => {
      expect(article).toHaveAttribute("aria-labelledby");
      const labelId = article.getAttribute("aria-labelledby") ?? "";
      expect(container.querySelector(`#${labelId}`)).toBeInTheDocument();
    });
  });

  it("metric bullet container has aria-label Key outcomes", () => {
    const { container } = render(<ImpactSection impact={stories} />);
    const groups = container.querySelectorAll('[aria-label="Key outcomes"]');
    expect(groups.length).toBe(stories.length);
  });
});
