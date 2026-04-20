"use client";

import { useState } from "react";
import type { Project } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";
import ProjectCard from "./ProjectCard";
import { partitionProjects } from "@/lib/projects";

export interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [tab, setTab] = useState<"client" | "oss">("client");

  const { clientProjects, ossProjects } = partitionProjects(projects);

  const visible = tab === "client" ? clientProjects : ossProjects;

  return (
    <section id="projects" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="Projects" />
        <div className="flex gap-1 mb-8 p-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] w-fit">
          {(["client", "oss"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                tab === t
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {t === "client"
                ? `Client (${clientProjects.length})`
                : `Open Source (${ossProjects.length})`}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visible.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
