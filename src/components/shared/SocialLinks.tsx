import { FaLinkedin, FaGithub, FaXTwitter, FaStackOverflow, FaSlideshare } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import type { Social } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  linkedin: <FaLinkedin size={18} aria-hidden="true" />,
  github: <FaGithub size={18} aria-hidden="true" />,
  twitter: <FaXTwitter size={18} aria-hidden="true" />,
  stackoverflow: <FaStackOverflow size={18} aria-hidden="true" />,
  slideshare: <FaSlideshare size={18} aria-hidden="true" />,
  email: <FiMail size={18} aria-hidden="true" />,
};

export interface SocialLinksProps {
  socials: Social[];
  className?: string;
}

export default function SocialLinks({ socials, className = "" }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socials.map((s) => (
        <a
          key={s.platform}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}
          className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-200"
        >
          {iconMap[s.icon] ?? <span className="text-xs font-bold">{s.platform[0]}</span>}
        </a>
      ))}
    </div>
  );
}
