import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { gradient } from "./_types";

export type AngularGradientProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "children"> & { colors: string[]; fromAngle?: number };

export function AngularGradient({ colors, fromAngle = 0, className, style, ...props }: AngularGradientProps) {
  return <div data-ui="AngularGradient" {...props} role={props.role ?? (props["aria-label"] ? "img" : undefined)} aria-hidden={props["aria-label"] ? undefined : true} style={{ background: "conic-gradient(from " + String(fromAngle) + "deg, " + gradient(colors, "transparent") + ")", ...style }} className={twMerge("min-h-16 min-w-32", className)} />;
}
