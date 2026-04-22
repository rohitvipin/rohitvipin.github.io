import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/data", () => ({
  profile: {
    name: "Test User",
    title: "Director",
    headline: "Test headline.",
    location: "Remote",
    bio: "Test bio.",
    bio_quote: "Test quote.",
    email: "test@example.com",
    years_of_experience: 14,
    timezone: "UTC",
    availability_status: "open",
    profile_picture: "",
    github_avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    cta_primary: "See Impact",
    open_to: "Open to Director roles",
    availability_note: "Available remotely.",
    tags: ["Platform Architecture"],
    key_metrics: [
      { label: "Engineers Led", value: "100+", detail: "across teams", tier: "primary" },
    ],
    value_propositions: [{ audience: "Track Record", value: "5 years" }],
  },
  experience: [
    {
      company: "Acme Corp",
      role: "Director",
      location: "Remote",
      duration: "2022 - Present",
      current: true,
      description: "Led engineering org.",
      highlights: ["Built platform"],
      techStack: ["TypeScript"],
    },
  ],
  projects: [
    {
      name: "Test Platform",
      domain: "Education",
      client: "Acme",
      role: "Architect",
      duration: "2022 - Present",
      description: "Built platform.",
      products: [],
      highlights: ["99.9% uptime"],
      tech: ["AWS"],
    },
  ],
  skills: [{ category: "Cloud", skills: ["AWS"] }],
  education: [
    {
      degree: "B.Tech Computer Science",
      institution: "Test University",
      location: "India",
      year: "2009",
    },
  ],
  socials: [{ platform: "GitHub", url: "https://github.com/test", icon: "FaGithub" }],
  awards: [
    { title: "Best Engineer", organization: "Acme", year: "2023", description: "Top performer." },
  ],
  community: [
    {
      type: "Community Leadership",
      title: "XHackers Founder",
      description: "Founded user group.",
      highlights: ["Organised 20+ meetups"],
    },
  ],
  leadership: {
    title: "Technical Depth",
    sections: [{ title: "AI Engineering", description: "Shipped AI systems." }],
  },
  navLinks: [{ label: "About", href: "#about" }],
  impact: [
    {
      id: "test-story",
      title: "K-12 Modernisation",
      domain: "Education",
      problem: "Legacy system.",
      scope: "350+ engineers.",
      led: "Full architecture.",
      result: "45% incident reduction.",
      metrics: ["30%+ productivity lift"],
    },
  ],
}));

vi.mock("@/lib/paths", () => ({ resumeHref: "/Rohit_Vipin_Mathews_Resume.pdf" }));

import Home from "@/app/page";

describe("Home page", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(document.getElementById("main-content")).toBeInTheDocument();
  });

  it("renders nav with initials from profile name", () => {
    render(<Home />);
    expect(screen.getByText("TU")).toBeInTheDocument();
  });

  it("renders contact section", () => {
    render(<Home />);
    expect(screen.getByText("Open to Director roles")).toBeInTheDocument();
  });

  it("renders footer with profile name", () => {
    render(<Home />);
    const footer = document.querySelector("footer");
    expect(footer?.textContent).toContain("Test User");
  });
});
