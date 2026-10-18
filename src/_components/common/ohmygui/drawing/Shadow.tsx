import "../theme.css";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { UIProps } from "../_types";

export type ShadowProps = UIProps & ComponentPropsWithoutRef<"div"> & { children?: ReactNode; color?: string; level?: "sm" | "md" | "lg" | "xl" | "2xl" };
export function Shadow({ children, color, level = "md", style, ...props }: ShadowProps) {
  return <div {...props} data-ui="Shadow" data-level={level} style={{ ...(color ? { "--ui-shadow-color": color } : {}), boxShadow: color ? "var(--ui-shadow-geometry-" + level + ") color-mix(in srgb, " + color + " 22%, transparent)" : "var(--ui-shadow-" + level + ")", ...style }}>{children}</div>;
}
