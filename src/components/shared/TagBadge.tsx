import { tagBadgeClassName, type TagBadgeVariant } from "@/lib/primitive-classes";

export type { TagBadgeVariant };

export interface TagBadgeProps {
  label: string;
  variant?: TagBadgeVariant;
}

export function TagBadge({ label, variant = "neutral" }: TagBadgeProps) {
  return <span className={tagBadgeClassName(variant)}>{label}</span>;
}
