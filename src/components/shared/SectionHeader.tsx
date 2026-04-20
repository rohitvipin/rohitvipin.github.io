export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold tracking-tight text-[var(--text)]">{title}</h2>
      <div className="mt-2 h-0.5 w-12 rounded bg-[var(--accent)]" />
      {subtitle && <p className="mt-3 text-[var(--muted)] text-base">{subtitle}</p>}
    </div>
  );
}
