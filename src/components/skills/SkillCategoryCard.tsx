"use client";

import { useState } from "react";
import TechChip from "@/components/shared/TechChip";

const INITIAL_VISIBLE = 10;

export interface SkillCategoryCardProps {
  category: string;
  skills: string[];
}

export default function SkillCategoryCard({ category, skills }: SkillCategoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? skills : skills.slice(0, INITIAL_VISIBLE);
  const hidden = Math.max(0, skills.length - INITIAL_VISIBLE);

  return (
    <div className="card card-hover p-6 space-y-4">
      <h3 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider">
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {visible.map((skill) => (
          <TechChip key={skill} label={skill} />
        ))}
        {!expanded && hidden > 0 && (
          <button
            onClick={() => setExpanded(true)}
            aria-expanded={false}
            aria-label={`Show ${hidden} more ${category} skills`}
            className="text-xs px-2.5 py-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-150 cursor-pointer font-mono"
          >
            +{hidden} more
          </button>
        )}
        {expanded && hidden > 0 && (
          <button
            onClick={() => setExpanded(false)}
            aria-expanded={true}
            aria-label={`Show fewer ${category} skills`}
            className="text-xs px-2.5 py-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-150 cursor-pointer font-mono"
          >
            show less
          </button>
        )}
      </div>
    </div>
  );
}
