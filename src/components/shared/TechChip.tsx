import { TECH_CHIP_CLASSES } from "@/lib/primitive-classes";

export interface TechChipProps {
  label: string;
}

export function TechChip({ label }: TechChipProps) {
  return <span className={TECH_CHIP_CLASSES}>{label}</span>;
}
