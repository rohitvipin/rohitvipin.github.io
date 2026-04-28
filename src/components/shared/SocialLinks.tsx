import { FaLinkedin, FaGithub, FaXTwitter, FaStackOverflow } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import type { Social } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  linkedin: <FaLinkedin size={18} aria-hidden="true" />,
  github: <FaGithub size={18} aria-hidden="true" />,
  twitter: <FaXTwitter size={18} aria-hidden="true" />,
  stackoverflow: <FaStackOverflow size={18} aria-hidden="true" />,
  email: <FiMail size={18} aria-hidden="true" />,
};

export interface SocialLinksProps {
  socials: Social[];
  className?: string;
}

export function SocialLinks({ socials, className = "" }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socials.map((s) => {
        const isEmail = s.url.startsWith("mailto:");
        const label = isEmail
          ? "Send me an email"
          : `Visit my ${s.platform.charAt(0).toUpperCase() + s.platform.slice(1)} profile`;
        return (
          <a
            key={s.platform}
            href={s.url}
            {...(!isEmail && { target: "_blank", rel: "noopener noreferrer" })}
            aria-label={label}
            className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {iconMap[s.icon] ?? <span className="text-xs font-bold">{s.platform[0]}</span>}
          </a>
        );
      })}
    </div>
  );
}
