import Nav from "@/components/shared/Nav";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { AnimateOnScroll } from "@/components/shared/AnimateOnScroll";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import ProjectsSection from "@/components/projects/ProjectsSection";
import SkillsSection from "@/components/skills/SkillsSection";
import CommunitySection from "@/components/community/CommunitySection";
import AwardsSection from "@/components/awards/AwardsSection";
import EducationSection from "@/components/education/EducationSection";
import LeadershipSection from "@/components/leadership/LeadershipSection";
import SocialLinks from "@/components/shared/SocialLinks";
import {
  profile,
  socials,
  experience,
  projects,
  skills,
  community,
  awards,
  education,
  leadership,
} from "@/lib/data";

export default function Home() {
  return (
    <>
      <Nav initials={profile.name[0]} />
      <main id="main-content">
        <Hero profile={profile} socials={socials} />
        <AnimateOnScroll sectionId="about">
          <About profile={profile} />
        </AnimateOnScroll>
        <AnimateOnScroll sectionId="experience">
          <ExperienceTimeline
            experience={experience}
            yearsOfExperience={profile.years_of_experience}
          />
        </AnimateOnScroll>
        <AnimateOnScroll sectionId="projects">
          <ProjectsSection projects={projects} />
        </AnimateOnScroll>
        <AnimateOnScroll sectionId="leadership">
          <LeadershipSection leadership={leadership} />
        </AnimateOnScroll>
        <AnimateOnScroll sectionId="skills">
          <SkillsSection skills={skills} />
        </AnimateOnScroll>
        <AnimateOnScroll sectionId="community">
          <CommunitySection community={community} />
        </AnimateOnScroll>
        <AnimateOnScroll sectionId="awards">
          <AwardsSection awards={awards} />
        </AnimateOnScroll>
        <AnimateOnScroll sectionId="education">
          <EducationSection education={education} />
        </AnimateOnScroll>
      </main>
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <SocialLinks socials={socials} />
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Rohit_Vipin_Mathews_Resume.pdf`}
            download
            className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            Download Resume
          </a>
        </div>
      </footer>
      <ScrollToTop />
    </>
  );
}
