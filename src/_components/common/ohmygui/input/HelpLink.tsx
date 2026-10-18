import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type HelpLinkProps = UIProps & ComponentPropsWithRef<"a"> & { label?: ReactNode };
export function HelpLink({ children, className, label = "Learn more", target, rel, onClick, onKeyDown, ...props }: HelpLinkProps) {
  const disabled = props["aria-disabled"] === true || props["aria-disabled"] === "true";
  const safeRel = target === "_blank" ? [...new Set([...(rel?.split(/\s+/) ?? []), "noopener", "noreferrer"].filter(Boolean))].join(" ") : rel;
  return <a {...props} data-ui="HelpLink" href={disabled ? undefined : props.href} role={props.role ?? (disabled ? "link" : undefined)} tabIndex={disabled ? -1 : props.tabIndex} target={target} rel={safeRel}
    onClick={event => { if (disabled) { event.preventDefault(); return; } onClick?.(event); }}
    onKeyDown={event => { if (disabled && ["Enter", " "].includes(event.key)) { event.preventDefault(); return; } onKeyDown?.(event); }}
    className={twMerge("ui-help-link", className)}>{children ?? label}{target === "_blank" && !disabled && <span className="sr-only"> (opens in a new tab)</span>}</a>;
}
