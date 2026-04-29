import type { ExperienceEntry } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ExperienceCard } from "./ExperienceCard";

export interface ExperienceTimelineProps {
  experience: ExperienceEntry[];
  yearsOfExperience: number;
}

export function ExperienceTimeline({ experience, yearsOfExperience }: ExperienceTimelineProps) {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          title="Experience"
          subtitle={`${yearsOfExperience}+ years across engineering leadership, architecture, and delivery`}
          headingId="experience-heading"
        />
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-0 ml-[11px] hidden w-px bg-[var(--border)] md:block" />
          <div className="space-y-6 md:pl-8">
            {experience.map((entry) => (
              <div key={`${entry.company}-${entry.role}`} className="relative">
                <div
                  className="absolute top-6 -left-8 hidden h-3 w-3 rounded-full border-2 bg-[var(--bg)] md:block"
                  style={{ borderColor: entry.color ?? "var(--accent)" }}
                />
                <ExperienceCard entry={entry} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
