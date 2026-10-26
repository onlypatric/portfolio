import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { materialAttributes } from "../_material";
import { Surface, type SurfaceProps } from "./Surface";

export type MaterialSurfaceProps = SurfaceProps & { blur?: string; children?: ReactNode; opacity?: number; variant?: "dark" | "light" | "regular" };
/** Legacy material facade, sharing the visual owner while retaining its original defaults. */
export function MaterialSurface({ blur = "16px", children, className, material = true, opacity = 0.72, variant = "regular", padding = "none", radius = "md", style, ...props }: MaterialSurfaceProps) {
  const appearance = materialAttributes(material, { blur, opacity, tint: variant === "dark" ? "#181818" : variant === "light" ? "#fff" : "var(--surface)" });
  return <Surface {...props} data-ui="MaterialSurface" {...appearance} data-variant={variant} material={false} padding={padding} radius={radius} className={twMerge("ui-material border-white/10", className)} style={{ ...appearance.style, ...style }}>{children}</Surface>;
}
