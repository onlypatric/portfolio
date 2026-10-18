import type { UIProps } from "../_types";
import "../theme.css";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type NavigationLinkProps = UIProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  children?: ReactNode;
  label?: ReactNode;
  state?: "active" | "inactive";
  disabled?: boolean;
};

export function NavigationLink({ children, className, label, state, disabled = false, onClick, ...props }: NavigationLinkProps) {
  const active = state === "active";
  const unavailable = disabled || props["aria-disabled"] === true || props["aria-disabled"] === "true";
  return (
    <a data-ui="NavigationLink"
      {...props}
      href={unavailable ? undefined : props.href}
      role={unavailable ? "link" : props.role}
      aria-disabled={unavailable || undefined}
      tabIndex={unavailable ? -1 : props.tabIndex}
      onClick={(event) => { if (unavailable) { event.preventDefault(); return; } onClick?.(event); }}
      aria-current={active ? "page" : props["aria-current"]}
      data-state={state}
      className={twMerge(
        "inline-flex items-center rounded-[var(--field-radius)] px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-[length:var(--ui-font-size-sm)] font-medium transition-colors hover:bg-[var(--surface-secondary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]",
        active && "bg-[var(--surface-secondary)] text-[var(--foreground)]",
        className,
      )}
    >
      {label ?? children}
    </a>
  );
}
