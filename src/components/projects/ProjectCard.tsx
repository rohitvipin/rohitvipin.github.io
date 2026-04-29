import type { Project } from "@/types";
import { TechChip } from "@/components/shared/TechChip";
import { DetailsSummary } from "@/components/shared/DetailsSummary";
import { FiGithub } from "react-icons/fi";

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const domainColor = project.color ?? "var(--accent)";

  return (
    <div className="card flex flex-col space-y-4 border-l-2 border-l-[var(--accent)] p-6">
      <div>
        <div className="mb-1 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="leading-snug font-semibold text-[var(--text)]">{project.name}</h3>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub repository for ${project.name}`}
                className="inline-flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              >
                <FiGithub size={14} aria-hidden="true" />
              </a>
            )}
          </div>
          <span className="mt-0.5 shrink-0 font-mono text-xs text-[var(--muted)]">
            {project.duration}
          </span>
        </div>
        <p className="text-xs font-medium tracking-wider uppercase" style={{ color: domainColor }}>
          {project.domain}
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted)]">
          {project.role} · {project.client}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-[var(--muted)]">{project.description}</p>

      {project.highlights?.length > 0 && (
        <ul className="space-y-1.5">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-xs text-[var(--muted)]">
              <span className="mt-0.5 shrink-0 text-[var(--accent)]">▸</span>
              {h}
            </li>
          ))}
        </ul>
      )}

      {project.products?.length > 0 && (
        <details className="card-details">
          <DetailsSummary tone="accent" aria-label={`Toggle products for ${project.name}`}>
            {project.products.length} product{project.products.length > 1 ? "s" : ""}
          </DetailsSummary>
          <div className="mt-3 space-y-3 border-t border-[var(--border)] pt-3">
            {project.products.map((p) => (
              <div key={p.name}>
                <p className="text-xs font-semibold text-[var(--text)]">{p.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}

      {project.tech.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.tech.map((t) => (
            <TechChip key={t} label={t} />
          ))}
        </div>
      )}
    </div>
  );
}
