import type { Project } from "@/types";
import { byStartYearDesc } from "@/lib/duration";

const OSS_CLIENTS = ["Personal", "Personal / Community"] as const;

export function isOssProject(project: Project): boolean {
  return (OSS_CLIENTS as readonly string[]).includes(project.client);
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

  return {
    clientProjects: clientProjects.sort(byStartYearDesc),
    ossProjects: ossProjects.sort(byStartYearDesc),
  };
}
