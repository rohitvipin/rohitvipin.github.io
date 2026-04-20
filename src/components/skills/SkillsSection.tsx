import type { SkillCategory } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";
import SkillCategoryCard from "@/components/skills/SkillCategoryCard";

export interface SkillsSectionProps {
  skills: SkillCategory[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="Skills" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((cat) => (
            <SkillCategoryCard key={cat.category} category={cat.category} skills={cat.skills} />
          ))}
        </div>
      </div>
    </section>
  );
}
