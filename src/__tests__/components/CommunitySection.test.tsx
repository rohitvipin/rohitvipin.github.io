import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CommunitySection } from "@/components/community/CommunitySection";
import type { CommunityEntry } from "@/types";

const baseCommunity: CommunityEntry[] = [
  {
    type: "Conference Speaking",
    title: "Cloud Summit 2024",
    location: "Bangalore",
    description: "Spoke about distributed systems.",
    highlights: ["200 attendees", "Q&A session"],
  },
  {
    type: "Open Source",
    title: "Xamarin MAUI Library",
    description: "NuGet package with 50K downloads.",
    highlights: ["50K downloads"],
  },
];

describe("CommunitySection", () => {
  it("renders section with id=community", () => {
    const { container } = render(<CommunitySection community={baseCommunity} />);
    expect(container.querySelector("#community")).toBeInTheDocument();
  });

  it("renders all community entry titles", () => {
    render(<CommunitySection community={baseCommunity} />);
    expect(screen.getByText("Cloud Summit 2024")).toBeInTheDocument();
    expect(screen.getByText("Xamarin MAUI Library")).toBeInTheDocument();
  });

  it("renders entry descriptions", () => {
    render(<CommunitySection community={baseCommunity} />);
    expect(screen.getByText("Spoke about distributed systems.")).toBeInTheDocument();
    expect(screen.getByText("NuGet package with 50K downloads.")).toBeInTheDocument();
  });

  it("renders entry type labels", () => {
    render(<CommunitySection community={baseCommunity} />);
    expect(screen.getByText("Conference Speaking")).toBeInTheDocument();
    expect(screen.getByText("Open Source")).toBeInTheDocument();
  });

  it("renders empty state without crashing", () => {
    const { container } = render(<CommunitySection community={[]} />);
    expect(container.querySelector("#community")).toBeInTheDocument();
  });
});
