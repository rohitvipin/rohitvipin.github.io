import type { ReactNode } from "react";
import { STATUS_PILL_CLASSES } from "@/lib/primitive-classes";

export interface StatusPillProps {
  label: ReactNode;
}

export function StatusPill({ label }: StatusPillProps) {
  return (
    <span className={STATUS_PILL_CLASSES}>
      <span className="h-1 w-1 animate-pulse rounded-full bg-[var(--accent)]" aria-hidden="true" />
      {label}
    </span>
  );
}
