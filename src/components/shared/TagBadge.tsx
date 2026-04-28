export interface TagBadgeProps {
  label: string;
}

export function TagBadge({ label }: TagBadgeProps) {
  return (
    <span className="rounded-md border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted-2)]">
      {label}
    </span>
  );
}
