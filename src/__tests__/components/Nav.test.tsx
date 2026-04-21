// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Nav from "@/components/shared/Nav";
import type { NavLink } from "@/types";

const testNavLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Leadership", href: "#leadership" },
  { label: "Skills", href: "#skills" },
  { label: "Community", href: "#community" },
  { label: "Awards", href: "#awards" },
  { label: "Education", href: "#education" },
];

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Nav", () => {
  it("renders initials in home link", () => {
    render(<Nav initials="R" navLinks={testNavLinks} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveTextContent("R");
  });

  it("renders all desktop nav links", () => {
    render(<Nav initials="R" navLinks={testNavLinks} />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(nav.querySelectorAll("a")).toHaveLength(8);
  });

  it("mobile menu is closed by default", () => {
    render(<Nav initials="R" navLinks={testNavLinks} />);
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("mobile menu opens on toggle button click", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" navLinks={testNavLinks} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
  });

  it("mobile toggle button reflects open state via aria-expanded", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" navLinks={testNavLinks} />);
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
    render(<Nav initials="R" navLinks={testNavLinks} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    await user.click(mobileNav.querySelectorAll("a")[0]);
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("mobile menu closes on Escape key", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" navLinks={testNavLinks} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("marks the intersecting section as active", async () => {
    let capturedCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
          capturedCallback = cb;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );

    document.body.innerHTML = '<section id="about"></section>';

    render(<Nav initials="R" navLinks={testNavLinks} />);

    act(() => {
      capturedCallback!([
        {
          isIntersecting: true,
          boundingClientRect: { top: 100 } as DOMRectReadOnly,
          target: document.getElementById("about")!,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("aria-current", "page");
  });
});
