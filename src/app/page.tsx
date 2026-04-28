import { Nav } from "@/components/shared/Nav";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { ImpactSection } from "@/components/impact/ImpactSection";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { LeadershipSection } from "@/components/leadership/LeadershipSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { CommunitySection } from "@/components/community/CommunitySection";
import { AwardsSection } from "@/components/awards/AwardsSection";
import { EducationSection } from "@/components/education/EducationSection";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { FiDownload, FiMail } from "react-icons/fi";
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
  navLinks,
  impact,
} from "@/lib/data";
import { resumeHref } from "@/lib/paths";
import { getInitials } from "@/lib/profile";

export default function Home() {
  return (
    <>
      <Nav initials={getInitials(profile.name)} navLinks={navLinks} />
      <main id="main-content">
        <Hero profile={profile} socials={socials} />
        <div className="scroll-animate">
          <About profile={profile} />
        </div>
        <div className="scroll-animate">
          <ImpactSection impact={impact} />
        </div>
        <div className="scroll-animate">
          <ExperienceTimeline
            experience={experience}
            yearsOfExperience={profile.years_of_experience}
          />
        </div>
        <div className="scroll-animate">
          <LeadershipSection leadership={leadership} />
        </div>
        <div className="scroll-animate">
          <ProjectsSection projects={projects} />
        </div>
        <div className="scroll-animate">
          <SkillsSection skills={skills} />
        </div>
        <div className="scroll-animate">
          <CommunitySection community={community} />
        </div>
        <div className="scroll-animate">
          <AwardsSection awards={awards} />
        </div>
        <div className="scroll-animate">
          <EducationSection education={education} />
        </div>

        <section
          id="contact"
          aria-labelledby="contact-title"
          className="section border-t border-[var(--border)]"
        >
          <div className="mx-auto max-w-6xl space-y-6 px-6 text-center">
            {profile.open_to && (
              <h2 id="contact-title" className="text-2xl font-bold text-[var(--text)]">
                {profile.open_to}
              </h2>
            )}
            {profile.availability_note && (
              <p className="mx-auto max-w-xl text-[var(--muted)]">{profile.availability_note}</p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-[var(--bg)] transition-opacity hover:opacity-90"
              >
                <FiMail size={16} aria-hidden="true" />
                Get in Touch
              </a>
              <a
                href={resumeHref}
                download
                aria-label="Download CV - Rohit Vipin Mathews resume PDF"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-6 py-3 font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <FiDownload size={16} aria-hidden="true" />
                Download CV
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p className="text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <SocialLinks socials={socials} />
        </div>
      </footer>
      <ScrollToTop />
    </>
  );
}
