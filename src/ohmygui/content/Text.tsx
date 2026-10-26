import type { UIProps } from "../_types";
import "../theme.css";
import "../theme/design-system.css";
import clsx from "clsx";
import { type CSSProperties } from "react";
import { twMerge } from "tailwind-merge";
import {
  mergeContentStyle,
  textColorMap,
  textVariantMap,
  textWeightMap,
  type ContentElementProps,
} from "./_types";

export type TextElement =
  | "span"
  | "p"
  | "div"
  | "small"
  | "strong"
  | "em"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

export type TextProps = UIProps & Omit<ContentElementProps, "color" | "ref"> & {
  as?: TextElement;
  color?: keyof typeof textColorMap | string;
  multiline?: boolean;
  selectable?: boolean;
  numeric?: boolean;
  truncate?: boolean | number;
  variant?: keyof typeof textVariantMap;
  weight?: keyof typeof textWeightMap;
};

export function Text({
  as = "span",
  children,
  className,
  color = "default",
  multiline = false,
  selectable = true,
  numeric = false,
  style,
  truncate = false,
  variant = "body",
  weight,
  ...props
}: TextProps) {
  const Component = as;
  const colorClass =
    typeof color === "string" && color in textColorMap
      ? textColorMap[color as keyof typeof textColorMap]
      : undefined;
  const truncateStyle: CSSProperties =
    typeof truncate === "number"
      ? {
          display: "-webkit-box",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: truncate,
        }
      : truncate
        ? { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
        : {};

  return (
    <Component data-ui="Text"
      {...props}
      style={mergeContentStyle(style, {
        color: colorClass ? undefined : color,
        userSelect: selectable ? undefined : "none",
        whiteSpace: multiline ? "pre-wrap" : undefined,
        ...truncateStyle,
      })}
      className={twMerge(
        clsx(
          "min-w-0",
          numeric && "ui-number",
          textVariantMap[variant],
          textWeightMap[weight ?? (["eyebrow", "section", "metric", "editorial"].includes(variant) ? "medium" : "regular")],
          colorClass,
          className,
        ),
      )}
    >
      {children}
    </Component>
  );
}
