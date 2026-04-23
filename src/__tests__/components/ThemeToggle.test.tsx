// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const { mockSetTheme, mockTheme } = vi.hoisted(() => ({
  mockSetTheme: vi.fn(),
  mockTheme: { current: "dark" as string },
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: mockTheme.current, setTheme: mockSetTheme }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockTheme.current = "dark";
  });

  it("renders toggle button after mount", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeInTheDocument();
  });

  it("calls setTheme with light when current theme is dark", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("renders switch-to-dark button when theme is light", () => {
    mockTheme.current = "light";
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
  });

  it("calls setTheme with dark when current theme is light", async () => {
    mockTheme.current = "light";
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});
