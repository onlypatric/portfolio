import type { UIProps } from "../_types";
import "../theme.css";
import { twMerge } from "tailwind-merge";
import { shapeStyle, type ShapeProps } from "./_types";

export type RoundedRectangleProps = UIProps & ShapeProps & { radius?: number | string };

export function RoundedRectangle({ className, fill = "var(--accent)", height = "100%", radius = "var(--radius)", stroke, strokeWidth, style, width = "100%", ...props }: RoundedRectangleProps) {
  return <div data-ui="RoundedRectangle" {...props} role={props.role ?? (props["aria-label"] ? "img" : undefined)} aria-hidden={props["aria-label"] ? undefined : true} style={{ ...shapeStyle({ fill, height, stroke, strokeWidth, width }), borderRadius: radius, ...style }} className={twMerge("min-h-[var(--ui-control-height-sm)] min-w-8", className)} />;
}
