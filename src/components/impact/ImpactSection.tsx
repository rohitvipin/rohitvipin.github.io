import type { ImpactStory } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";

export interface ImpactSectionProps {
  impact: ImpactStory[];
}

export function ImpactSection({ impact }: ImpactSectionProps) {
  return (
    <section id="impact" aria-labelledby="impact-section-title" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          title="Transformations"
          headingId="impact-section-title"
          subtitle="Platform modernisation, engineering org scale, and AI enablement - in production."
        />
        <div className="space-y-6">
          {impact.map((story) => (
            <article
              key={story.id}
              aria-labelledby={`${story.id}-title`}
              className="card space-y-6 p-6 lg:p-8"
            >
              <div className="space-y-3">
                <div>
                  <span
                    className="mb-2 inline-block rounded-md border px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]"
                    style={{
                      borderColor: `color-mix(in oklch, ${story.color ?? "var(--accent)"} 27%, transparent)`,
                    }}
                  >
                    {story.domain}
                  </span>
                  <h3 id={`${story.id}-title`} className="text-lg font-semibold text-[var(--text)]">
                    {story.title}
                  </h3>
                </div>
                <ul
                  role="list"
                  className="m-0 flex list-none flex-wrap gap-2 p-0"
                  aria-label="Key outcomes"
                >
                  {story.metrics.map((bullet, idx) => (
                    <li
                      key={`${story.id}-${idx}`}
                      className="rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/8 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm leading-relaxed text-[var(--muted)]">
                <span className="font-medium text-[var(--text)]">Problem: </span>
                {story.problem}
              </p>

              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <dt className="text-xs font-semibold tracking-wider text-[var(--muted)] uppercase">
                    Scope
                  </dt>
                  <dd className="text-sm leading-relaxed text-[var(--muted)]">{story.scope}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold tracking-wider text-[var(--muted)] uppercase">
                    My Role
                  </dt>
                  <dd className="text-sm leading-relaxed text-[var(--muted)]">{story.led}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold tracking-wider text-[var(--muted)] uppercase">
                    Outcome
                  </dt>
                  <dd className="text-sm leading-relaxed text-[var(--muted)]">{story.result}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
