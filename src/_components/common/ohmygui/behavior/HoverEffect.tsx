import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type HoverEffectProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
  duration?: number;
  variant?: "lift" | "glow" | "scale";
};

export function HoverEffect({ children, className, duration = 150, variant = "lift", style, ...props }: HoverEffectProps) {
  const effect = variant === "lift" ? "hover:-translate-y-1 focus-within:-translate-y-1" : variant === "scale" ? "hover:scale-[1.02] focus-within:scale-[1.02]" : "hover:shadow-[0_0_24px_var(--accent)] focus-within:shadow-[0_0_24px_var(--accent)]";
  return <div data-ui="HoverEffect" {...props} data-variant={variant} style={{ transitionDuration: String(duration) + "ms", ...style }} className={twMerge("transition-transform motion-reduce:transition-none", effect, className)}>{children}</div>;
}
