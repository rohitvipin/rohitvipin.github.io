import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { iconButtonClassName, type IconButtonVariant } from "@/lib/primitive-classes";

export type { IconButtonVariant };

type IconButtonOwnProps = {
  variant: IconButtonVariant;
  children: ReactNode;
  className?: string;
};

export type IconButtonLinkProps = IconButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    href: string;
  };

export type IconButtonProps = IconButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    buttonRef?: Ref<HTMLButtonElement>;
  };

export function IconButtonLink({
  variant,
  children,
  className,
  href,
  ...rest
}: IconButtonLinkProps) {
  return (
    <a href={href} className={iconButtonClassName(variant, className)} {...rest}>
      {children}
    </a>
  );
}

export function IconButton({ variant, children, className, buttonRef, ...rest }: IconButtonProps) {
  return (
    <button ref={buttonRef} className={iconButtonClassName(variant, className)} {...rest}>
      {children}
    </button>
  );
}
