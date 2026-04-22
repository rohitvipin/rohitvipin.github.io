import type { Profile } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";

export interface AboutProps {
  profile: Profile;
}

export default function About({ profile }: AboutProps) {
  const paragraphs = profile.bio.split("\n\n");
  const valueProps = profile.value_propositions ?? [];

  return (
    <section id="about" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="About" />

        {valueProps.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-2)] mb-5">
              Why Rohit - in 30 seconds
            </h3>
            <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-1 snap-x snap-mandatory md:overflow-visible md:pb-0">
              {valueProps.map((vp) => (
                <div
                  key={vp.audience}
                  className="card p-5 space-y-2 shrink-0 w-72 md:w-auto snap-start"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {vp.audience}
                  </p>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{vp.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[3fr_2fr] gap-24 items-start">
          <div className="space-y-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-[var(--muted)] text-[17px] leading-[1.75]">
                {para}
              </p>
            ))}
          </div>

          {profile.bio_quote && (
            <blockquote className="hidden lg:block border-l border-[var(--border)] pl-5 py-1">
              <p className="text-[var(--muted-2)] text-base font-normal leading-relaxed italic">
                &ldquo;{profile.bio_quote}&rdquo;
              </p>
            </blockquote>
          )}
        </div>
      </div>
    </section>
  );
}
