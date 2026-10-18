import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type ToolbarItemProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
  placement?: "leading" | "primary" | "trailing";
  priority?: "high" | "low" | "standard";
};

export function ToolbarItem({ children, className, placement = "primary", priority = "standard", ...props }: ToolbarItemProps) {
  return <div data-ui="ToolbarItem" {...props} data-placement={placement} data-priority={priority} className={twMerge("inline-flex min-w-0 flex-wrap items-center gap-[var(--ui-space-2)]", className)}>{children}</div>;
}
