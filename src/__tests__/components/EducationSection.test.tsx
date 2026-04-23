import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EducationSection } from "@/components/education/EducationSection";
import type { Education } from "@/types";

const baseEducation: Education[] = [
  {
    degree: "B.Tech Computer Science",
    institution: "Sree Narayana Gurukulam College of Engineering",
    location: "Kerala, India",
    year: "2012",
  },
  {
    degree: "Higher Secondary",
    institution: "St. Joseph's School",
    location: "Kerala, India",
    year: "2008",
  },
];

describe("EducationSection", () => {
  it("renders section with id=education", () => {
    const { container } = render(<EducationSection education={baseEducation} />);
    expect(container.querySelector("#education")).toBeInTheDocument();
  });

  it("renders degree for each entry", () => {
    render(<EducationSection education={baseEducation} />);
    expect(screen.getByText("B.Tech Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Higher Secondary")).toBeInTheDocument();
  });

  it("renders institution names", () => {
    render(<EducationSection education={baseEducation} />);
    expect(screen.getByText("Sree Narayana Gurukulam College of Engineering")).toBeInTheDocument();
    expect(screen.getByText("St. Joseph's School")).toBeInTheDocument();
  });

  it("renders location and year", () => {
    render(<EducationSection education={baseEducation} />);
    expect(screen.getAllByText(/Kerala, India/).length).toBeGreaterThan(0);
    expect(screen.getByText(/2012/)).toBeInTheDocument();
    expect(screen.getByText(/2008/)).toBeInTheDocument();
  });

  it("renders empty state without crashing", () => {
    const { container } = render(<EducationSection education={[]} />);
    expect(container.querySelector("#education")).toBeInTheDocument();
  });
});
