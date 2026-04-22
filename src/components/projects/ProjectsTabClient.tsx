"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types";
import ProjectCard from "./ProjectCard";
import { partitionProjects } from "@/lib/projects";
import { FiBriefcase, FiGithub } from "react-icons/fi";

export interface ProjectsTabClientProps {
  projects: Project[];
}

const TABS = [
  { id: "client", label: "Client Work", Icon: FiBriefcase },
  { id: "oss", label: "Open Source", Icon: FiGithub },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProjectsTabClient({ projects }: ProjectsTabClientProps) {
  const [tab, setTab] = useState<TabId>("client");
  const { clientProjects, ossProjects } = partitionProjects(projects);
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ client: null, oss: null });

  function handleKeyDown(e: React.KeyboardEvent, current: TabId) {
    const ids = TABS.map((t) => t.id);
    const idx = ids.indexOf(current);
    if (e.key === "ArrowRight") {
      const next = ids[(idx + 1) % ids.length];
      setTab(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      const prev = ids[(idx - 1 + ids.length) % ids.length];
      setTab(prev);
      tabRefs.current[prev]?.focus();
    }
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Project categories"
        className="flex gap-1 mb-8 p-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] w-fit"
      >
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            ref={(el) => {
              tabRefs.current[id] = el;
            }}
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`tabpanel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
            onKeyDown={(e) => handleKeyDown(e, id)}
            className={`flex items-center gap-2 px-4 py-1.5 min-h-[48px] rounded-md text-sm font-medium transition-all duration-150 ${
              tab === id
                ? "bg-[var(--accent)] text-[var(--bg)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <Icon size={14} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      {TABS.map(({ id }) => {
        const items = id === "client" ? clientProjects : ossProjects;
        return (
          <div
            key={id}
            role="tabpanel"
            id={`tabpanel-${id}`}
            aria-labelledby={`tab-${id}`}
            hidden={tab !== id}
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {items.map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
          </div>
        );
      })}
    </>
  );
}
