import type { UIProps } from "../_types";
import "../theme.css";
import { twMerge } from "tailwind-merge";
import { shapeStyle, type ShapeProps } from "./_types";

export type CircleProps = UIProps & Omit<ShapeProps, "height" | "width"> & { diameter?: number | string };

export function Circle({ className, diameter = 64, fill = "var(--accent)", stroke, strokeWidth, style, ...props }: CircleProps) {
  return <div data-ui="Circle" {...props} role={props.role ?? (props["aria-label"] ? "img" : undefined)} aria-hidden={props["aria-label"] ? undefined : true} style={{ ...shapeStyle({ fill, height: diameter, stroke, strokeWidth, width: diameter }), borderRadius: "50%", ...style }} className={twMerge("shrink-0", className)} />;
}
