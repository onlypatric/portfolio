import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { cssSize, type LayoutElementProps, type LayoutSize } from "./_types";

export type SpacerProps = UIProps & LayoutElementProps & {
  axis?: "horizontal" | "vertical" | "both";
  minSize?: LayoutSize;
};

export function Spacer({
  axis = "both",
  className,
  minSize,
  as,
  style,
  ...props
}: SpacerProps) {
  const Component = as ?? "div";
  const minSizeValue = cssSize(minSize);

  return (
    <Component data-ui="Spacer"
      {...props}
      aria-hidden={props["aria-hidden"] ?? true}
      style={{
        ...(axis === "horizontal" || axis === "both"
          ? { minInlineSize: minSizeValue }
          : {}),
        ...(axis === "vertical" || axis === "both"
          ? { minBlockSize: minSizeValue }
          : {}),
        ...style,
      }}
      className={twMerge(clsx("flex-1", className))}
    />
  );
}
