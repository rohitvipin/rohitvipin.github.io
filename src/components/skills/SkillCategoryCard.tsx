"use client";

import { useState } from "react";
import TechChip from "@/components/shared/TechChip";

const INITIAL_VISIBLE = 10;

export default function SkillCategoryCard({
  category,
  skills,
}: {
  category: string;
  skills: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? skills : skills.slice(0, INITIAL_VISIBLE);
  const hidden = skills.length - INITIAL_VISIBLE;

  return (
    <div className="card p-6 space-y-4">
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
            className="text-xs px-3 py-1 rounded-full border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            +{hidden} more
          </button>
        )}
        {expanded && hidden > 0 && (
          <button
            onClick={() => setExpanded(false)}
            className="text-xs px-3 py-1 rounded-full border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            show less
          </button>
        )}
      </div>
    </div>
  );
}
