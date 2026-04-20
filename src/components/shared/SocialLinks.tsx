import { FaLinkedin, FaGithub, FaXTwitter, FaStackOverflow, FaSlideshare } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import type { Social } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  linkedin: <FaLinkedin size={18} />,
  github: <FaGithub size={18} />,
  twitter: <FaXTwitter size={18} />,
  stackoverflow: <FaStackOverflow size={18} />,
  slideshare: <FaSlideshare size={18} />,
  email: <FiMail size={18} />,
};

export default function SocialLinks({
  socials,
  className = "",
}: {
  socials: Social[];
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socials.map((s) => (
        <a
          key={s.platform}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-200"
        >
          {iconMap[s.icon] ?? <span className="text-xs font-bold">{s.platform[0]}</span>}
        </a>
      ))}
    </div>
  );
}
