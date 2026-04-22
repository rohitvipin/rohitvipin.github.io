// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("shows highlight count in summary", () => {
    render(<CommunityCard entry={entry} />);
    expect(screen.getByRole("button", { name: /Show 3 highlights/ })).toBeInTheDocument();
  });

  it("expands details on click", async () => {
    const user = userEvent.setup();
    const { container } = render(<CommunityCard entry={entry} />);
    const details = container.querySelector("details")!;
    expect(details).not.toHaveAttribute("open");
    await user.click(screen.getByRole("button", { name: /Show 3 highlights/ }));
    expect(details).toHaveAttribute("open");
  });

  it("collapses details on second click", async () => {
    const user = userEvent.setup();
    const { container } = render(<CommunityCard entry={entry} />);
    const details = container.querySelector("details")!;
    await user.click(screen.getByRole("button", { name: /Show 3 highlights/ }));
    expect(details).toHaveAttribute("open");
    await user.click(screen.getByRole("button", { name: /Show 3 highlights/ }));
    expect(details).not.toHaveAttribute("open");
  });
});
