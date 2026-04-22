import Image from "next/image";
import { FiDownload, FiMail } from "react-icons/fi";
import type { Profile, Social } from "@/types";
import SocialLinks from "@/components/shared/SocialLinks";

export interface HeroProps {
  profile: Profile;
  socials: Social[];
}

export default function Hero({ profile, socials }: HeroProps) {
  const primaryMetrics = profile.key_metrics?.filter((m) => m.tier === "primary") ?? [];
  const secondaryMetrics = profile.key_metrics?.filter((m) => m.tier === "secondary") ?? [];

  return (
    <section className="min-h-screen flex items-center pt-14">
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-16 items-center">
          {/* Left */}
          <div className="space-y-6">
            {profile.tags && profile.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md border border-[var(--accent)]/30 bg-[var(--accent)]/8 text-xs font-medium text-[var(--accent)]"
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
              {profile.open_to && (
                <p className="mt-3 text-sm text-[var(--muted)] border-l-2 border-[var(--accent)] pl-3">
                  {profile.open_to}
                </p>
              )}
            </div>

            <p className="text-[var(--muted)] text-lg leading-relaxed">{profile.headline}</p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#impact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg)] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {profile.cta_primary ?? "See Impact"}
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--accent)]/50 text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent)]/8 transition-colors"
              >
                <FiMail size={16} aria-hidden="true" />
                Get in Touch
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Rohit_Vipin_Mathews_Resume.pdf`}
                download
                title="Download CV"
                aria-label="Download CV"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted)] text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <FiDownload size={16} aria-hidden="true" />
                Download CV
              </a>
            </div>

            {/* Mobile-only socials */}
            <div className="lg:hidden">
              <SocialLinks socials={socials} />
            </div>
          </div>

          {/* Right — avatar + socials */}
          <div className="hidden lg:flex flex-col items-end gap-5">
            <div className="flex flex-col items-center gap-5">
              <div className="relative w-80 h-80 rounded-2xl overflow-hidden border border-[var(--border)]/50 ring-2 ring-[var(--accent)]/10 shadow-2xl">
                <Image
                  src={profile.github_avatar}
                  alt={`Profile photo of ${profile.name}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <SocialLinks socials={socials} />
            </div>
          </div>
        </div>

        {/* Primary metrics */}
        {primaryMetrics.length > 0 && (
          <dl className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {primaryMetrics.map((m) => (
              <div key={m.label} className="card p-4 space-y-1">
                <dt className="text-xs text-[var(--muted)] leading-tight">{m.label}</dt>
                <dd
                  className={`font-bold gradient-text ${m.value.length <= 2 ? "text-4xl" : "text-2xl"}`}
                >
                  {m.value}
                </dd>
                {m.detail && <dd className="text-xs text-[var(--muted-2)]">{m.detail}</dd>}
              </div>
            ))}
          </dl>
        )}

        {/* Secondary metrics */}
        {secondaryMetrics.length > 0 && (
          <dl className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {secondaryMetrics.map((m) => (
              <div
                key={m.label}
                className="p-3 space-y-1 rounded-lg border border-[var(--border)] border-dashed bg-[var(--surface)]/50"
              >
                <dt className="text-xs text-[var(--muted-2)] leading-tight">{m.label}</dt>
                <dd className="text-lg font-semibold text-[var(--muted)]">{m.value}</dd>
                {m.detail && <dd className="text-xs text-[var(--muted-2)]">{m.detail}</dd>}
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
