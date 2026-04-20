import type { Leadership } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";

export interface LeadershipSectionProps {
  leadership: Leadership;
}

export default function LeadershipSection({ leadership }: LeadershipSectionProps) {
  return (
    <section id="leadership" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title={leadership.title} />
        <div className="space-y-6">
          {leadership.sections.map((sub) => (
            <div key={sub.title} className="card p-8 space-y-3">
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
