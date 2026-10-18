import type { CSSProperties, ComponentPropsWithRef, ElementType } from "react";

export type ContentElementProps = ComponentPropsWithRef<"span"> & {
  as?: ElementType;
};

export const textVariantMap = {
  body: "text-[length:var(--ui-font-size-base)] leading-6",
  caption: "text-[length:var(--ui-font-size-xs)] leading-4",
  footnote: "text-[length:var(--ui-font-size-sm)] leading-5",
  subheadline: "text-[length:var(--ui-font-size-sm)] leading-6",
  headline: "text-[length:var(--ui-font-size-2xl)] leading-8",
  title: "text-[length:var(--ui-font-size-xl)] leading-7",
  largeTitle: "text-[length:var(--ui-font-size-4xl)] leading-tight",
} as const;

export const textWeightMap = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

export const textColorMap = {
  default: "text-[var(--foreground)]",
  muted: "text-[var(--muted)]",
  accent: "text-[var(--accent)]",
  danger: "text-[var(--danger)]",
  success: "text-[var(--success)]",
  warning: "text-[var(--warning)]",
} as const;

export function mergeContentStyle(
  style: CSSProperties | undefined,
  additions: CSSProperties,
) {
  return Object.keys(additions).length > 0
    ? { ...additions, ...style }
    : style;
}

export function sizeValue(value: number | string | undefined) {
  return typeof value === "number" ? `${value}px` : value;
}
