import type { Award } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaTrophy } from "react-icons/fa6";

export interface AwardsSectionProps {
  awards: Award[];
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <section id="awards" aria-labelledby="awards-heading" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="Awards & Recognition" headingId="awards-heading" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((a) => (
            <div key={a.title} className="card p-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <FaTrophy
                  size={16}
                  className="text-[var(--accent)] mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                {a.year && <span className="text-xs font-mono text-[var(--muted)]">{a.year}</span>}
              </div>
              <h3 className="font-semibold text-sm text-[var(--text)]">{a.title}</h3>
              <p className="text-xs text-[var(--muted-2)]">{a.organization}</p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
