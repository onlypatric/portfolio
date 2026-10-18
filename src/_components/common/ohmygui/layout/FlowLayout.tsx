import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import {
  alignmentClassMap,
  mergeStyle,
  spacingClass,
  spacingValue,
  type LayoutElementProps,
  type LayoutSpacing,
} from "./_types";

export type FlowLayoutProps = UIProps & LayoutElementProps & {
  align?: "start" | "center" | "end" | "stretch";
  gap?: LayoutSpacing;
};

export function FlowLayout({
  children,
  align = "start",
  className,
  gap = "sm",
  style,
  as,
  ...props
}: FlowLayoutProps) {
  const Component = as ?? "div";
  const gapClass = spacingClass(gap);

  return (
    <Component data-ui="FlowLayout"
      {...props}
      style={mergeStyle(style, { gap: gapClass ? undefined : spacingValue(gap) })}
      className={twMerge(
        clsx(
          "flex min-w-0 flex-wrap",
          alignmentClassMap[align],
          gapClass,
          className,
        ),
      )}
    >
      {children}
    </Component>
  );
}
