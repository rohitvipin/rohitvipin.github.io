import type { ExperienceEntry } from "@/types";
import { TechChip } from "@/components/shared/TechChip";
import { FiChevronDown } from "react-icons/fi";

export interface ExperienceCardProps {
  entry: ExperienceEntry;
}

export function ExperienceCard({ entry }: ExperienceCardProps) {
  const companyColor = entry.color ?? "#6366f1";

  return (
    <div
      className="card card-hover p-6 space-y-4 border-l-2"
      style={{ borderLeftColor: companyColor }}
    >
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

      <p className="text-sm text-[var(--muted)] leading-relaxed">{entry.description}</p>

      {entry.highlights.length > 0 && (
        <details open={entry.current} className="card-details">
          <summary
            aria-label={`Toggle highlights for ${entry.role} at ${entry.company}`}
            className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors min-h-[44px]"
          >
            <FiChevronDown size={12} aria-hidden="true" className="card-details-chevron" />
            Highlights
          </summary>
          <ul className="space-y-2 border-t border-[var(--border)] pt-4 mt-1">
            {entry.highlights.map((h) => (
              <li key={h} className="text-sm text-[var(--muted)] flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5 shrink-0">▸</span>
                {h}
              </li>
            ))}
          </ul>
        </details>
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
