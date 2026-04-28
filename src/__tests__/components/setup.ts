import "@testing-library/jest-dom/vitest";
import { expect, vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

afterEach(cleanup);

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    unoptimized: _unoptimized,
    quality: _quality,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    loader: _loader,
    sizes: _sizes,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    unoptimized?: boolean;
    quality?: number;
    placeholder?: string;
    blurDataURL?: string;
    loader?: unknown;
    sizes?: string;
    [key: string]: unknown;
  }) => createElement("img", { src, alt, ...props }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => createElement("a", { href, ...props }, children),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", setTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
