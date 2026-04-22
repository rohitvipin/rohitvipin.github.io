// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Nav } from "@/components/shared/Nav";
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
    expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("mobile menu opens on toggle button click", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" navLinks={testNavLinks} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("dialog", { name: "Mobile navigation" })).toBeInTheDocument();
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
    const mobileNav = screen.getByRole("dialog", { name: "Mobile navigation" });
    await user.click(mobileNav.querySelectorAll("a")[0]);
    expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("mobile menu closes on Escape key", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" navLinks={testNavLinks} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("dialog", { name: "Mobile navigation" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("Tab from last focusable element in open drawer wraps to first", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" navLinks={testNavLinks} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("dialog", { name: "Mobile navigation" });
    const focusable = Array.from(
      mobileNav.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])')
    );
    const last = focusable[focusable.length - 1];
    last.focus();
    expect(document.activeElement).toBe(last);
    await user.tab();
    expect(document.activeElement).toBe(focusable[0]);
  });

  it("Shift+Tab from first focusable element in open drawer wraps to last", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" navLinks={testNavLinks} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("dialog", { name: "Mobile navigation" });
    const focusable = Array.from(
      mobileNav.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])')
    );
    focusable[0].focus();
    expect(document.activeElement).toBe(focusable[0]);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(focusable[focusable.length - 1]);
  });

  it("does not change active section when no entries are intersecting", () => {
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

    render(<Nav initials="R" navLinks={testNavLinks} />);

    expect(capturedCallback).not.toBeNull();
    const cb = capturedCallback as (entries: IntersectionObserverEntry[]) => void;

    act(() => {
      cb([
        {
          isIntersecting: false,
          boundingClientRect: { top: 100 } as DOMRectReadOnly,
          target: document.createElement("section"),
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    screen.getAllByRole("link").forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current", "page");
    });
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

    const aboutSection = document.getElementById("about");
    const cb = capturedCallback as ((entries: IntersectionObserverEntry[]) => void) | null;
    if (!cb || !aboutSection) return;

    act(() => {
      cb([
        {
          isIntersecting: true,
          boundingClientRect: { top: 100 } as DOMRectReadOnly,
          target: aboutSection,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("aria-current", "page");
  });
});
