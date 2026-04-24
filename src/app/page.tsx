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
          <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
            {profile.open_to && (
              <h2 id="contact-title" className="text-2xl font-bold text-[var(--text)]">
                {profile.open_to}
              </h2>
            )}
            {profile.availability_note && (
              <p className="text-[var(--muted)] max-w-xl mx-auto">{profile.availability_note}</p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent)] text-[var(--bg)] font-medium hover:opacity-90 transition-opacity"
              >
                <FiMail size={16} aria-hidden="true" />
                Get in Touch
              </a>
              <a
                href={resumeHref}
                download
                aria-label="Download CV - Rohit Vipin Mathews resume PDF"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--muted)] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <FiDownload size={16} aria-hidden="true" />
                Download CV
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
