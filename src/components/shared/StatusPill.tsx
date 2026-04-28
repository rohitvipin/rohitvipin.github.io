import type { ReactNode } from "react";

export interface StatusPillProps {
  label: ReactNode;
}

export function StatusPill({ label }: StatusPillProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-glow)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
      <span className="h-1 w-1 animate-pulse rounded-full bg-[var(--accent)]" aria-hidden="true" />
      {label}
    </span>
  );
}
