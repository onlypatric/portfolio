import "../theme.css";
import { type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps, UIStyle } from "../_types";

const colors = { default: "var(--default-foreground)", accent: "var(--accent)", success: "var(--success)", warning: "var(--warning)", danger: "var(--danger)" };
export type BadgeProps = UIProps & ComponentPropsWithRef<"span"> & {
  children?: ReactNode; count?: number; maxCount?: number; variant?: keyof typeof colors;
  tone?: "solid" | "soft" | "outline"; size?: "sm" | "md" | "lg";
};
export function Badge({ children, className, count, maxCount, size = "md", style, tone = "solid", variant = "default", ...props }: BadgeProps) {
  const countLabel = count === undefined ? undefined : maxCount !== undefined && count > maxCount ? String(maxCount) + "+" : count;
  return <span {...props} data-ui="Badge" data-tone={tone} data-size={size} data-variant={variant}
    style={{ "--ui-badge-color": colors[variant], "--ui-badge-background": "var(--" + (variant === "default" ? "default" : variant) + ")", "--ui-badge-foreground": "var(--" + (variant === "default" ? "default" : variant) + "-foreground)", ...style } as UIStyle}
    className={twMerge("ui-badge", className)}>{countLabel ?? children}</span>;
}
