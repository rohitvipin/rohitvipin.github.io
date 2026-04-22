import type { ImpactStory } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";

export interface ImpactSectionProps {
  impact: ImpactStory[];
}

function metricBullets(metric: string): string[] {
  return metric
    .split(/\.\s+/)
    .map((b) => b.replace(/\.$/, "").trim())
    .filter(Boolean);
}

export default function ImpactSection({ impact }: ImpactSectionProps) {
  return (
    <section id="impact" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          title="Transformations"
          subtitle="Platform modernisation, engineering org scale, and AI enablement - in production."
        />
        <div className="space-y-6">
          {impact.map((story) => (
            <article key={story.id} className="card p-6 lg:p-8 space-y-6">
              <div className="space-y-3">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md border border-[var(--border)] text-xs font-medium text-[var(--muted)] mb-2">
                    {story.domain}
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--text)]">{story.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {metricBullets(story.metric).map((bullet) => (
                    <span
                      key={bullet}
                      className="px-2.5 py-0.5 rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/8 text-xs font-semibold text-[var(--accent)]"
                    >
                      {bullet}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[var(--muted)] text-sm leading-relaxed">
                <span className="font-medium text-[var(--text)]">Problem: </span>
                {story.problem}
              </p>

              <dl className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Scope
                  </dt>
                  <dd className="text-sm text-[var(--muted)] leading-relaxed">{story.scope}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    My Role
                  </dt>
                  <dd className="text-sm text-[var(--muted)] leading-relaxed">{story.led}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Outcome
                  </dt>
                  <dd className="text-sm text-[var(--muted)] leading-relaxed">{story.result}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
