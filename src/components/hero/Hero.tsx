import Image from "next/image";
import type { Profile, Social } from "@/types";
import SocialLinks from "@/components/shared/SocialLinks";

export default function Hero({ profile, socials }: { profile: Profile; socials: Social[] }) {
  return (
    <section className="min-h-screen flex items-center pt-14">
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center">
          {/* Left */}
          <div className="space-y-6">
            {profile.availability_status === "open" && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10 text-xs font-medium text-[var(--success)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                Open to Opportunities
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text)] text-sm font-medium hover:border-[var(--accent)] transition-colors"
              >
                Download Resume
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
