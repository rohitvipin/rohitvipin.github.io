import type { Leadership } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";

export interface LeadershipSectionProps {
  leadership: Leadership;
}

export function LeadershipSection({ leadership }: LeadershipSectionProps) {
  return (
    <section id="expertise" aria-labelledby="expertise-heading" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title={leadership.title} headingId="expertise-heading" />
        <div className="grid md:grid-cols-2 gap-6">
          {leadership.sections.map((sub) => (
            <div key={sub.title} className="card p-6 space-y-3">
              <h3 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider">
                {sub.title}
              </h3>
              <p className="text-[var(--muted)] text-lg leading-relaxed whitespace-pre-line">
                {sub.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
