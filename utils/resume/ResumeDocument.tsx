import React from "react";
import { Document, Page } from "@react-pdf/renderer";
import { styles } from "./styles";
import { Header } from "./sections/Header";
import { Experience } from "./sections/Experience";
import { Skills } from "./sections/Skills";
import { Projects } from "./sections/Projects";
import { Leadership } from "./sections/Leadership";
import { Education } from "./sections/Education";
import { Community } from "./sections/Community";
import { Awards } from "./sections/Awards";
import type {
  Profile,
  Social,
  ExperienceEntry,
  SkillCategory,
  Project,
  Leadership as LeadershipData,
  Education as EducationData,
  CommunityEntry,
  Award,
  ResumeConfig,
} from "../../src/types";

interface ResumeDocumentProps {
  config: ResumeConfig;
  profile: Profile;
  socials: Social[];
  experience: ExperienceEntry[];
  skills: SkillCategory[];
  projects: Project[];
  leadership: LeadershipData;
  education: EducationData[];
  community: CommunityEntry[];
  awards: Award[];
}

const SECTION_MAP: Record<string, (props: ResumeDocumentProps) => React.ReactElement | null> = {
  experience: ({ config, experience }) => {
    if (!config.sections.experience?.show) return null;
    return <Experience entries={experience} sinceYear={config.sections.experience.sinceYear} />;
  },
  skills: ({ config, skills }) => {
    if (!config.sections.skills?.show) return null;
    return <Skills categories={skills} />;
  },
  projects: ({ config, projects }) => {
    if (!config.sections.projects?.show) return null;
    return <Projects projects={projects} maxItems={config.sections.projects.maxItems} />;
  },
  leadership: ({ config, leadership }) => {
    if (!config.sections.leadership?.show) return null;
    return <Leadership data={leadership} />;
  },
  education: ({ config, education }) => {
    if (!config.sections.education?.show) return null;
    return <Education entries={education} />;
  },
  community: ({ config, community }) => {
    if (!config.sections.community?.show) return null;
    return <Community entries={community} maxItems={config.sections.community.maxItems} />;
  },
  awards: ({ config, awards }) => {
    if (!config.sections.awards?.show) return null;
    return <Awards awards={awards} />;
  },
};

export function ResumeDocument(props: ResumeDocumentProps) {
  const { config, profile, socials } = props;

  return (
    <Document
      title={`${profile.name} - Resume`}
      author={profile.name}
      subject={profile.title}
      keywords={profile.tags?.join(", ")}
    >
      <Page size={config.pageSize} style={styles.page}>
        <Header profile={profile} socials={socials} showKeyMetrics={config.showKeyMetrics} />
        {config.sectionOrder.map((key) => {
          const renderer = SECTION_MAP[key];
          if (!renderer) return null;
          return <React.Fragment key={key}>{renderer(props)}</React.Fragment>;
        })}
      </Page>
    </Document>
  );
}
