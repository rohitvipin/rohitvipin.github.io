import type { CommunityEntry } from "@/types";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CommunityCard } from "./CommunityCard";

export interface CommunitySectionProps {
  community: CommunityEntry[];
}

export function CommunitySection({ community }: CommunitySectionProps) {
  return (
    <section id="community" aria-labelledby="community-heading" className="section">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader title="Community & Contributions" headingId="community-heading" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {community.map((c) => (
            <CommunityCard key={c.title} entry={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
