import { TechChip } from "@/components/shared/TechChip";

const INITIAL_VISIBLE = 10;

export interface SkillCategoryCardProps {
  category: string;
  skills: string[];
}

export function SkillCategoryCard({ category, skills }: SkillCategoryCardProps) {
  const hidden = Math.max(0, skills.length - INITIAL_VISIBLE);

  return (
    <div className="card space-y-4 p-6">
      <h3 className="text-sm font-semibold tracking-wider text-[var(--text)] uppercase">
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
            className="order-last mt-2 flex min-h-[48px] w-fit cursor-pointer items-center rounded-full border border-[var(--accent)] px-2.5 py-0.5 font-mono text-xs text-[var(--accent)] transition-[background-color,color,border-color] duration-150 hover:bg-[var(--accent)] hover:text-[var(--bg)]"
          >
            <span className="[details[open]_&]:hidden">+{hidden} more</span>
            <span className="hidden [details[open]_&]:inline">Show less</span>
          </summary>
          <div className="flex flex-wrap gap-2">
            {skills.slice(INITIAL_VISIBLE).map((skill) => (
              <TechChip key={skill} label={skill} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
