import type { Award } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaTrophy } from "react-icons/fa6";

export interface AwardsSectionProps {
  awards: Award[];
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <section id="awards" aria-labelledby="awards-heading" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title="Awards & Recognition" headingId="awards-heading" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {awards.map((a) => (
            <div key={a.title} className="card space-y-2 p-5">
              <div className="flex items-start justify-between gap-3">
                <FaTrophy
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--accent)]"
                  aria-hidden="true"
                />
                {a.year && <span className="font-mono text-xs text-[var(--muted)]">{a.year}</span>}
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)]">{a.title}</h3>
              <p className="text-xs text-[var(--muted-2)]">{a.organization}</p>
              <p className="text-xs leading-relaxed text-[var(--muted)]">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
