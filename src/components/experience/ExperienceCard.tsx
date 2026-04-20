"use client";

import { useState } from "react";
import type { ExperienceEntry } from "@/types";
import TechChip from "@/components/shared/TechChip";
import { getCompanyColor } from "@/lib/colors";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export interface ExperienceCardProps {
  entry: ExperienceEntry;
}

export default function ExperienceCard({ entry }: ExperienceCardProps) {
  const [expanded, setExpanded] = useState(entry.current);
  const companyColor = getCompanyColor(entry.company);

  return (
    <div className="card p-6 space-y-4 border-l-2" style={{ borderLeftColor: companyColor }}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-[var(--text)]">{entry.role}</h3>
            {entry.current && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)]/30 text-xs font-medium text-[var(--accent)]">
                <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
                Current
              </span>
            )}
          </div>
          <p className="text-sm font-medium" style={{ color: companyColor }}>
            {entry.company}
          </p>
          <p className="text-xs text-[var(--muted)]">
            {entry.location} · {entry.duration}
          </p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={
            expanded
              ? `Collapse ${entry.role} at ${entry.company}`
              : `Expand ${entry.role} at ${entry.company}`
          }
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
        >
          {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
      </div>

      <p className="text-sm text-[var(--muted)] leading-relaxed">{entry.description}</p>

      {expanded && (
        <ul className="space-y-2 border-t border-[var(--border)] pt-4">
          {entry.highlights.map((h) => (
            <li key={h} className="text-sm text-[var(--muted)] flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5 shrink-0">▸</span>
              {h}
            </li>
          ))}
        </ul>
      )}

      {entry.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {entry.techStack.map((t) => (
            <TechChip key={t} label={t} />
          ))}
        </div>
      )}
    </div>
  );
}
