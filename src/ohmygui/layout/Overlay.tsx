import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps, UIStyle } from "../_types";
import "../theme.css";

export type OverlayProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  overlay: ReactNode;
  align?: "start" | "center" | "end" | "stretch";
  interactive?: boolean;
  /** Applies only to the noninteractive, aria-hidden decorative layer. */
  decorativeBlur?: string;
};

export function Overlay({ children, overlay, align = "center", interactive = false, decorativeBlur, className, ...props }: OverlayProps) {
  return <div {...props} data-ui="Overlay" className={twMerge("relative isolate", className)}>
    {children}
    <div data-slot="overlay" aria-hidden={!interactive || undefined} inert={!interactive || undefined}
      className={twMerge("absolute inset-0 grid", align === "stretch" ? "place-items-stretch" : align === "start" ? "place-items-start" : align === "end" ? "place-items-end" : "place-items-center", !interactive && "pointer-events-none overflow-hidden")}>
      <div data-slot="decoration" className={!interactive && decorativeBlur ? "ui-decorative-blur" : undefined}
        style={{ "--ui-content-blur": decorativeBlur } as UIStyle}>{overlay}</div>
    </div>
  </div>;
}
