import { z } from "zod";

const socialUrl = z
  .string()
  .refine(
    (url) => url.startsWith("https://") || url.startsWith("mailto:"),
    "must start with https:// or mailto:"
  );

const KeyMetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  detail: z.string().min(1),
  tier: z.enum(["primary", "secondary"]).optional(),
});

export const ProfileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  headline: z.string().min(1),
  location: z.string().min(1),
  bio: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  years_of_experience: z.number().int().positive(),
  timezone: z.string().min(1),
  availability_status: z.enum(["open", "closed", "passive"]),
  profile_picture: z.string().optional(),
  github_avatar: z.string().url(),
  key_metrics: z.array(KeyMetricSchema).min(1),
  tags: z.array(z.string().min(1)).optional(),
  cta_primary: z.string().optional(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  duration: z.string().min(1),
  current: z.boolean(),
  description: z.string().min(1),
  techStack: z.array(z.string().min(1)),
  highlights: z.array(z.string().min(1)),
});

const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const ProjectSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  client: z.string().min(1),
  role: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().min(1),
  products: z.array(ProductSchema),
  highlights: z.array(z.string().min(1)),
  tech: z.array(z.string().min(1)),
  github: z.string().url().optional(),
});

export const SkillCategorySchema = z.object({
  category: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
});

export const EducationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().min(1),
  year: z.string().min(1),
});

export const SocialSchema = z.object({
  platform: z.string().min(1),
  url: socialUrl,
  icon: z.string().min(1),
});

export const AwardSchema = z.object({
  title: z.string().min(1),
  organization: z.string().min(1),
  year: z.string().nullable(),
  description: z.string().min(1),
});

export const CommunityEntrySchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  location: z.string().optional(),
  description: z.string().min(1),
  highlights: z.array(z.string().min(1)),
});

const LeadershipSubsectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const LeadershipSchema = z.object({
  title: z.string().min(1),
  sections: z.array(LeadershipSubsectionSchema).min(1),
});

export const NavLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1).startsWith("#"),
});

export const FILE_ZSCHEMAS: Record<string, z.ZodTypeAny> = {
  "profile.json": ProfileSchema,
  "experience.json": z.array(ExperienceSchema),
  "projects.json": z.array(ProjectSchema),
  "skills.json": z.array(SkillCategorySchema),
  "education.json": z.array(EducationSchema),
  "socials.json": z.array(SocialSchema),
  "awards.json": z.array(AwardSchema),
  "community.json": z.array(CommunityEntrySchema),
  "leadership.json": LeadershipSchema,
  "nav.json": z.array(NavLinkSchema),
};
