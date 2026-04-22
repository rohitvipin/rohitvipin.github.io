import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorPage from "@/app/error";

describe("Error page", () => {
  it("renders error heading", () => {
    render(<ErrorPage error={new globalThis.Error("test")} reset={vi.fn()} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders recovery message", () => {
    render(<ErrorPage error={new globalThis.Error("test")} reset={vi.fn()} />);
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
  });

  it("renders try again button", () => {
    render(<ErrorPage error={new globalThis.Error("test")} reset={vi.fn()} />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("calls reset when button clicked", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<ErrorPage error={new globalThis.Error("test")} reset={reset} />);
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledOnce();
  });

  it("logs error to console on mount", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new globalThis.Error("boom");
    render(<ErrorPage error={error} reset={vi.fn()} />);
    expect(spy).toHaveBeenCalledWith(error);
    spy.mockRestore();
  });
});
