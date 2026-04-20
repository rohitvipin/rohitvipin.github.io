import type { Profile } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";
import { FiMapPin, FiClock, FiCalendar } from "react-icons/fi";

export default function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="About" />
        <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
          <p className="text-[var(--muted)] text-lg leading-relaxed">{profile.bio}</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <FiMapPin size={16} className="text-[var(--accent)] shrink-0" />
              {profile.location}
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <FiCalendar size={16} className="text-[var(--accent)] shrink-0" />
              {profile.years_of_experience}+ years experience
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <FiClock size={16} className="text-[var(--accent)] shrink-0" />
              {profile.timezone}
            </div>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text)] hover:border-[var(--accent)] transition-colors"
            >
              {profile.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
