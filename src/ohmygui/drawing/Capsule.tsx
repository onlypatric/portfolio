import type { UIProps } from "../_types";
import "../theme.css";
import { twMerge } from "tailwind-merge";
import { shapeStyle, type ShapeProps } from "./_types";

export type CapsuleProps = UIProps & ShapeProps;

export function Capsule({ className, fill = "var(--accent)", height = 40, stroke, strokeWidth, style, width = 160, ...props }: CapsuleProps) {
  return <div data-ui="Capsule" {...props} role={props.role ?? (props["aria-label"] ? "img" : undefined)} aria-hidden={props["aria-label"] ? undefined : true} style={{ ...shapeStyle({ fill, height, stroke, strokeWidth, width }), borderRadius: "9999px", ...style }} className={twMerge("shrink-0", className)} />;
}
