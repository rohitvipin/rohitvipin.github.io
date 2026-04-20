import type { CommunityEntry } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";
import CommunityCard from "./CommunityCard";
import { FiUsers, FiCode, FiMic, FiStar, FiBookOpen } from "react-icons/fi";

const iconMap: Record<string, React.ReactNode> = {
  "Community Leadership": <FiUsers size={18} />,
  "Open Source": <FiCode size={18} />,
  "Conference Speaking": <FiMic size={18} />,
  "Technical Community": <FiStar size={18} />,
  Mentorship: <FiBookOpen size={18} />,
};

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
            <CommunityCard
              key={c.title}
              entry={c}
              icon={iconMap[c.type] ?? <FiUsers size={18} />}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
