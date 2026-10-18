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

export type VStackProps = UIProps & LayoutElementProps & {
  align?: keyof typeof alignmentClassMap;
  gap?: LayoutSpacing;
  justify?: keyof typeof justifyClassMap;
  spacing?: LayoutSpacing;
};

export function VStack({
  children,
  className,
  align = "left",
  gap,
  justify = "default",
  spacing,
  as,
  style,
  ...props
}: VStackProps) {
  const resolvedGap = gap ?? spacing ?? "none";
  const gapClass = spacingClass(resolvedGap);
  const customGap = gapClass ? undefined : spacingValue(resolvedGap);
  const Component = as ?? "div";

  return (
    <Component data-ui="VStack"
      {...props}
      style={mergeStyle(style, { gap: customGap })}
      className={twMerge(
        clsx(
          "flex min-w-0 flex-col",
          alignmentClassMap[align],
          justifyClassMap[justify],
          gapClass,
          className,
        ),
      )}
    >
      {children}
    </Component>
  );
}
