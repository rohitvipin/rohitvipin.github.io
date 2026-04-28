export interface TechChipProps {
  label: string;
}

export function TechChip({ label }: TechChipProps) {
  return (
    <span className="inline-block cursor-default rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-xs text-[var(--muted)] transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]">
      {label}
    </span>
  );
}
