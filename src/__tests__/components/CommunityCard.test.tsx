// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CommunityCard } from "@/components/community/CommunityCard";
import type { CommunityEntry } from "@/types";

const entry: CommunityEntry = {
  type: "Conference Speaking",
  title: "Test Talk",
  location: "London, UK",
  description: "Spoke about distributed systems.",
  highlights: ["300 attendees", "Q&A session", "Workshop follow-up"],
};

describe("CommunityCard", () => {
  it("renders type, title, and description", () => {
    render(<CommunityCard entry={entry} />);
    expect(screen.getByText("Conference Speaking")).toBeInTheDocument();
    expect(screen.getByText("Test Talk")).toBeInTheDocument();
    expect(screen.getByText("Spoke about distributed systems.")).toBeInTheDocument();
  });

  it("renders location when provided", () => {
    render(<CommunityCard entry={entry} />);
    expect(screen.getByText("London, UK")).toBeInTheDocument();
  });

  it("omits location when not provided", () => {
    const { location: _location, ...noLocation } = entry;
    render(<CommunityCard entry={noLocation} />);
    expect(screen.queryByText("London, UK")).not.toBeInTheDocument();
  });

  it("renders summary with correct accessible label and highlight count", () => {
    const { container } = render(<CommunityCard entry={entry} />);
    const summary = container.querySelector("summary");
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveAttribute("aria-label", expect.stringContaining("3"));
  });

  it("renders highlights in collapsed details", () => {
    render(<CommunityCard entry={entry} />);
    expect(screen.getByText("300 attendees")).toBeInTheDocument();
    expect(screen.getByText("Q&A session")).toBeInTheDocument();
    expect(screen.getByText("Workshop follow-up")).toBeInTheDocument();
  });

  it("starts with details closed", () => {
    const { container } = render(<CommunityCard entry={entry} />);
    expect(container.querySelector("details")).not.toHaveAttribute("open");
  });
});
