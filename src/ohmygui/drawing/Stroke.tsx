import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type StrokeProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  cap?: "butt" | "round" | "square";
  children?: ReactNode;
  dash?: string;
  width?: number;
};

export function Stroke({ cap = "round", children, className, dash, style, width = 1, ...props }: StrokeProps) {
  return <div data-ui="Stroke" {...props} data-cap={cap} data-dash={dash} style={{ borderWidth: width, borderStyle: dash ? "dashed" : "solid", ...style }} className={twMerge("border-[var(--foreground)]", className)}>{children}</div>;
}
