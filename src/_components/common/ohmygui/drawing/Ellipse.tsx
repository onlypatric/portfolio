import type { UIProps } from "../_types";
import "../theme.css";
import { twMerge } from "tailwind-merge";
import { shapeStyle, type ShapeProps } from "./_types";

export type EllipseProps = UIProps & Omit<ShapeProps, "height" | "width"> & { rx?: number | string; ry?: number | string };

export function Ellipse({ className, fill = "var(--accent)", rx = 80, ry = 48, stroke, strokeWidth, style, ...props }: EllipseProps) {
  return <div data-ui="Ellipse" {...props} role={props.role ?? (props["aria-label"] ? "img" : undefined)} aria-hidden={props["aria-label"] ? undefined : true} style={{ ...shapeStyle({ fill, height: ry, stroke, strokeWidth, width: rx }), borderRadius: "50%", ...style }} className={twMerge("shrink-0", className)} />;
}
