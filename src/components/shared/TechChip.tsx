export default function TechChip({ label }: { label: string }) {
  return (
    <span className="group relative inline-block max-w-[200px]">
      <span className="truncate block px-2.5 py-0.5 rounded-full text-xs font-mono border border-[var(--border)] text-[var(--muted)] bg-[var(--surface-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150 cursor-default">
        {label}
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded px-2 py-1 text-xs font-mono bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] shadow-sm z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {label}
      </span>
    </span>
  );
}
