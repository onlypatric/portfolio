import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import {
  alignmentClassMap,
  justifyClassMap,
  mergeStyle,
  spacingClass,
  spacingValue,
  type LayoutElementProps,
  type LayoutSpacing,
} from "./_types";

export type HStackProps = UIProps & LayoutElementProps & {
  align?: keyof typeof alignmentClassMap;
  gap?: LayoutSpacing;
  justify?: keyof typeof justifyClassMap;
  spacing?: LayoutSpacing;
  wrap?: boolean;
};

export function HStack({
  children,
  className,
  align = "top",
  gap,
  justify = "default",
  spacing,
  wrap = false,
  as,
  style,
  ...props
}: HStackProps) {
  const resolvedGap = gap ?? spacing ?? "none";
  const gapClass = spacingClass(resolvedGap);
  const customGap = gapClass ? undefined : spacingValue(resolvedGap);
  const Component = as ?? "div";

  return (
    <Component data-ui="HStack"
      {...props}
      style={mergeStyle(style, { gap: customGap })}
      className={twMerge(
        clsx(
          "flex min-w-0 flex-row",
          alignmentClassMap[align],
          justifyClassMap[justify],
          gapClass,
          wrap && "flex-wrap",
          className,
        ),
      )}
    >
      {children}
    </Component>
  );
}
