import { FiDownload, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import type { Profile, Social } from "@/types";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ButtonLink } from "@/components/shared/Button";
import { TagBadge } from "@/components/shared/TagBadge";
import { resumeHref, avatarHref, avatarWebpHref } from "@/lib/paths";

export interface HeroProps {
  profile: Profile;
  socials: Social[];
}

export function Hero({ profile, socials }: HeroProps) {
  const primaryMetrics = profile.key_metrics.filter((m) => m.tier === "primary");
  const secondaryMetrics = profile.key_metrics.filter((m) => m.tier === "secondary");

  return (
    <section aria-labelledby="hero-heading" className="flex min-h-screen items-center pt-14">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-16 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-6">
            {profile.tags && profile.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag) => (
                  <TagBadge key={tag} label={tag} />
                ))}
              </div>
            )}

            <div>
              <h1
                id="hero-heading"
                className="text-5xl leading-tight font-bold tracking-tight text-[var(--text)] lg:text-6xl"
              >
                {profile.name}
              </h1>
              <p className="gradient-text mt-2 text-xl font-medium">{profile.title}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                {profile.location && (
                  <span className="flex items-center gap-1 text-xs text-[var(--muted-2)]">
                    <FiMapPin
                      size={11}
                      className="shrink-0 text-[var(--muted-2)]"
                      aria-hidden="true"
                    />
                    {profile.location}
                  </span>
                )}
                {profile.timezone && (
                  <span className="flex items-center gap-1 text-xs text-[var(--muted-2)]">
                    <FiClock
                      size={11}
                      className="shrink-0 text-[var(--muted-2)]"
                      aria-hidden="true"
                    />
                    {profile.timezone}
                  </span>
                )}
                {profile.email && (
                  <span className="hidden items-center gap-1 text-xs text-[var(--muted-2)] sm:flex">
                    <FiMail
                      size={11}
                      className="shrink-0 text-[var(--muted-2)]"
                      aria-hidden="true"
                    />
                    {profile.email}
                  </span>
                )}
              </div>
            </div>

            <p className="text-lg leading-relaxed text-[var(--muted)]">{profile.headline}</p>

            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink variant="primary" href="#impact">
                {profile.cta_primary ?? "See Impact"}
              </ButtonLink>
              <a
                href={`mailto:${profile.email}`}
                className="hidden min-h-[48px] items-center gap-2 rounded-lg border border-[var(--accent)]/50 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/8 active:bg-[var(--accent)]/15 sm:inline-flex"
              >
                <FiMail size={16} aria-hidden="true" />
                Get in Touch
              </a>
              <ButtonLink
                variant="ghost"
                href={resumeHref}
                download
                aria-label={`Download CV - ${profile.name} resume PDF`}
              >
                <FiDownload size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Download CV</span>
              </ButtonLink>
            </div>

            <div className="lg:hidden">
              <SocialLinks socials={socials} />
            </div>
          </div>

          <div className="hidden flex-col items-end gap-5 lg:flex">
            <div className="flex flex-col items-center gap-5">
              <div className="relative h-80 w-80 overflow-hidden rounded-2xl border border-[var(--border)]/50 shadow-2xl ring-2 ring-[var(--accent)]/10">
                <picture>
                  <source srcSet={avatarWebpHref} type="image/webp" />
                  <img
                    src={avatarHref}
                    alt={`Profile photo of ${profile.name}`}
                    width={320}
                    height={320}
                    className="h-full w-full object-cover"
                    fetchPriority="high"
                  />
                </picture>
              </div>
              <SocialLinks socials={socials} />
            </div>
          </div>
        </div>

        {primaryMetrics.length > 0 && (
          <dl className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {primaryMetrics.map((m) => (
              <div key={m.label} className="card space-y-1 p-4">
                <dt className="text-xs leading-tight text-[var(--muted)]">{m.label}</dt>
                <dd
                  className={`gradient-text font-bold ${m.value.length <= 2 ? "text-4xl" : "text-2xl"}`}
                >
                  {m.value}
                </dd>
                {m.detail && <dd className="text-xs text-[var(--muted-2)]">{m.detail}</dd>}
              </div>
            ))}
          </dl>
        )}

        {secondaryMetrics.length > 0 && (
          <dl className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {secondaryMetrics.map((m) => (
              <div
                key={m.label}
                className="space-y-0.5 rounded-lg border border-[var(--accent)]/30 p-3 transition-[border-color,box-shadow] duration-200 hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)]"
              >
                <dt className="text-xs leading-tight text-[var(--muted)]">{m.label}</dt>
                <dd className="text-base font-semibold text-[var(--accent)]">{m.value}</dd>
                {m.detail && <dd className="text-xs text-[var(--muted-2)]">{m.detail}</dd>}
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
