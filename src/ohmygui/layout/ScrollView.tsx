import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { cssSize, mergeStyle, type LayoutElementProps, type LayoutSize } from "./_types";

export type ScrollAxis = "vertical" | "horizontal" | "both";

export type ScrollViewProps = UIProps & LayoutElementProps & {
  axis?: ScrollAxis;
  fill?: boolean;
  maxHeight?: LayoutSize;
  maxWidth?: LayoutSize;
  overflow?: "auto" | "scroll" | "hidden" | "clip";
  snap?: false | "mandatory" | "proximity";
};

export function ScrollView({
  axis = "vertical",
  fill = false,
  children,
  className,
  maxHeight,
  maxWidth,
  overflow = "auto",
  snap = false,
  style,
  tabIndex,
  ...props
}: ScrollViewProps) {
  const overflowX = axis === "vertical" ? "hidden" : overflow;
  const overflowY = axis === "horizontal" ? "hidden" : overflow;
  const scrollSnapType = snap
    ? `${axis === "both" ? "both" : axis} ${snap}`
    : undefined;

  return (
    <div data-ui="ScrollView"
      {...props}
      tabIndex={tabIndex ?? 0}
      style={mergeStyle(style, {
        maxBlockSize: cssSize(maxHeight),
        maxInlineSize: cssSize(maxWidth),
        overflowX,
        overflowY,
        scrollSnapType,
      })}
      className={twMerge(
        clsx(
          fill && "min-h-0 flex-1",
          "min-w-0 overscroll-contain focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
          className,
        ),
      )}
    >
      {children}
    </div>
  );
}
