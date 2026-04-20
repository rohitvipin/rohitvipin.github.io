// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Nav from "@/components/shared/Nav";

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    }
  );
});

describe("Nav", () => {
  it("renders initials in home link", () => {
    render(<Nav initials="R" />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveTextContent("R");
  });

  it("renders all desktop nav links", () => {
    render(<Nav initials="R" />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(nav.querySelectorAll("a")).toHaveLength(8);
  });

  it("mobile menu is closed by default", () => {
    render(<Nav initials="R" />);
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("mobile menu opens on toggle button click", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
  });

  it("mobile toggle button reflects open state via aria-expanded", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("mobile menu closes when a nav link is clicked", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    await user.click(mobileNav.querySelectorAll("a")[0]);
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });
});
