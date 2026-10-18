import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type OverlayHostProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
  scope?: string;
  stackPolicy?: "last-in-front" | "single";
};

export function OverlayHost({ children, className, scope = "default", stackPolicy = "last-in-front", ...props }: OverlayHostProps) {
  return <div data-ui="OverlayHost" {...props} data-overlay-scope={scope} data-stack-policy={stackPolicy} className={twMerge("pointer-events-none fixed inset-0 z-40 flex flex-col items-end gap-[var(--ui-space-3)] p-[var(--ui-space-4)] [&>*]:pointer-events-auto", className)}>{children}</div>;
}
