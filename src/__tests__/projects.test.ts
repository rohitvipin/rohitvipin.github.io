import { describe, it, expect } from "vitest";
import { isOssProject, partitionProjects } from "@/lib/projects";
import type { Project } from "@/types";

function makeProject(client: string): Project {
  return {
    name: "Test Project",
    domain: "Test",
    client,
    role: "Engineer",
    duration: "2024",
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

  it("preserves order within each bucket", () => {
    const projects = [
      makeProject("A"),
      makeProject("Personal"),
      makeProject("B"),
      makeProject("Personal / Community"),
      makeProject("C"),
    ];
    const { clientProjects, ossProjects } = partitionProjects(projects);
    expect(clientProjects.map((p) => p.client)).toEqual(["A", "B", "C"]);
    expect(ossProjects.map((p) => p.client)).toEqual(["Personal", "Personal / Community"]);
  });
});
