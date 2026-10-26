import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { gradient } from "./_types";

export type LinearGradientProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "children"> & { colors: string[]; direction?: string };

export function LinearGradient({ className, colors, direction = "to right", style, ...props }: LinearGradientProps) {
  return <div data-ui="LinearGradient" {...props} role={props.role ?? (props["aria-label"] ? "img" : undefined)} aria-hidden={props["aria-label"] ? undefined : true} style={{ background: "linear-gradient(" + direction + ", " + gradient(colors, "transparent") + ")", ...style }} className={twMerge("min-h-16 min-w-32", className)} />;
}
