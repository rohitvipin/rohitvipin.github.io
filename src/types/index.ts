export interface KeyMetric {
  label: string;
  value: string;
  detail: string;
  tier?: "primary" | "secondary";
}

export interface Profile {
  name: string;
  title: string;
  headline: string;
  location: string;
  bio: string;
  email: string;
  phone: string;
  years_of_experience: number;
  timezone: string;
  availability_status: "open" | "closed" | "passive";
  profile_picture: string;
  github_avatar: string;
  key_metrics: KeyMetric[];
  tags?: string[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  location: string;
  duration: string;
  current: boolean;
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
