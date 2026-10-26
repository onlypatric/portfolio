import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type MatchedGeometryEffectProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
  fallback?: "fade" | "none";
  id: string;
  namespace?: string;
};

export function MatchedGeometryEffect({ children, className, fallback = "fade", id, namespace = "default", style, ...props }: MatchedGeometryEffectProps) {
  return <div data-ui="MatchedGeometryEffect" {...props} data-geometry-id={id} data-geometry-namespace={namespace} data-fallback={fallback} style={{ viewTransitionName: namespace + "-" + id, ...style } as React.CSSProperties} className={twMerge(fallback === "fade" && "transition-opacity", className)}>{children}</div>;
}
