export default function TechChip({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono border border-[var(--border)] text-[var(--muted)] bg-[var(--surface-2)]">
      {label}
    </span>
  );
}
