import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type MaskProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
  mode?: "clip" | "mask";
  shape?: "circle" | "ellipse" | "rounded";
};

export function Mask({ children, className, mode = "clip", shape = "rounded", style, ...props }: MaskProps) {
  const clipPath = shape === "circle" ? "circle(50% at 50% 50%)" : shape === "ellipse" ? "ellipse(50% 50% at 50% 50%)" : "inset(0 round var(--radius))";
  return <div data-ui="Mask" {...props} data-mode={mode} style={{ clipPath, maskImage: mode === "mask" ? "radial-gradient(white, white)" : undefined, ...style }} className={twMerge("overflow-hidden", className)}>{children}</div>;
}
