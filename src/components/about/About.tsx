import type { Profile } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";

export interface AboutProps {
  profile: Profile;
}

export function About({ profile }: AboutProps) {
  const paragraphs = profile.bio.split("\n\n");
  const valueProps = profile.value_propositions ?? [];

  return (
    <section id="about" aria-labelledby="about-heading" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title="About" headingId="about-heading" />

        {valueProps.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {valueProps.map((vp) => (
                <div key={vp.audience} className="card space-y-2 p-5">
                  <p className="text-xs font-semibold tracking-wider text-[var(--accent)] uppercase">
                    {vp.audience}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{vp.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid items-start gap-24 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-[17px] leading-[1.75] text-[var(--muted)]">
                {para}
              </p>
            ))}
          </div>

          {profile.bio_quote && (
            <blockquote className="hidden border-l border-[var(--border)] py-1 pl-5 lg:block">
              <p className="text-base leading-relaxed font-normal text-[var(--muted-2)] italic">
                &ldquo;{profile.bio_quote}&rdquo;
              </p>
            </blockquote>
          )}
        </div>
      </div>
    </section>
  );
}
