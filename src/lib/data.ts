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

export const profile: Profile = ProfileSchema.parse(profileData);
export const experience: ExperienceEntry[] = z.array(ExperienceSchema).parse(experienceData);
export const projects: Project[] = z.array(ProjectSchema).parse(projectsData);
export const skills: SkillCategory[] = z.array(SkillCategorySchema).parse(skillsData);
export const education: Education[] = z.array(EducationSchema).parse(educationData);
export const socials: Social[] = z.array(SocialSchema).parse(socialsData);
export const awards: Award[] = z.array(AwardSchema).parse(awardsData);
export const community: CommunityEntry[] = z.array(CommunityEntrySchema).parse(communityData);
export const leadership: Leadership = LeadershipSchema.parse(leadershipData);
