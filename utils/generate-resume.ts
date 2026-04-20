import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { createWriteStream, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";

import profileData from "../data/profile.json";
import socialsData from "../data/socials.json";
import experienceData from "../data/experience.json";
import skillsData from "../data/skills.json";
import projectsData from "../data/projects.json";
import leadershipData from "../data/leadership.json";
import educationData from "../data/education.json";
import communityData from "../data/community.json";
import awardsData from "../data/awards.json";
import resumeConfigData from "../data/resume-config.json";

import { ResumeDocument } from "./resume/ResumeDocument";
import type {
  Profile,
  Social,
  ExperienceEntry,
  SkillCategory,
  Project,
  Leadership,
  Education,
  CommunityEntry,
  Award,
  ResumeConfig,
} from "../src/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../public/Rohit_Vipin_Mathews_Resume.pdf");
const FALLBACK_EXISTS = existsSync(OUTPUT_PATH);

async function generate() {
  console.log("Generating resume PDF from data/*.json...");

  const element = React.createElement(ResumeDocument, {
    config: resumeConfigData as ResumeConfig,
    profile: profileData as Profile,
    socials: socialsData as Social[],
    experience: experienceData as ExperienceEntry[],
    skills: skillsData as SkillCategory[],
    projects: projectsData as Project[],
    leadership: leadershipData as Leadership,
    education: educationData as Education[],
    community: communityData as CommunityEntry[],
    awards: awardsData as Award[],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream = await renderToStream(element as any);
  const out = createWriteStream(OUTPUT_PATH);
  await pipeline(stream, out);
  console.log(`Resume written to ${OUTPUT_PATH}`);
}

generate().catch((err) => {
  console.error("Resume generation failed:", err);
  if (FALLBACK_EXISTS) {
    console.warn("Falling back to existing static PDF.");
    process.exit(0);
  }
  process.exit(1);
});
