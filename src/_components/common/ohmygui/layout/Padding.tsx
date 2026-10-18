import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

const paddingMap = {
  xs: "p-[var(--ui-space-1)]",
  sm: "p-[var(--ui-space-2)]",
  md: "p-[var(--ui-space-4)]",
  lg: "p-[var(--ui-space-6)]",
  xl: "p-[var(--ui-space-8)]",
} as const;

export type PaddingProps = UIProps & ComponentPropsWithRef<"div"> & {
  padding?: keyof typeof paddingMap;
};

export function Padding({
  children,
  className,
  padding = "md",
  ...props
}: PaddingProps) {
  return (
    <div data-ui="Padding"
      {...props}
      className={twMerge(clsx(paddingMap[padding], className))}
    >
      {children}
    </div>
  );
}
