import { expect, vi, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";

expect.extend(matchers);
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
