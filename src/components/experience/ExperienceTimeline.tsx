import type { ExperienceEntry } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";
import ExperienceCard from "./ExperienceCard";
import { getCompanyColor } from "@/lib/colors";

export default function ExperienceTimeline({
  experience,
  yearsOfExperience,
}: {
  experience: ExperienceEntry[];
  yearsOfExperience: number;
}) {
  return (
    <section id="experience" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          title="Experience"
          subtitle={`${yearsOfExperience}+ years across engineering leadership, architecture, and delivery`}
        />
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--border)] hidden md:block ml-[11px]" />
          <div className="space-y-6 md:pl-8">
            {experience.map((entry) => (
              <div key={`${entry.company}-${entry.role}`} className="relative">
                <div
                  className="absolute -left-8 top-6 w-3 h-3 rounded-full border-2 bg-[var(--bg)] hidden md:block"
                  style={{ borderColor: getCompanyColor(entry.company) }}
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
