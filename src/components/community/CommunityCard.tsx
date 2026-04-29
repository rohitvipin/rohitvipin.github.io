import { FiUsers, FiCode, FiMic, FiStar, FiBookOpen } from "react-icons/fi";
import type { CommunityEntry } from "@/types";
import { DetailsSummary } from "@/components/shared/DetailsSummary";

const ICON_MAP: Record<string, React.ReactNode> = {
  "Community Leadership": <FiUsers size={18} aria-hidden="true" />,
  "Open Source": <FiCode size={18} aria-hidden="true" />,
  "Conference Speaking": <FiMic size={18} aria-hidden="true" />,
  "Technical Community": <FiStar size={18} aria-hidden="true" />,
  Mentorship: <FiBookOpen size={18} aria-hidden="true" />,
};

export interface CommunityCardProps {
  entry: CommunityEntry;
}

export function CommunityCard({ entry }: CommunityCardProps) {
  const icon = ICON_MAP[entry.type] ?? <FiUsers size={18} aria-hidden="true" />;

  return (
    <div className="card space-y-4 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-glow)] text-[var(--accent)]">
          {icon}
        </div>
        <p className="text-xs font-medium tracking-wider text-[var(--accent)] uppercase">
          {entry.type}
        </p>
      </div>
      <h3 className="text-sm leading-snug font-semibold text-[var(--text)]">{entry.title}</h3>
      {entry.location && <p className="text-xs text-[var(--muted-2)]">{entry.location}</p>}
      <p className="text-xs leading-relaxed text-[var(--muted)]">{entry.description}</p>

      {entry.highlights.length > 0 && (
        <details className="card-details">
          <DetailsSummary
            tone="accent"
            chevronSize={14}
            aria-label={`Show ${entry.highlights.length} highlights`}
          >
            Show {entry.highlights.length} highlights
          </DetailsSummary>
          <ul className="space-y-2 border-t border-[var(--border)] pt-1">
            {entry.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-xs text-[var(--muted)]">
                <span className="mt-0.5 shrink-0 text-[var(--accent)]">·</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
