import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type ScrollTargetBehaviorProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  align?: "center" | "end" | "start";
  children?: ReactNode;
  snap?: "mandatory" | "proximity" | "none";
};

export function ScrollTargetBehavior({ align = "start", children, className, snap = "proximity", style, ...props }: ScrollTargetBehaviorProps) {
  return <div data-ui="ScrollTargetBehavior" {...props} data-snap-align={align} style={{ scrollSnapType: snap === "none" ? "none" : "x " + snap, ...style }} className={twMerge("flex snap-x gap-[var(--ui-space-3)] overflow-x-auto", className)}>{children}</div>;
}
