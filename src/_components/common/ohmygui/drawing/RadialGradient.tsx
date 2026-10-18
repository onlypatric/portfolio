import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { gradient } from "./_types";

export type RadialGradientProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "children"> & { center?: string; colors: string[]; radius?: string };

export function RadialGradient({ center = "center", className, colors, radius = "farthest-corner", style, ...props }: RadialGradientProps) {
  return <div data-ui="RadialGradient" {...props} role={props.role ?? (props["aria-label"] ? "img" : undefined)} aria-hidden={props["aria-label"] ? undefined : true} style={{ background: "radial-gradient(circle " + radius + " at " + center + ", " + gradient(colors, "transparent") + ")", ...style }} className={twMerge("min-h-16 min-w-32", className)} />;
}
