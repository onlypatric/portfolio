import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type ScrollIndicatorsProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
  gutter?: "always" | "auto";
  visible?: boolean;
};

export function ScrollIndicators({ children, className, gutter = "auto", style, visible = true, ...props }: ScrollIndicatorsProps) {
  return <div data-ui="ScrollIndicators" {...props} data-scroll-indicators={visible ? "visible" : "minimal"} style={{ scrollbarGutter: gutter === "always" ? "stable" : "auto", scrollbarWidth: visible ? "auto" : "thin", ...style }} className={twMerge("overflow-auto", className)}>{children}</div>;
}
