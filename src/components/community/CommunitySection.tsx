import type { CommunityEntry } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";
import CommunityCard from "./CommunityCard";

export interface CommunitySectionProps {
  community: CommunityEntry[];
}

export default function CommunitySection({ community }: CommunitySectionProps) {
  return (
    <section id="community" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="Community & Contributions" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {community.map((c) => (
            <CommunityCard key={c.title} entry={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
