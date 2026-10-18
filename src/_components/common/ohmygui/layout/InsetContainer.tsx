import type { UIProps } from "../_types";
import "../theme.css";
import { twMerge } from "tailwind-merge";
import { cssSize, spacingValue, type LayoutElementProps, type LayoutSize, type LayoutSpacing } from "./_types";

export type InsetContainerProps = UIProps & LayoutElementProps & {
  maxWidth?: LayoutSize;
  padding?: LayoutSpacing;
  safeArea?: boolean;
};

export function InsetContainer({
  children,
  className,
  maxWidth = "72rem",
  padding = "md",
  safeArea = false,
  style,
  as,
  ...props
}: InsetContainerProps) {
  const Component = as ?? "div";
  const paddingValue = spacingValue(padding) ?? "0px";
  const horizontalPadding = safeArea
    ? `calc(${paddingValue} + env(safe-area-inset-left))`
    : paddingValue;
  const horizontalPaddingEnd = safeArea
    ? `calc(${paddingValue} + env(safe-area-inset-right))`
    : paddingValue;

  return (
    <Component data-ui="InsetContainer"
      {...props}
      style={{
        maxInlineSize: cssSize(maxWidth),
        paddingInlineStart: horizontalPadding,
        paddingInlineEnd: horizontalPaddingEnd,
        ...style,
      }}
      className={twMerge("mx-auto w-full min-w-0", className)}
    >
      {children}
    </Component>
  );
}
