import Image from "next/image";
import { FiDownload } from "react-icons/fi";
import type { Profile, Social } from "@/types";
import SocialLinks from "@/components/shared/SocialLinks";

export default function Hero({ profile, socials }: { profile: Profile; socials: Social[] }) {
  return (
    <section className="min-h-screen flex items-center pt-14">
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center">
          {/* Left */}
          <div className="space-y-6">
            {profile.tags && profile.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/8 text-xs font-mono font-medium text-[var(--accent)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text)] leading-tight">
                {profile.name}
              </h1>
              <p className="mt-2 text-xl font-medium gradient-text">{profile.title}</p>
            </div>

            <p className="text-[var(--muted)] text-lg max-w-2xl leading-relaxed">
              {profile.headline}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                View Experience
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Rohit_Vipin_Mathews_Resume.pdf`}
                download
                title="Download Resume"
                aria-label="Download Resume"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <FiDownload size={16} />
              </a>
            </div>

            <SocialLinks socials={socials} />
          </div>

          {/* Right — avatar */}
          <div className="hidden lg:block">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-[var(--border)] shadow-2xl">
              <Image
                src={profile.github_avatar}
                alt={profile.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {profile.key_metrics?.map((m) => (
            <div key={m.label} className="card p-4 space-y-1">
              <div className="text-2xl font-bold gradient-text">{m.value}</div>
              <div className="text-xs text-[var(--muted)] leading-tight">{m.label}</div>
              <div className="text-xs text-[var(--muted-2)]">{m.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
