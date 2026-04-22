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

        <div className="space-y-4">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-[var(--muted)] text-[17px] leading-[1.75] max-w-3xl">
              {para}
            </p>
          ))}
        </div>

        {valueProps.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-2)] mb-5">
              Why Rohit - in 30 seconds
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {valueProps.map((vp) => (
                <div key={vp.audience} className="card p-5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {vp.audience}
                  </p>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{vp.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
