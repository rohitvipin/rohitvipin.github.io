export interface KeyMetric {
  label: string;
  value: string;
  detail: string;
  tier: "primary" | "secondary";
}

export interface ValueProposition {
  audience: string;
  value: string;
}

export interface Profile {
  name: string;
  title: string;
  headline: string;
  location: string;
  bio: string;
  bio_quote?: string;
  email: string;
  phone?: string;
  years_of_experience: number;
  timezone: string;
  availability_status: "open" | "closed" | "passive";
  profile_picture?: string;
  github_avatar: string;
  country_code?: string;
  key_metrics: KeyMetric[];
  tags?: string[];
  cta_primary?: string;
  open_to?: string;
  availability_note?: string;
  value_propositions?: ValueProposition[];
  knows_about?: string[];
}

export interface ImpactStory {
  id: string;
  title: string;
  domain: string;
  color?: string;
  problem: string;
  scope: string;
  led: string;
  result: string;
  metrics: string[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  location: string;
  duration: string;
  current: boolean;
  color?: string;
  description: string;
  techStack: string[];
  highlights: string[];
}

export interface Product {
  name: string;
  description: string;
}

export interface Project {
  name: string;
  domain: string;
  color?: string;
  client: string;
  role: string;
  duration: string;
  description: string;
  products: Product[];
  highlights: string[];
  tech: string[];
  github?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  year: string;
}

export interface Social {
  platform: string;
  url: string;
  icon: string;
}

export interface Award {
  title: string;
  organization: string;
  year: string | null;
  description: string;
}

export interface CommunityEntry {
  type: string;
  title: string;
  location?: string;
  description: string;
  highlights: string[];
}

export interface LeadershipSubsection {
  title: string;
  description: string;
}

export interface Leadership {
  title: string;
  sections: LeadershipSubsection[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ResumeSectionConfig {
  show: boolean;
  maxItems?: number;
  sinceYear?: number;
}

export interface ResumeConfig {
  pageSize: "A4" | "LETTER";
  font: string;
  showKeyMetrics: boolean;
  sectionOrder: string[];
  sections: {
    experience?: ResumeSectionConfig;
    skills?: ResumeSectionConfig;
    projects?: ResumeSectionConfig;
    leadership?: ResumeSectionConfig;
    education?: ResumeSectionConfig;
    community?: ResumeSectionConfig;
    awards?: ResumeSectionConfig;
  };
}
