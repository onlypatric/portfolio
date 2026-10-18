import type { UIProps } from "../_types";
import "../theme.css";
import { twMerge } from "tailwind-merge";
import { shapeStyle, type ShapeProps } from "./_types";

export type RectangleProps = UIProps & ShapeProps;

export function Rectangle({ className, fill = "var(--accent)", height = "100%", stroke, strokeWidth, width = "100%", style, ...props }: RectangleProps) {
  return <div data-ui="Rectangle" {...props} role={props.role ?? (props["aria-label"] ? "img" : undefined)} aria-hidden={props["aria-label"] ? undefined : true} style={{ ...shapeStyle({ fill, height, stroke, strokeWidth, width }), ...style }} className={twMerge("min-h-[var(--ui-control-height-sm)] min-w-8", className)} />;
}
