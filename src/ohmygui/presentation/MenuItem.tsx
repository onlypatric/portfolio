import { Button } from "../control/button/Button";
import "../theme.css";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";

export type MenuItemProps = UIProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  destructive?: boolean;
  href?: string;
  label?: ReactNode;
  shortcut?: string;
};

export function MenuItem({ children, className, destructive = false, href, label, onClick, shortcut, ...props }: MenuItemProps) {
  const content = <><span data-slot="label">{label ?? children}</span>{shortcut && <kbd data-slot="shortcut" className="ms-auto text-[length:var(--ui-font-size-xs)] text-[var(--muted)]">{shortcut}</kbd>}</>;
  const classes = twMerge("flex w-full items-center gap-[var(--ui-space-3)] rounded-[var(--ui-radius-sm)] px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-start text-[length:var(--ui-font-size-sm)] hover:bg-[var(--ui-hover)] disabled:opacity-50", className);
  return href
    ? <a {...(props as unknown as AnchorHTMLAttributes<HTMLAnchorElement>)} href={href} data-ui="MenuItem" data-destructive={destructive} aria-disabled={props.disabled || undefined} tabIndex={props.disabled ? -1 : props.tabIndex} onClick={props.disabled ? (event) => event.preventDefault() : onClick as unknown as MouseEventHandler<HTMLAnchorElement>} className={classes}>{content}</a>
    : <Button variant="unstyled" {...props} type={props.type ?? "button"} data-ui="MenuItem" data-destructive={destructive} onClick={onClick} className={classes}>{content}</Button>;
}
