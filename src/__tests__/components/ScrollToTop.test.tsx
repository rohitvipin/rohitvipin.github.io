// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScrollToTop from "@/components/shared/ScrollToTop";

beforeEach(() => {
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
  vi.stubGlobal("scrollTo", vi.fn());
});

describe("ScrollToTop", () => {
  it("is hidden when page is near top", () => {
    render(<ScrollToTop />);
    expect(screen.queryByRole("button", { name: "Scroll to top" })).not.toBeInTheDocument();
  });

  it("appears after scrolling past 400px", () => {
    render(<ScrollToTop />);
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 500, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("button", { name: "Scroll to top" })).toBeInTheDocument();
  });

  it("hides again when scroll returns below 400px", () => {
    render(<ScrollToTop />);
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 500, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.queryByRole("button", { name: "Scroll to top" })).not.toBeInTheDocument();
  });

  it("calls window.scrollTo on click", async () => {
    const user = userEvent.setup();
    render(<ScrollToTop />);
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 500, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    await user.click(screen.getByRole("button", { name: "Scroll to top" }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
