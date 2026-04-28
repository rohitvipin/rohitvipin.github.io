import { TAG_BADGE_CLASSES } from "@/lib/primitive-classes";

export interface TagBadgeProps {
  label: string;
}

export function TagBadge({ label }: TagBadgeProps) {
  return <span className={TAG_BADGE_CLASSES}>{label}</span>;
}
