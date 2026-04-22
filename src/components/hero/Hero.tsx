import Image from "next/image";
import { FiDownload, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import type { Profile, Social } from "@/types";
import SocialLinks from "@/components/shared/SocialLinks";
import { resumeHref, avatarHref } from "@/lib/paths";

export interface HeroProps {
  profile: Profile;
  socials: Social[];
}

export default function Hero({ profile, socials }: HeroProps) {
  const primaryMetrics = profile.key_metrics.filter((m) => m.tier === "primary");
  const secondaryMetrics = profile.key_metrics.filter((m) => m.tier === "secondary");

  return (
    <section aria-labelledby="hero-heading" className="min-h-screen flex items-center pt-14">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-16 items-center">
          {/* Left */}
          <div className="space-y-6">
            {profile.tags && profile.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md border border-[var(--border)] text-xs text-[var(--muted-2)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div>
              <h1
                id="hero-heading"
                className="text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text)] leading-tight"
              >
                {profile.name}
              </h1>
              <p className="mt-2 text-xl font-medium gradient-text">{profile.title}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                {profile.location && (
                  <span className="flex items-center gap-1 text-xs text-[var(--muted-2)]">
                    <FiMapPin
                      size={11}
                      className="text-[var(--muted-2)] shrink-0"
                      aria-hidden="true"
                    />
                    {profile.location}
                  </span>
                )}
                {profile.timezone && (
                  <span className="flex items-center gap-1 text-xs text-[var(--muted-2)]">
                    <FiClock
                      size={11}
                      className="text-[var(--muted-2)] shrink-0"
                      aria-hidden="true"
                    />
                    {profile.timezone}
                  </span>
                )}
                {profile.email && (
                  <span className="hidden sm:flex items-center gap-1 text-xs text-[var(--muted-2)]">
                    <FiMail
                      size={11}
                      className="text-[var(--muted-2)] shrink-0"
                      aria-hidden="true"
                    />
                    {profile.email}
                  </span>
                )}
              </div>
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
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--accent)]/50 text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent)]/8 transition-colors"
              >
                <FiMail size={16} aria-hidden="true" />
                Get in Touch
              </a>
              <a
                href={resumeHref}
                download
                aria-label="Download Rohit Vipin Mathews resume (PDF)"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border)] text-[var(--muted)] text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <FiDownload size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Download CV</span>
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
                  src={avatarHref}
                  alt={`Profile photo of ${profile.name}`}
                  fill
                  sizes="320px"
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
          <dl className="grid grid-cols-2 md:grid-cols-4 mt-3 gap-3">
            {secondaryMetrics.map((m) => (
              <div
                key={m.label}
                className="p-3 space-y-0.5 rounded-lg border border-[var(--accent)]/30"
              >
                <dt className="text-xs text-[var(--muted)] leading-tight">{m.label}</dt>
                <dd className="text-base font-semibold text-[var(--accent)]/80">{m.value}</dd>
                {m.detail && <dd className="text-xs text-[var(--muted-2)]">{m.detail}</dd>}
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
