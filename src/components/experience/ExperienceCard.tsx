import type { ExperienceEntry } from "@/types";
import { TechChip } from "@/components/shared/TechChip";
import { StatusPill } from "@/components/shared/StatusPill";
import { FiChevronDown } from "react-icons/fi";

export interface ExperienceCardProps {
  entry: ExperienceEntry;
}

export function ExperienceCard({ entry }: ExperienceCardProps) {
  const companyColor = entry.color ?? "var(--accent)";

  return (
    <div className="card space-y-4 border-l-2 p-6" style={{ borderLeftColor: companyColor }}>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-[var(--text)]">{entry.role}</h3>
          {entry.current && <StatusPill label="Current" />}
        </div>
        <p className="text-sm font-medium" style={{ color: companyColor }}>
          {entry.company}
        </p>
        <p className="text-xs text-[var(--muted)]">
          {entry.location} · {entry.duration}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-[var(--muted)]">{entry.description}</p>

      {entry.highlights.length > 0 && (
        <details open={entry.current} className="card-details">
          <summary
            aria-label={`Toggle highlights for ${entry.role} at ${entry.company}`}
            className="flex min-h-[48px] items-center gap-1.5 text-xs text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            <FiChevronDown size={12} aria-hidden="true" className="card-details-chevron" />
            Highlights
          </summary>
          <ul className="mt-1 space-y-2 border-t border-[var(--border)] pt-4">
            {entry.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                <span className="mt-0.5 shrink-0 text-[var(--accent)]">▸</span>
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
