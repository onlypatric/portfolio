import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { mergeStyle, type LayoutElementProps } from "./_types";

export type GridRowProps = UIProps & LayoutElementProps & {
  align?: "start" | "center" | "end" | "stretch";
  span?: number | "full";
};

export function GridRow({
  children,
  align = "stretch",
  className,
  span = "full",
  style,
  as,
  ...props
}: GridRowProps) {
  const Component = as ?? "div";
  const gridColumn = span === "full" ? "1 / -1" : `span ${span}`;

  return (
    <Component data-ui="GridRow"
      {...props}
      style={mergeStyle(style, {
        gridColumn,
        gridTemplateColumns: "subgrid",
      })}
      className={twMerge(
        clsx(
          "grid min-w-0",
          align === "start" && "items-start",
          align === "center" && "items-center",
          align === "end" && "items-end",
          align === "stretch" && "items-stretch",
          className,
        ),
      )}
    >
      {children}
    </Component>
  );
}
