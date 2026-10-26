import type { UIProps } from "../_types";
import "../theme.css";
import "../theme/design-system.css";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import {
  cssSize,
  mergeStyle,
  spacingClass,
  spacingValue,
  type LayoutElementProps,
  type LayoutSize,
  type LayoutSpacing,
} from "./_types";

const rowsMap = {
  1: "grid-rows-1",
  2: "grid-rows-2",
  3: "grid-rows-3",
  4: "grid-rows-4",
  5: "grid-rows-5",
  6: "grid-rows-6",
} as const;

const justifyMap = {
  start: "justify-items-start",
  center: "justify-items-center",
  end: "justify-items-end",
  stretch: "justify-items-stretch",
} as const;

export type GridTracks = number | readonly number[];
export type ResponsiveColumns = { compact: GridTracks; regular?: GridTracks; wide?: GridTracks };
const tracks = (value: GridTracks) => typeof value === "number" ? `repeat(${value}, minmax(0, 1fr))` : value.map(fraction => `minmax(0, ${fraction}fr)`).join(" ");

export type GridProps = UIProps & LayoutElementProps & {
  align?: "start" | "center" | "end" | "stretch";
  columns?: number | "auto" | ResponsiveColumns;
  gap?: LayoutSpacing;
  justify?: keyof typeof justifyMap;
  minColumnWidth?: LayoutSize;
  rows?: keyof typeof rowsMap;
};

export function Grid({
  children,
  className,
  columns,
  minColumnWidth,
  rows,
  gap = "none",
  align = "stretch",
  justify,
  as,
  style,
  ...props
}: GridProps) {
  const Component = as ?? "div";
  const gapClass = spacingClass(gap);
  const customGap = gapClass ? undefined : spacingValue(gap);
  const minColumnWidthValue = cssSize(minColumnWidth);
  const responsive = typeof columns === "object" ? columns : undefined;
  const gridTemplateColumns = minColumnWidthValue
    ? `repeat(auto-fit, minmax(min(${minColumnWidthValue}, 100%), 1fr))`
    : typeof columns === "number" && columns
      ? `repeat(${columns}, minmax(0, 1fr))`
      : undefined;

  return (
    <Component data-ui="Grid"
      {...props}
      style={mergeStyle(style, { gap: customGap, gridTemplateColumns,
        ...(responsive ? {
          "--ui-grid-compact": tracks(responsive.compact),
          "--ui-grid-regular": tracks(responsive.regular ?? responsive.compact),
          "--ui-grid-wide": tracks(responsive.wide ?? responsive.regular ?? responsive.compact),
        } : {}),
      })}
      className={twMerge(
        clsx(
          "grid min-w-0",
          responsive && !minColumnWidthValue && "ui-responsive-grid",
          rows && rowsMap[rows],
          align === "start" && "items-start",
          align === "center" && "items-center",
          align === "end" && "items-end",
          align === "stretch" && "items-stretch",
          justify && justifyMap[justify],
          gapClass,
          className,
        ),
      )}
    >
      {children}
    </Component>
  );
}
