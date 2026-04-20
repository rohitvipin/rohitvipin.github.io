// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "@/components/about/About";
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

  it("renders location", () => {
    render(<About profile={baseProfile} />);
    expect(screen.getByText("Kerala, India")).toBeInTheDocument();
  });

  it("renders years of experience", () => {
    render(<About profile={baseProfile} />);
    expect(
      screen.getByText((_, el) => el?.textContent === "10+ years experience")
    ).toBeInTheDocument();
  });

  it("renders email link", () => {
    render(<About profile={baseProfile} />);
    const emailLink = screen.getByRole("link", { name: "test@example.com" });
    expect(emailLink).toHaveAttribute("href", "mailto:test@example.com");
  });

  it("renders timezone", () => {
    render(<About profile={baseProfile} />);
    expect(screen.getByText("IST (UTC+5:30)")).toBeInTheDocument();
  });
});
