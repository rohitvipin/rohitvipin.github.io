export default function TechChip({ label }: { label: string }) {
  return (
    <span
      title={label}
      className="inline-block max-w-[200px] truncate px-2.5 py-0.5 rounded-full text-xs font-mono border border-[var(--border)] text-[var(--muted)] bg-[var(--surface-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150 cursor-default"
    >
      {label}
    </span>
  );
}
