import type { Education } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaGraduationCap } from "react-icons/fa6";

export interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" aria-labelledby="education-heading" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title="Education" headingId="education-heading" />
        <div className="space-y-4">
          {education.map((e) => (
            <div key={e.institution} className="card flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-glow)]">
                <FaGraduationCap size={20} className="text-[var(--accent)]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">{e.degree}</h3>
                <p className="mt-0.5 text-sm text-[var(--muted)]">{e.institution}</p>
                <p className="mt-1 text-xs text-[var(--muted-2)]">
                  {e.location} · {e.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
