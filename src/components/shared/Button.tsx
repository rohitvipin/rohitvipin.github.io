import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 active:opacity-75",
  secondary:
    "inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[var(--accent)]/50 px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/8 active:bg-[var(--accent)]/15",
  ghost:
    "inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] active:opacity-75",
};

export function buttonClassName(variant: ButtonVariant, extra?: string): string {
  return extra ? `${VARIANT_CLASSES[variant]} ${extra}` : VARIANT_CLASSES[variant];
}

type ButtonOwnProps = {
  variant: ButtonVariant;
  children: ReactNode;
  className?: string;
};

export type ButtonLinkProps = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    href: string;
  };

export type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function ButtonLink({ variant, children, className, href, ...rest }: ButtonLinkProps) {
  return (
    <a href={href} className={buttonClassName(variant, className)} {...rest}>
      {children}
    </a>
  );
}

export function Button({ variant, children, className, ...rest }: ButtonProps) {
  return (
    <button className={buttonClassName(variant, className)} {...rest}>
      {children}
    </button>
  );
}
