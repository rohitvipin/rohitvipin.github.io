import type {
  Profile,
  ExperienceEntry,
  Project,
  SkillCategory,
  Education,
  Social,
  Award,
  CommunityEntry,
  Leadership,
  NavLink,
  ImpactStory,
} from "@/types";
import {
  ProfileSchema,
  ExperienceSchema,
  ProjectSchema,
  SkillCategorySchema,
  EducationSchema,
  SocialSchema,
  AwardSchema,
  CommunityEntrySchema,
  LeadershipSchema,
  NavLinkSchema,
  ImpactStorySchema,
} from "@/lib/schemas";
import { z } from "zod";
import { byStartYearDesc } from "@/lib/duration";

import profileData from "../../data/profile.json";
import experienceData from "../../data/experience.json";
import projectsData from "../../data/projects.json";
import skillsData from "../../data/skills.json";
import educationData from "../../data/education.json";
import socialsData from "../../data/socials.json";
import awardsData from "../../data/awards.json";
import communityData from "../../data/community.json";
import leadershipData from "../../data/leadership.json";
import navData from "../../data/nav.json";
import impactData from "../../data/impact.json";

function parseOrThrow<S extends z.ZodTypeAny>(schema: S, data: unknown, name: string): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const msgs = result.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`[data] ${name} validation failed:\n${msgs}`);
  }
  return result.data;
}

export const profile: Profile = parseOrThrow(ProfileSchema, profileData, "profile");
export const experience: ExperienceEntry[] = parseOrThrow(
  z.array(ExperienceSchema),
  experienceData,
  "experience"
).sort(byStartYearDesc);
export const projects: Project[] = parseOrThrow(
  z.array(ProjectSchema),
  projectsData,
  "projects"
).sort(byStartYearDesc);
export const skills: SkillCategory[] = parseOrThrow(
  z.array(SkillCategorySchema),
  skillsData,
  "skills"
);
export const education: Education[] = parseOrThrow(
  z.array(EducationSchema),
  educationData,
  "education"
);
export const socials: Social[] = parseOrThrow(z.array(SocialSchema), socialsData, "socials");
export const awards: Award[] = parseOrThrow(z.array(AwardSchema), awardsData, "awards");
export const community: CommunityEntry[] = parseOrThrow(
  z.array(CommunityEntrySchema),
  communityData,
  "community"
);
export const leadership: Leadership = parseOrThrow(LeadershipSchema, leadershipData, "leadership");
export const navLinks: NavLink[] = parseOrThrow(z.array(NavLinkSchema), navData, "navLinks");
export const impact: ImpactStory[] = parseOrThrow(z.array(ImpactStorySchema), impactData, "impact");
