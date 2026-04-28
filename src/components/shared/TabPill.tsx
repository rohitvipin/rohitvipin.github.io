import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { tabPillClassName } from "@/lib/primitive-classes";

export { tabPillClassName };

export interface TabPillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  active: boolean;
  children: ReactNode;
  buttonRef?: Ref<HTMLButtonElement>;
}

export function TabPill({ active, children, buttonRef, ...rest }: TabPillProps) {
  return (
    <button ref={buttonRef} role="tab" className={tabPillClassName(active)} {...rest}>
      {children}
    </button>
  );
}
