// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommunityCard from "@/components/community/CommunityCard";
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
    const { location: _l, ...noLocation } = entry;
    const { container } = render(<CommunityCard entry={noLocation} />);
    expect(
      container.querySelector("p.text-xs.text-\\[var\\(--muted-2\\)\\]")
    ).not.toBeInTheDocument();
  });

  it("shows highlight count in button before expand", () => {
    render(<CommunityCard entry={entry} />);
    expect(screen.getByRole("button")).toHaveTextContent("Show 3 highlights");
  });

  it("expands and shows highlights on click", async () => {
    const user = userEvent.setup();
    render(<CommunityCard entry={entry} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("300 attendees")).toBeInTheDocument();
    expect(screen.getByText("Q&A session")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Hide details");
  });

  it("collapses highlights on second click", async () => {
    const user = userEvent.setup();
    render(<CommunityCard entry={entry} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));
    expect(screen.queryByText("300 attendees")).not.toBeInTheDocument();
  });
});
