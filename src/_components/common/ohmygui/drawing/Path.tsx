import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export type PathProps = UIProps & Omit<ComponentPropsWithoutRef<"svg">, "children"> & {
  d: string;
  fill?: string;
  stroke?: string;
  viewBox?: string;
};

export function Path({ className, d, fill = "none", stroke = "currentColor", viewBox = "0 0 100 100", ...props }: PathProps) {
  return <svg data-ui="Path" {...props} viewBox={viewBox} role={props["aria-label"] ? "img" : undefined} aria-hidden={props["aria-label"] ? undefined : true} className={twMerge("h-24 w-24", className)}><path d={d} fill={fill} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
