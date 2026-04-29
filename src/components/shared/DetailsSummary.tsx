import type { ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";
import { detailsSummaryClassName, type DetailsSummaryTone } from "@/lib/primitive-classes";

export type { DetailsSummaryTone };

export interface DetailsSummaryProps {
  tone: DetailsSummaryTone;
  children: ReactNode;
  chevronSize?: number;
  "aria-label"?: string;
}

export function DetailsSummary({ tone, children, chevronSize = 12, ...rest }: DetailsSummaryProps) {
  return (
    <summary className={detailsSummaryClassName(tone)} {...rest}>
      <FiChevronDown size={chevronSize} aria-hidden="true" className="card-details-chevron" />
      {children}
    </summary>
  );
}
