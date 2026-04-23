import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/hero/Hero";
import type { Profile, Social } from "@/types";

const baseProfile: Profile = {
  name: "Rohit Test",
  title: "Director of Engineering",
  headline: "Leading teams across continents.",
  location: "Kerala, India",
  bio: "Bio text.",
  email: "test@example.com",
  phone: "+91 000 000 0000",
  years_of_experience: 15,
  timezone: "IST (UTC+5:30)",
  availability_status: "open",
  github_avatar: "https://avatars.githubusercontent.com/u/123",
  tags: ["Architect", "Speaker"],
  cta_primary: "See Impact",
  open_to: "Open to VP Engineering and CTO-track roles",
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
    expect(screen.getByAltText("Profile photo of Rohit Test")).toBeInTheDocument();
  });

  it("renders profile tags", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    expect(screen.getByText("Architect")).toBeInTheDocument();
    expect(screen.getByText("Speaker")).toBeInTheDocument();
  });

  it("renders primary key metrics", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    expect(screen.getByText("Engineers Led")).toBeInTheDocument();
    expect(screen.getByText("350+")).toBeInTheDocument();
  });

  it("renders secondary metrics", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    expect(screen.getByText("Cost Reduction")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("renders primary CTA linking to #impact", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    expect(screen.getByRole("link", { name: "See Impact" })).toHaveAttribute("href", "#impact");
  });

  it("falls back to 'See Impact' when cta_primary is absent", () => {
    const { cta_primary: _cta, ...noCta } = baseProfile;
    render(<Hero profile={noCta as Profile} socials={baseSocials} />);
    expect(screen.getByRole("link", { name: "See Impact" })).toBeInTheDocument();
  });

  it("renders Download CV link with descriptive aria-label", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    const link = screen.getByRole("link", { name: "Download Rohit Vipin Mathews resume (PDF)" });
    expect(link).toHaveAttribute("download");
  });

  it("does not render secondary metrics dl when no secondary metrics exist", () => {
    const noSecondary: Profile = {
      ...baseProfile,
      key_metrics: [
        { label: "Engineers Led", value: "350+", detail: "USA & India", tier: "primary" },
      ],
    };
    const { container } = render(<Hero profile={noSecondary} socials={baseSocials} />);
    expect(screen.queryByText("Cost Reduction")).not.toBeInTheDocument();
    expect(container.querySelectorAll("dl")).toHaveLength(1);
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

  it("omits metric detail when detail field is absent", () => {
    const noDetail: Profile = {
      ...baseProfile,
      key_metrics: [
        { label: "Engineers Led", value: "350+", tier: "primary" },
        { label: "Cost Reduction", value: "40%", tier: "secondary" },
      ],
    };
    render(<Hero profile={noDetail} socials={baseSocials} />);
    expect(screen.queryByText("USA & India")).not.toBeInTheDocument();
    expect(screen.queryByText("$180K+")).not.toBeInTheDocument();
  });

  it("hero CTAs carry min-h-[44px] for WCAG 2.5.5 touch target compliance", () => {
    render(<Hero profile={baseProfile} socials={baseSocials} />);
    const seeImpact = screen.getByRole("link", { name: "See Impact" });
    const downloadCV = screen.getByRole("link", {
      name: "Download Rohit Vipin Mathews resume (PDF)",
    });
    expect(seeImpact.className).toContain("min-h-[44px]");
    expect(downloadCV.className).toContain("min-h-[44px]");
  });

  it("applies large font class for short metric values (length <= 2)", () => {
    const shortValue: Profile = {
      ...baseProfile,
      key_metrics: [{ label: "Years", value: "15", detail: "experience", tier: "primary" }],
    };
    const { container } = render(<Hero profile={shortValue} socials={baseSocials} />);
    const dd = container.querySelector("dd.text-4xl");
    expect(dd).toBeInTheDocument();
    expect(dd).toHaveTextContent("15");
  });
});
