import type { CommunityEntry } from "@/types";
import SectionHeader from "@/components/shared/SectionHeader";
import { FiUsers, FiCode, FiMic, FiStar, FiBookOpen } from "react-icons/fi";

const iconMap: Record<string, React.ReactNode> = {
  "Community Leadership": <FiUsers size={18} />,
  "Open Source": <FiCode size={18} />,
  "Conference Speaking": <FiMic size={18} />,
  "Technical Community": <FiStar size={18} />,
  Mentorship: <FiBookOpen size={18} />,
};

export default function CommunitySection({ community }: { community: CommunityEntry[] }) {
  return (
    <section id="community" className="section">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title="Community & Contributions" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {community.map((c) => (
            <div key={c.title} className="card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-glow)] flex items-center justify-center text-[var(--accent)] shrink-0">
                  {iconMap[c.type] ?? <FiUsers size={18} />}
                </div>
                <p className="text-xs font-medium text-[var(--accent)] uppercase tracking-wider">
                  {c.type}
                </p>
              </div>
              <h3 className="font-semibold text-sm text-[var(--text)] leading-snug">{c.title}</h3>
              {c.location && <p className="text-xs text-[var(--muted-2)]">{c.location}</p>}
              <p className="text-xs text-[var(--muted)] leading-relaxed">{c.description}</p>
              <ul className="space-y-1">
                {c.highlights.map((h) => (
                  <li key={h} className="text-xs text-[var(--muted)] flex items-start gap-2">
                    <span className="text-[var(--accent)] mt-0.5">·</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
