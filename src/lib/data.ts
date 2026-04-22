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

export const profile: Profile = ProfileSchema.parse(profileData);
export const experience: ExperienceEntry[] = z.array(ExperienceSchema).parse(experienceData);
export const projects: Project[] = z.array(ProjectSchema).parse(projectsData);
export const skills: SkillCategory[] = z.array(SkillCategorySchema).parse(skillsData);
export const education: Education[] = z.array(EducationSchema).parse(educationData);
export const socials: Social[] = z.array(SocialSchema).parse(socialsData);
export const awards: Award[] = z.array(AwardSchema).parse(awardsData);
export const community: CommunityEntry[] = z.array(CommunityEntrySchema).parse(communityData);
export const leadership: Leadership = LeadershipSchema.parse(leadershipData);
export const navLinks: NavLink[] = z.array(NavLinkSchema).parse(navData);
export const impact: ImpactStory[] = z.array(ImpactStorySchema).parse(impactData);

const _basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
export const resumeHref = `${_basePath}/Rohit_Vipin_Mathews_Resume.pdf`;
