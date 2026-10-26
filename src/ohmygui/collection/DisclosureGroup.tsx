import "../theme.css";
import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
export type DisclosureGroupProps = UIProps & Omit<ComponentPropsWithoutRef<"details">, "open" | "onToggle" | "title"> & {
  disabled?: boolean; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; title: ReactNode;
  classNames?: Partial<Record<"summary" | "content", string>>;
};
export function DisclosureGroup({ children, className, classNames = {}, defaultOpen = false, disabled = false, onOpenChange, open, title, ...props }: DisclosureGroupProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const current = open ?? internalOpen;
  return <details {...props} data-ui="DisclosureGroup" open={current} aria-disabled={disabled || undefined}
    onToggle={(event) => { if (open === undefined && !disabled) { setInternalOpen(event.currentTarget.open); onOpenChange?.(event.currentTarget.open); } }}
    className={twMerge("rounded-[var(--field-radius)] border border-[var(--border)]", disabled && "opacity-50", className)}>
    <summary data-slot="summary" aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined} onClick={(event) => { if (disabled || open !== undefined) { event.preventDefault(); if (!disabled) onOpenChange?.(!current); } }} className={twMerge("cursor-pointer font-medium", classNames.summary)}>{title}</summary>
    <div data-slot="content" className={classNames.content}>{children}</div>
  </details>;
}
