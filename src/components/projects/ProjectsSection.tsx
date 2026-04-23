import type { Project } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProjectsTabClient } from "./ProjectsTabClient";

export interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="Projects" headingId="projects-heading" />
        <ProjectsTabClient projects={projects} />
      </div>
    </section>
  );
}
