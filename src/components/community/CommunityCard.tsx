"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import type { CommunityEntry } from "@/types";

export interface CommunityCardProps {
  entry: CommunityEntry;
  icon: React.ReactNode;
}

export default function CommunityCard({ entry, icon }: CommunityCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--accent-glow)] flex items-center justify-center text-[var(--accent)] shrink-0">
          {icon}
        </div>
        <p className="text-xs font-medium text-[var(--accent)] uppercase tracking-wider">
          {entry.type}
        </p>
      </div>
      <h3 className="font-semibold text-sm text-[var(--text)] leading-snug">{entry.title}</h3>
      {entry.location && <p className="text-xs text-[var(--muted-2)]">{entry.location}</p>}
      <p className="text-xs text-[var(--muted)] leading-relaxed">{entry.description}</p>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:opacity-80 transition-opacity"
        aria-expanded={open}
        aria-label={open ? "Hide highlights" : `Show ${entry.highlights.length} highlights`}
      >
        <FiChevronDown
          size={14}
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
        {open ? "Hide details" : `Show ${entry.highlights.length} highlights`}
      </button>

      {open && (
        <ul className="space-y-2 pt-1 border-t border-[var(--border)]">
          {entry.highlights.map((h) => (
            <li key={h} className="text-xs text-[var(--muted)] flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5 shrink-0">·</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
