// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "@/components/about/About";
import type { Profile } from "@/types";

const baseProfile: Profile = {
  name: "Test User",
  title: "Engineer",
  headline: "Building things",
  location: "Kerala, India",
  bio: "First paragraph.\n\nSecond paragraph.",
  email: "test@example.com",
  phone: "+91 000 000 0000",
  years_of_experience: 10,
  timezone: "IST (UTC+5:30)",
  availability_status: "open",
  profile_picture: "/photo.jpg",
  github_avatar: "https://avatars.githubusercontent.com/u/123",
  key_metrics: [],
};

const profileWithValueProps: Profile = {
  ...baseProfile,
  value_propositions: [
    { audience: "Recruiter", value: "15 years, strong on architecture and delivery." },
    { audience: "Hiring Manager", value: "I own outcomes, not headcount reports." },
    { audience: "Founder", value: "I can modernise your platform and get AI into your roadmap." },
  ],
};

const profileWithQuote: Profile = {
  ...baseProfile,
  bio_quote: "Teams don't win on cost - they win on trust.",
};

describe("About", () => {
  it("renders section with id=about", () => {
    const { container } = render(<About profile={baseProfile} />);
    expect(container.querySelector("#about")).toBeInTheDocument();
  });

  it("renders each bio paragraph separately", () => {
    render(<About profile={baseProfile} />);
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("renders single-paragraph bio as one paragraph element", () => {
    const { container } = render(
      <About profile={{ ...baseProfile, bio: "Single paragraph only." }} />
    );
    const paras = container.querySelectorAll("p.text-\\[var\\(--muted\\)\\]");
    expect(paras.length).toBe(1);
    expect(paras[0]).toHaveTextContent("Single paragraph only.");
  });

  it("does not render value propositions when absent", () => {
    render(<About profile={baseProfile} />);
    expect(screen.queryByText("Recruiter")).not.toBeInTheDocument();
  });

  it("does not render blockquote when bio_quote absent", () => {
    const { container } = render(<About profile={baseProfile} />);
    expect(container.querySelector("blockquote")).not.toBeInTheDocument();
  });

  it("renders bio_quote inside a blockquote when present", () => {
    render(<About profile={profileWithQuote} />);
    const quote = screen.getByText(/Teams don't win on cost/);
    expect(quote.closest("blockquote")).toBeInTheDocument();
  });
});

describe("About — value propositions", () => {
  it("renders each audience label", () => {
    render(<About profile={profileWithValueProps} />);
    expect(screen.getByText("Recruiter")).toBeInTheDocument();
    expect(screen.getByText("Hiring Manager")).toBeInTheDocument();
    expect(screen.getByText("Founder")).toBeInTheDocument();
  });

  it("renders value text for each proposition", () => {
    render(<About profile={profileWithValueProps} />);
    expect(screen.getByText("15 years, strong on architecture and delivery.")).toBeInTheDocument();
    expect(screen.getByText("I own outcomes, not headcount reports.")).toBeInTheDocument();
  });
});
