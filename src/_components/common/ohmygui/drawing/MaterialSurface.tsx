import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { materialAttributes, type MaterialProps } from "../_material";

export type MaterialSurfaceProps = UIProps & MaterialProps & ComponentPropsWithoutRef<"div"> & {
  blur?: string;
  children?: ReactNode;
  opacity?: number;
  variant?: "dark" | "light" | "regular";
};

export function MaterialSurface({ blur = "16px", children, className, material = true, opacity = 0.72, variant = "regular", style, ...props }: MaterialSurfaceProps) {
  const appearance = materialAttributes(material, { blur, opacity, tint: variant === "dark" ? "#181818" : variant === "light" ? "#fff" : "var(--surface)" });
  return <div data-ui="MaterialSurface" {...props} {...appearance} data-variant={variant} style={{ ...appearance.style, ...style }} className={twMerge("ui-material rounded-[var(--radius)] border border-white/10", className)}>{children}</div>;
}
