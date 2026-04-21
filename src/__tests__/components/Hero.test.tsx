import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/hero/Hero";
import type { Profile, Social } from "@/types";

const baseProfile: Profile = {
  name: "Rohit Test",
  title: "Director of Engineering",
  headline: "Leading teams across continents.",
  location: "Kerala, India",
  bio: "Bio text.",
  email: "test@example.com",
  phone: "+91 000 000 0000",
  years_of_experience: 14,
  timezone: "IST (UTC+5:30)",
  availability_status: "open",
  github_avatar: "https://avatars.githubusercontent.com/u/123",
  tags: ["Architect", "Speaker"],
  key_metrics: [
    { label: "Engineers Led", value: "350+", detail: "USA & India", tier: "primary" },
    { label: "Cost Reduction", value: "40%", detail: "$180K+", tier: "secondary" },
  ],
};

const baseSocials: Social[] = [
  { platform: "github", url: "https://github.com/test", icon: "github" },
  { platform: "linkedin", url: "https://linkedin.com/in/test", icon: "linkedin" },
];

describe("Hero", () => {
  it("renders name and title", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    expect(screen.getByRole("heading", { name: "Rohit Test" })).toBeInTheDocument();
    expect(screen.getByText("Director of Engineering")).toBeInTheDocument();
  });

  it("renders headline", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    expect(screen.getByText("Leading teams across continents.")).toBeInTheDocument();
  });

  it("renders avatar image with profile name as alt text", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    const img = screen
      .getAllByRole("img")
      .find((el) => el.getAttribute("alt") === "Profile photo of Rohit Test");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://avatars.githubusercontent.com/u/123");
  });

  it("renders profile tags", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    expect(screen.getByText("Architect")).toBeInTheDocument();
    expect(screen.getByText("Speaker")).toBeInTheDocument();
  });

  it("renders key metrics", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    expect(screen.getByText("Engineers Led")).toBeInTheDocument();
    expect(screen.getByText("350+")).toBeInTheDocument();
    expect(screen.getByText("Cost Reduction")).toBeInTheDocument();
  });

  it("renders View Experience link", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    expect(screen.getByRole("link", { name: "View Experience" })).toHaveAttribute(
      "href",
      "#experience"
    );
  });

  it("renders Download CV link", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute("download");
  });

  it("renders social links with descriptive aria-labels", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    const githubLinks = screen.getAllByRole("link", { name: "Visit my Github profile" });
    expect(githubLinks[0]).toHaveAttribute("href", "https://github.com/test");
    const linkedinLinks = screen.getAllByRole("link", { name: "Visit my Linkedin profile" });
    expect(linkedinLinks[0]).toHaveAttribute("href", "https://linkedin.com/in/test");
  });

  it("renders no tags section when tags is empty", () => {
    render(<Hero profile={{ ...baseProfile, tags: [] }} socials={baseSocials} />);
    expect(screen.queryByText("Architect")).not.toBeInTheDocument();
  });
});
