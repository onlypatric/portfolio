import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";

export type DrawingColor = string;
export type DrawingChildren = ComponentPropsWithoutRef<"div">["children"];

export type ShapeProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children?: ReactNode;
  fill?: DrawingColor;
  height?: number | string;
  stroke?: DrawingColor;
  strokeWidth?: number;
  width?: number | string;
};

export function shapeStyle(props: { fill?: string; height?: number | string; stroke?: string; strokeWidth?: number; width?: number | string }, extra: CSSProperties = {}): CSSProperties {
  return {
    background: props.fill,
    border: props.stroke ? String(props.strokeWidth ?? 1) + "px solid " + props.stroke : undefined,
    height: props.height,
    width: props.width,
    ...extra,
  };
}

export function gradient(colors: string[], fallback: string) {
  const stops = colors.length ? colors : [fallback];
  return (stops.length === 1 ? [stops[0], stops[0]] : stops).join(", ");
}
