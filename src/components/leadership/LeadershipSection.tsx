import type { Leadership } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";

export interface LeadershipSectionProps {
  leadership: Leadership;
}

export function LeadershipSection({ leadership }: LeadershipSectionProps) {
  return (
    <section id="expertise" aria-labelledby="expertise-heading" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title={leadership.title} headingId="expertise-heading" />
        <div className="grid gap-6 md:grid-cols-2">
          {leadership.sections.map((sub) => (
            <div key={sub.title} className="card space-y-3 p-6">
              <h3 className="text-sm font-semibold tracking-wider text-[var(--text)] uppercase">
                {sub.title}
              </h3>
              <p className="text-lg leading-relaxed whitespace-pre-line text-[var(--muted)]">
                {sub.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
