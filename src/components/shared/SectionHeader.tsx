export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  headingId?: string;
}

export function SectionHeader({ title, subtitle, headingId }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <h2 id={headingId} className="text-3xl font-bold tracking-tight text-[var(--text)]">
        {title}
      </h2>
      <div className="mt-2 h-0.5 w-12 rounded bg-[var(--accent)]" />
      {subtitle && <p className="mt-3 text-base text-[var(--muted)]">{subtitle}</p>}
    </div>
  );
}
