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

import profileData from "../../data/profile.json";
import experienceData from "../../data/experience.json";
import projectsData from "../../data/projects.json";
import skillsData from "../../data/skills.json";
import educationData from "../../data/education.json";
import socialsData from "../../data/socials.json";
import awardsData from "../../data/awards.json";
import communityData from "../../data/community.json";
import leadershipData from "../../data/leadership.json";

// Cast to Profile so literal union types (e.g. availability_status) are enforced by the type, not inferred from JSON
export const profile = profileData as unknown as Profile;
export const experience = experienceData satisfies ExperienceEntry[];
export const projects = projectsData satisfies Project[];
export const skills = skillsData satisfies SkillCategory[];
export const education = educationData satisfies Education[];
export const socials = socialsData satisfies Social[];
export const awards = awardsData satisfies Award[];
export const community = communityData satisfies CommunityEntry[];
export const leadership = leadershipData satisfies Leadership;
