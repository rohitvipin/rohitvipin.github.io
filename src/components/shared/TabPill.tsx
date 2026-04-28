import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

export interface TabPillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  active: boolean;
  children: ReactNode;
  buttonRef?: Ref<HTMLButtonElement>;
}

const BASE =
  "flex min-h-[48px] items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150 active:scale-[0.97]";

export function tabPillClassName(active: boolean): string {
  return `${BASE} ${
    active ? "bg-[var(--accent)] text-[var(--bg)]" : "text-[var(--muted)] hover:text-[var(--text)]"
  }`;
}

export function TabPill({ active, children, buttonRef, ...rest }: TabPillProps) {
  return (
    <button ref={buttonRef} role="tab" className={tabPillClassName(active)} {...rest}>
      {children}
    </button>
  );
}
