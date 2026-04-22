import { describe, it, expect } from "vitest";
import { isOssProject, partitionProjects } from "@/lib/projects";
import type { Project } from "@/types";

function makeProject(client: string, duration = "2024"): Project {
  return {
    name: client,
    domain: "Test",
    client,
    role: "Engineer",
    duration,
    description: "",
    products: [],
    highlights: [],
    tech: [],
  };
}

describe("isOssProject", () => {
  it('marks "Personal" as OSS', () => {
    expect(isOssProject(makeProject("Personal"))).toBe(true);
  });

  it('marks "Personal / Community" as OSS', () => {
    expect(isOssProject(makeProject("Personal / Community"))).toBe(true);
  });

  it("marks named client as non-OSS", () => {
    expect(isOssProject(makeProject("Acme Corp"))).toBe(false);
    expect(isOssProject(makeProject("CES IT"))).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(isOssProject(makeProject("personal"))).toBe(false);
    expect(isOssProject(makeProject("PERSONAL"))).toBe(false);
  });
});

describe("partitionProjects", () => {
  it("splits into client and OSS buckets", () => {
    const projects = [
      makeProject("Acme"),
      makeProject("Personal"),
      makeProject("Personal / Community"),
      makeProject("Contoso"),
    ];

    const { clientProjects, ossProjects } = partitionProjects(projects);

    expect(clientProjects).toHaveLength(2);
    expect(ossProjects).toHaveLength(2);
    expect(clientProjects.map((p) => p.client)).toEqual(["Acme", "Contoso"]);
    expect(ossProjects.map((p) => p.client)).toEqual(["Personal", "Personal / Community"]);
  });

  it("handles all OSS projects", () => {
    const projects = [makeProject("Personal"), makeProject("Personal / Community")];
    const { clientProjects, ossProjects } = partitionProjects(projects);
    expect(clientProjects).toHaveLength(0);
    expect(ossProjects).toHaveLength(2);
  });

  it("handles all client projects", () => {
    const projects = [makeProject("Acme"), makeProject("Contoso")];
    const { clientProjects, ossProjects } = partitionProjects(projects);
    expect(clientProjects).toHaveLength(2);
    expect(ossProjects).toHaveLength(0);
  });

  it("handles empty list", () => {
    const { clientProjects, ossProjects } = partitionProjects([]);
    expect(clientProjects).toHaveLength(0);
    expect(ossProjects).toHaveLength(0);
  });

  it("preserves insertion order within each bucket", () => {
    const projects = [
      makeProject("Old Client", "March 2018"),
      makeProject("Personal", "2020"),
      makeProject("New Client", "April 2024 - Present"),
      makeProject("Personal / Community", "2024"),
      makeProject("Mid Client", "April 2022 - March 2024"),
    ];
    const { clientProjects, ossProjects } = partitionProjects(projects);
    expect(clientProjects.map((p) => p.client)).toEqual(["Old Client", "New Client", "Mid Client"]);
    expect(ossProjects.map((p) => p.client)).toEqual(["Personal", "Personal / Community"]);
  });
});
