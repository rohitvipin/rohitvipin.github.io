import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { buttonClassName, type ButtonVariant } from "@/lib/primitive-classes";

export type { ButtonVariant };
export { buttonClassName };

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
