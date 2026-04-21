// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";

type IOCallback = (entries: { isIntersecting: boolean }[]) => void;
let capturedIOCallback: IOCallback | null = null;

let disconnectSpy = vi.fn();

class MockIntersectionObserver {
  disconnect: () => void;
  constructor(cb: IOCallback) {
    capturedIOCallback = cb;
    disconnectSpy = vi.fn();
    this.disconnect = disconnectSpy;
  }
  observe() {}
  unobserve() {}
}

beforeEach(() => {
  capturedIOCallback = null;
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  Object.defineProperty(window, "innerHeight", { value: 768, writable: true, configurable: true });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  sessionStorage.clear();
});

describe("AnimateOnScroll", () => {
  it("renders children", () => {
    render(
      <AnimateOnScroll sectionId="test">
        <p>content</p>
      </AnimateOnScroll>
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("starts hidden when not in viewport and no session cache", () => {
    render(
      <AnimateOnScroll sectionId="no-cache">
        <p>child</p>
      </AnimateOnScroll>
    );
    const wrapper = screen.getByText("child").parentElement as HTMLElement;
    expect(wrapper.className).toContain("opacity-0");
    expect(wrapper.className).toContain("translate-y-4");
  });

  it("becomes visible when IntersectionObserver fires", async () => {
    render(
      <AnimateOnScroll sectionId="io-section">
        <p>child</p>
      </AnimateOnScroll>
    );
    const wrapper = screen.getByText("child").parentElement as HTMLElement;
    expect(wrapper.className).toContain("opacity-0");

    await act(async () => {
      capturedIOCallback?.([{ isIntersecting: true }]);
    });

    expect(wrapper.className).toContain("opacity-100");
    expect(wrapper.className).toContain("translate-y-0");
    expect(sessionStorage.getItem("anim:io-section")).toBe("1");
  });

  it("stays hidden when IO fires with isIntersecting false", async () => {
    render(
      <AnimateOnScroll sectionId="not-intersecting">
        <p>child</p>
      </AnimateOnScroll>
    );
    const wrapper = screen.getByText("child").parentElement as HTMLElement;

    await act(async () => {
      capturedIOCallback?.([{ isIntersecting: false }]);
    });

    expect(wrapper.className).toContain("opacity-0");
  });

  it("shows immediately when already in viewport on mount", async () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 100,
      bottom: 200,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    render(
      <AnimateOnScroll sectionId="in-viewport">
        <p>child</p>
      </AnimateOnScroll>
    );
    const wrapper = screen.getByText("child").parentElement as HTMLElement;

    await act(async () => {});

    expect(wrapper.className).toContain("opacity-100");
    expect(sessionStorage.getItem("anim:in-viewport")).toBe("1");
  });

  it("is immediately visible when session cache hit", () => {
    sessionStorage.setItem("anim:cached-section", "1");

    render(
      <AnimateOnScroll sectionId="cached-section">
        <p>child</p>
      </AnimateOnScroll>
    );
    const wrapper = screen.getByText("child").parentElement as HTMLElement;
    expect(wrapper.className).toContain("opacity-100");
    expect(wrapper.className).toContain("translate-y-0");
  });

  it("falls through to IntersectionObserver when sessionStorage.getItem throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });

    expect(() =>
      render(
        <AnimateOnScroll sectionId="no-storage">
          <p>child</p>
        </AnimateOnScroll>
      )
    ).not.toThrow();

    const wrapper = screen.getByText("child").parentElement as HTMLElement;
    expect(wrapper.className).toContain("opacity-0");
  });

  it("continues gracefully when sessionStorage.setItem throws", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage full");
    });

    render(
      <AnimateOnScroll sectionId="setitem-fail">
        <p>child</p>
      </AnimateOnScroll>
    );
    const wrapper = screen.getByText("child").parentElement as HTMLElement;

    await act(async () => {
      capturedIOCallback?.([{ isIntersecting: true }]);
    });

    expect(wrapper.className).toContain("opacity-100");
  });

  it("applies extra className prop", () => {
    render(
      <AnimateOnScroll sectionId="custom-class" className="mt-4">
        <p>child</p>
      </AnimateOnScroll>
    );
    const wrapper = screen.getByText("child").parentElement as HTMLElement;
    expect(wrapper.className).toContain("mt-4");
  });

  it("shows immediately when prefers-reduced-motion is set", () => {
    vi.stubGlobal("matchMedia", (_query: string) => ({
      matches: true,
      media: _query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <AnimateOnScroll sectionId="reduced-motion">
        <p>child</p>
      </AnimateOnScroll>
    );
    const wrapper = screen.getByText("child").parentElement as HTMLElement;
    expect(wrapper.className).toContain("opacity-100");
    expect(wrapper.className).toContain("translate-y-0");
  });

  it("skips IO setup when already visible", () => {
    sessionStorage.setItem("anim:skip-io", "1");
    const observeSpy = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor() {}
        observe = observeSpy;
        unobserve() {}
        disconnect() {}
      }
    );

    render(
      <AnimateOnScroll sectionId="skip-io">
        <p>child</p>
      </AnimateOnScroll>
    );

    expect(observeSpy).not.toHaveBeenCalled();
  });

  it("calls disconnect on unmount (no memory leak)", () => {
    const { unmount } = render(
      <AnimateOnScroll sectionId="unmount-test">
        <p>child</p>
      </AnimateOnScroll>
    );
    const localDisconnect = disconnectSpy;
    unmount();
    expect(localDisconnect).toHaveBeenCalled();
  });

  it("does not throw when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    expect(() =>
      render(
        <AnimateOnScroll sectionId="no-io">
          <p>child</p>
        </AnimateOnScroll>
      )
    ).not.toThrow();
    const wrapper = screen.getByText("child").parentElement as HTMLElement;
    expect(wrapper.className).toContain("opacity-0");
  });

  it("second render with same sectionId reads session cache, skips IO", async () => {
    const { unmount } = render(
      <AnimateOnScroll sectionId="shared-id">
        <p>first</p>
      </AnimateOnScroll>
    );
    await act(async () => {
      capturedIOCallback?.([{ isIntersecting: true }]);
    });
    expect(sessionStorage.getItem("anim:shared-id")).toBe("1");
    unmount();

    render(
      <AnimateOnScroll sectionId="shared-id">
        <p>second</p>
      </AnimateOnScroll>
    );
    const wrapper = screen.getByText("second").parentElement as HTMLElement;
    expect(wrapper.className).toContain("opacity-100");
  });

  it("disconnect called after first intersection (observe-once contract)", async () => {
    render(
      <AnimateOnScroll sectionId="once-test">
        <p>child</p>
      </AnimateOnScroll>
    );
    const localDisconnect = disconnectSpy;
    await act(async () => {
      capturedIOCallback?.([{ isIntersecting: true }]);
    });
    expect(localDisconnect).toHaveBeenCalled();
  });
});
