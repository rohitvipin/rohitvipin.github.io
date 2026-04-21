// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SocialLinks from "@/components/shared/SocialLinks";
import type { Social } from "@/types";

const socials: Social[] = [
  { platform: "GitHub", url: "https://github.com/rohitvipin", icon: "github" },
  { platform: "LinkedIn", url: "https://linkedin.com/in/test", icon: "linkedin" },
  { platform: "Email", url: "mailto:test@example.com", icon: "email" },
];

describe("SocialLinks", () => {
  it("renders a link for each social", () => {
    render(<SocialLinks socials={socials} />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("sets correct href on each link", () => {
    render(<SocialLinks socials={socials} />);
    expect(screen.getByRole("link", { name: "Visit my GitHub profile" })).toHaveAttribute(
      "href",
      "https://github.com/rohitvipin"
    );
    expect(screen.getByRole("link", { name: "Visit my Email profile" })).toHaveAttribute(
      "href",
      "mailto:test@example.com"
    );
  });

  it("opens links in new tab with noopener", () => {
    render(<SocialLinks socials={socials} />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("uses platform initial as fallback for unknown icon", () => {
    const unknown: Social[] = [
      { platform: "Mastodon", url: "https://mastodon.social", icon: "unknown-icon" },
    ];
    render(<SocialLinks socials={unknown} />);
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("renders empty when no socials provided", () => {
    const { container } = render(<SocialLinks socials={[]} />);
    expect(container.querySelectorAll("a")).toHaveLength(0);
  });
});
