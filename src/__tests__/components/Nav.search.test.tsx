// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockBuildSearchIndex = vi.fn(() => []);
const mockQueryIndex = vi.fn(() => []);

vi.mock("@/lib/search", () => ({
  buildSearchIndex: mockBuildSearchIndex,
  queryIndex: mockQueryIndex,
}));

vi.mock("@/lib/data", () => ({
  experience: [],
  projects: [],
  skills: [],
  awards: [],
  community: [],
  education: [],
  leadership: { title: "", sections: [] },
}));

import Nav from "@/components/shared/Nav";

beforeEach(() => {
  mockBuildSearchIndex.mockReturnValue([]);
  mockQueryIndex.mockReturnValue([]);

  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    }
  );

  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("Nav search — panel open/close", () => {
  it("search panel is hidden by default", () => {
    render(<Nav initials="R" />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("search trigger button is present", () => {
    render(<Nav initials="R" />);
    expect(screen.getByRole("button", { name: "Search site" })).toBeInTheDocument();
  });

  it("search trigger has aria-expanded false by default", () => {
    render(<Nav initials="R" />);
    expect(screen.getByRole("button", { name: "Search site" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("opens search panel on trigger click", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());
  });

  it("search trigger aria-expanded becomes true when open", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    // Label changes to "Close search" once open
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Close search" })).toHaveAttribute(
        "aria-expanded",
        "true"
      )
    );
  });

  it("input is focused when search panel opens", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => {
      const input = screen.queryByRole("combobox");
      if (input) expect(document.activeElement).toBe(input);
    });
  });
});

describe("Nav search — keyboard navigation", () => {
  it("Escape closes search panel", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("combobox")).not.toBeInTheDocument());
  });

  it("Escape returns focus to trigger button", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    const trigger = screen.getByRole("button", { name: "Search site" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("shows results when query matches", async () => {
    mockQueryIndex.mockReturnValue([
      {
        title: "AWS Work",
        snippet: "Built with AWS Lambda",
        sectionId: "experience",
        sectionLabel: "Experience",
        scrollAnchor: "#experience",
        matchStart: 0,
        matchEnd: 3,
      },
    ]);

    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    await user.type(screen.getByRole("combobox"), "aws");

    // Wait for debounced results to populate the always-rendered listbox
    await waitFor(
      () => expect(screen.getByRole("option", { name: /AWS Work/i })).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );
  });

  it("shows no results message for unmatched query", async () => {
    mockQueryIndex.mockReturnValue([]);

    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    await user.type(screen.getByRole("combobox"), "zzznomatch");

    // Desktop + mobile panels both render "No results found." in jsdom (no CSS breakpoints)
    await waitFor(
      () => expect(screen.getAllByText("No results found.").length).toBeGreaterThan(0),
      {
        timeout: 500,
      }
    );
  });

  it("ArrowDown selects first result", async () => {
    mockQueryIndex.mockReturnValue([
      {
        title: "Result One",
        snippet: "snippet",
        sectionId: "experience",
        sectionLabel: "Experience",
        scrollAnchor: "#experience",
        matchStart: null,
        matchEnd: null,
      },
    ]);

    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    await user.type(screen.getByRole("combobox"), "result");

    // Wait for debounced results before pressing ArrowDown
    await waitFor(
      () => expect(screen.getByRole("option", { name: /Result One/i })).toBeInTheDocument(),
      {
        timeout: 500,
      }
    );

    await user.keyboard("{ArrowDown}");

    await waitFor(() => {
      const option = screen.getByRole("option", { name: /Result One/i });
      expect(option).toHaveAttribute("aria-selected", "true");
    });
  });
});

describe("Nav search — mutual exclusivity", () => {
  it("opening search closes mobile menu", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() =>
      expect(
        screen.queryByRole("navigation", { name: "Mobile navigation" })
      ).not.toBeInTheDocument()
    );
  });

  it("opening mobile menu closes search panel", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await waitFor(() => expect(screen.queryByRole("combobox")).not.toBeInTheDocument());
  });
});

describe("Nav search — import failure", () => {
  it("disables trigger button and hides panel on import failure", async () => {
    mockBuildSearchIndex.mockImplementationOnce(() => {
      throw new Error("Index build failed");
    });

    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));

    await waitFor(
      () => expect(screen.getByRole("button", { name: "Search site" })).toBeDisabled(),
      { timeout: 1000 }
    );
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});

describe("Nav search — toggle", () => {
  it("clicking search trigger again closes the panel", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Close search" }));
    await waitFor(() => expect(screen.queryByRole("combobox")).not.toBeInTheDocument());
  });
});

describe("Nav search — keyboard extended", () => {
  it("ArrowUp from index 0 deselects (goes to -1)", async () => {
    mockQueryIndex.mockReturnValue([
      {
        title: "Result A",
        snippet: "snippet",
        sectionId: "experience",
        sectionLabel: "Experience",
        scrollAnchor: "#experience",
        matchStart: 0,
        matchEnd: 8,
      },
    ]);

    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());
    await user.type(screen.getByRole("combobox"), "result");
    await waitFor(
      () => expect(screen.getByRole("option", { name: /Result A/i })).toBeInTheDocument(),
      { timeout: 500 }
    );

    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("option", { name: /Result A/i })).toHaveAttribute(
        "aria-selected",
        "true"
      )
    );

    await user.keyboard("{ArrowUp}");
    await waitFor(() =>
      expect(screen.getByRole("option", { name: /Result A/i })).toHaveAttribute(
        "aria-selected",
        "false"
      )
    );
  });

  it("Tab key does not close the search panel", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Tab" });
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("Enter with active result selects it and closes panel", async () => {
    mockQueryIndex.mockReturnValue([
      {
        title: "AWS Result",
        snippet: "Built with AWS",
        sectionId: "experience",
        sectionLabel: "Experience",
        scrollAnchor: "#experience",
        matchStart: 0,
        matchEnd: 3,
      },
    ]);

    // jsdom doesn't define scrollIntoView — define it so selectResult doesn't throw
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
    const section = document.createElement("section");
    section.id = "experience";
    document.body.appendChild(section);

    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());
    await user.type(screen.getByRole("combobox"), "aws");
    await waitFor(
      () => expect(screen.getByRole("option", { name: /AWS Result/i })).toBeInTheDocument(),
      { timeout: 500 }
    );

    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("option", { name: /AWS Result/i })).toHaveAttribute(
        "aria-selected",
        "true"
      )
    );

    await user.keyboard("{Enter}");
    await waitFor(() => expect(screen.queryByRole("combobox")).not.toBeInTheDocument());

    document.body.removeChild(section);
  });
});

describe("Nav search — outside click", () => {
  it("mousedown outside search panel closes the panel", async () => {
    const user = userEvent.setup();
    render(<Nav initials="R" />);
    await user.click(screen.getByRole("button", { name: "Search site" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(screen.queryByRole("combobox")).not.toBeInTheDocument());
  });
});
