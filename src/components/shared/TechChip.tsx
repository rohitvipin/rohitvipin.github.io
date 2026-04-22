export interface TechChipProps {
  label: string;
}

export function TechChip({ label }: TechChipProps) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono border border-[var(--border)] text-[var(--muted)] bg-[var(--surface-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150 cursor-default">
      {label}
    </span>
  );
}
