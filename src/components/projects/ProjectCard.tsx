"use client";

import { useState } from "react";
import type { Project } from "@/types";
import TechChip from "@/components/shared/TechChip";
import { getDomainColor } from "@/lib/colors";
import { FiChevronDown, FiChevronUp, FiGithub } from "react-icons/fi";

export interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const domainColor = getDomainColor(project.domain);

  return (
    <div
      className="card card-hover p-6 space-y-4 flex flex-col border-l-2"
      style={{ borderLeftColor: domainColor }}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[var(--text)] leading-snug">{project.name}</h3>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub repository for ${project.name}`}
                className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors shrink-0 rounded-lg"
              >
                <FiGithub size={14} aria-hidden="true" />
              </a>
            )}
          </div>
          <span className="text-xs font-mono text-[var(--muted)] shrink-0 mt-0.5">
            {project.duration}
          </span>
        </div>
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: domainColor }}>
          {project.domain}
        </p>
        <p className="text-xs text-[var(--muted-2)] mt-0.5">
          {project.role} · {project.client}
        </p>
      </div>

      <p className="text-sm text-[var(--muted)] leading-relaxed">{project.description}</p>

      {project.highlights?.length > 0 && (
        <ul className="space-y-1.5">
          {project.highlights.map((h) => (
            <li key={h} className="text-xs text-[var(--muted)] flex items-start gap-2">
              <span className="text-[var(--accent)] shrink-0 mt-0.5">▸</span>
              {h}
            </li>
          ))}
        </ul>
      )}

      {project.products?.length > 0 && (
        <div>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Hide products" : "Show products"}
            aria-expanded={open}
            className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:opacity-80 transition-opacity min-h-[48px]"
          >
            {open ? (
              <FiChevronUp size={12} aria-hidden="true" />
            ) : (
              <FiChevronDown size={12} aria-hidden="true" />
            )}
            {open ? "Hide" : "Show"} {project.products.length} product
            {project.products.length > 1 ? "s" : ""}
          </button>
          {open && (
            <div className="mt-3 space-y-3 border-t border-[var(--border)] pt-3">
              {project.products.map((p) => (
                <div key={p.name}>
                  <p className="text-xs font-semibold text-[var(--text)]">{p.name}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {project.tech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 mt-auto">
          {project.tech.map((t) => (
            <TechChip key={t} label={t} />
          ))}
        </div>
      )}
    </div>
  );
}
