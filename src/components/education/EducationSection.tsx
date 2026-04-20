import type { Education } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";
import { FaGraduationCap } from "react-icons/fa6";

export interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="Education" />
        <div className="space-y-4">
          {education.map((e) => (
            <div key={e.institution} className="card p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-glow)] flex items-center justify-center shrink-0">
                <FaGraduationCap size={20} className="text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">{e.degree}</h3>
                <p className="text-sm text-[var(--muted)] mt-0.5">{e.institution}</p>
                <p className="text-xs text-[var(--muted-2)] mt-1">
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
