import { TechChip } from "@/components/shared/TechChip";

const INITIAL_VISIBLE = 10;

export interface SkillCategoryCardProps {
  category: string;
  skills: string[];
}

export function SkillCategoryCard({ category, skills }: SkillCategoryCardProps) {
  const hidden = Math.max(0, skills.length - INITIAL_VISIBLE);

  return (
    <div className="card card-hover p-6 space-y-4">
      <h3 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider">
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.slice(0, INITIAL_VISIBLE).map((skill) => (
          <TechChip key={skill} label={skill} />
        ))}
      </div>
      {hidden > 0 && (
        <details className="card-details flex flex-col">
          <summary
            aria-label={`Show ${hidden} more ${category} skills`}
            className="order-last mt-2 text-xs px-2.5 py-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-150 cursor-pointer font-mono w-fit min-h-[44px] flex items-center"
          >
            <span className="[details[open]_&]:hidden">+{hidden} more</span>
            <span className="hidden [details[open]_&]:inline">Show less</span>
          </summary>
          <div className="grid grid-rows-[0fr] [details[open]_&]:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out overflow-hidden">
            <div className="flex flex-wrap gap-2 min-h-0">
              {skills.slice(INITIAL_VISIBLE).map((skill) => (
                <TechChip key={skill} label={skill} />
              ))}
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
