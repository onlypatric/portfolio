import type {
  CSSProperties,
  ComponentPropsWithRef,
  ElementType,
} from "react";

export type LayoutElementProps = ComponentPropsWithRef<"div"> & {
  as?: ElementType;
};

export type LayoutSpacing =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | number
  | string;

export type LayoutSize = number | string;

export const spacingClassMap = {
  none: "gap-0",
  xs: "gap-[var(--ui-space-1)]",
  sm: "gap-[var(--ui-space-2)]",
  md: "gap-[var(--ui-space-4)]",
  lg: "gap-[var(--ui-space-6)]",
  xl: "gap-[var(--ui-space-8)]",
} as const;

const spacingValueMap = {
  none: "0px",
  xs: "var(--ui-space-1)",
  sm: "var(--ui-space-2)",
  md: "var(--ui-space-4)",
  lg: "var(--ui-space-6)",
  xl: "var(--ui-space-8)",
} as const;

export const alignmentClassMap = {
  start: "items-start",
  left: "items-start",
  top: "items-start",
  center: "items-center",
  end: "items-end",
  right: "items-end",
  bottom: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

export const justifyClassMap = {
  start: "justify-start",
  left: "justify-start",
  center: "justify-center-safe",
  end: "justify-end-safe",
  right: "justify-end-safe",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
  stretch: "justify-stretch",
  default: "justify-normal",
} as const;

export function spacingClass(value: LayoutSpacing | undefined) {
  if (typeof value === "string" && value in spacingClassMap) {
    return spacingClassMap[value as keyof typeof spacingClassMap];
  }

  return undefined;
}

export function spacingValue(value: LayoutSpacing | undefined) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "string" && value in spacingValueMap) {
    return spacingValueMap[value as keyof typeof spacingValueMap];
  }

  return typeof value === "number" ? `${value}px` : value;
}

export function cssSize(value: LayoutSize | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}

export function mergeStyle(
  style: CSSProperties | undefined,
  additions: CSSProperties,
) {
  return Object.keys(additions).length > 0
    ? { ...additions, ...style }
    : style;
}
