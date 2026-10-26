import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { type ComponentPropsWithRef, type ElementType } from "react";

export type AspectRatioProps = UIProps & ComponentPropsWithRef<"div"> & {
  contentMode?: "fit" | "fill";
  ratio?: number | string;
  as?: ElementType;
};

export function AspectRatio({
  children,
  className,
  contentMode = "fit",
  ratio = 1,
  style,
  as,
  ...props
}: AspectRatioProps) {
  const Component = as ?? "div";

  return (
    <Component data-ui="AspectRatio"
      {...props}
      style={{ aspectRatio: ratio, ...style }}
      className={twMerge(
        clsx(
          "relative min-w-0",
          contentMode === "fill" &&
            "overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:h-full [&>video]:w-full [&>video]:object-cover",
          contentMode === "fit" &&
            "[&>img]:h-full [&>img]:w-full [&>img]:object-contain [&>video]:h-full [&>video]:w-full [&>video]:object-contain",
          className,
        ),
      )}
    >
      {children}
    </Component>
  );
}
