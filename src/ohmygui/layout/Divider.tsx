import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { spacingValue, type LayoutElementProps, type LayoutSpacing } from "./_types";

export type DividerProps = UIProps & LayoutElementProps & {
  decorative?: boolean;
  inset?: LayoutSpacing;
  orientation?: "horizontal" | "vertical";
};

export function Divider({
  className,
  decorative = true,
  inset = "none",
  orientation = "horizontal",
  style,
  ...props
}: DividerProps) {
  const insetValue = spacingValue(inset);
  const isHorizontal = orientation === "horizontal";
  const Component = !decorative && isHorizontal ? "hr" : "div";
  const { ref: _ref, ...restProps } = props;

  return (
    <Component data-ui="Divider"
      {...restProps}
      aria-hidden={decorative ? true : undefined}
      aria-orientation={!isHorizontal ? "vertical" : undefined}
      role={decorative ? undefined : "separator"}
      style={{
        ...(isHorizontal
          ? { marginInline: insetValue, minBlockSize: "1px" }
          : { marginBlock: insetValue, minInlineSize: "1px" }),
        ...style,
      }}
      className={twMerge(
        clsx(
          "shrink-0 border-0 bg-[var(--separator)]",
          isHorizontal ? "h-px w-full" : "h-full w-px",
          className,
        ),
      )}
    />
  );
}
