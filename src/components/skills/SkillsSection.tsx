import type { SkillCategory } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";
import TechChip from "@/components/shared/TechChip";

export default function SkillsSection({ skills }: { skills: SkillCategory[] }) {
  return (
    <section id="skills" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="Skills" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((cat) => (
            <div key={cat.category} className="card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider">
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <TechChip key={skill} label={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
