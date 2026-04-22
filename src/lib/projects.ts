import type { Project } from "@/types";

const OSS_CLIENTS = ["Personal", "Personal / Community"] as const;

export function isOssProject(project: Project): boolean {
  return (OSS_CLIENTS as readonly string[]).includes(project.client);
}

export function parseStartYear(duration: string): number {
  return Number(duration.match(/\d{4}/)?.[0] ?? 0);
}

export function partitionProjects(projects: Project[]): {
  clientProjects: Project[];
  ossProjects: Project[];
} {
  const clientProjects: Project[] = [];
  const ossProjects: Project[] = [];

  for (const p of projects) {
    if (isOssProject(p)) {
      ossProjects.push(p);
    } else {
      clientProjects.push(p);
    }
  }

  const byStartYearDesc = (a: Project, b: Project) =>
    parseStartYear(b.duration) - parseStartYear(a.duration);

  return {
    clientProjects: clientProjects.sort(byStartYearDesc),
    ossProjects: ossProjects.sort(byStartYearDesc),
  };
}
