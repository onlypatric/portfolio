import "../theme.css";
import type { UIProps } from "../_types";
import { shapeStyle, type ShapeProps } from "./_types";

export type UnevenRoundedRectangleProps = UIProps & ShapeProps & {
  bottomEnd?: number | string; bottomStart?: number | string; topEnd?: number | string; topStart?: number | string;
};
export function UnevenRoundedRectangle({ bottomEnd = 0, bottomStart = 0, fill = "var(--accent)", height = "100%", stroke, strokeWidth, style, topEnd = 0, topStart = 0, width = "100%", ...props }: UnevenRoundedRectangleProps) {
  return <div {...props} data-ui="UnevenRoundedRectangle" role={props.role ?? (props["aria-label"] ? "img" : undefined)} aria-hidden={props["aria-label"] ? undefined : true} style={{
    ...shapeStyle({ fill, height, stroke, strokeWidth, width }),
    borderStartStartRadius: topStart, borderStartEndRadius: topEnd, borderEndStartRadius: bottomStart, borderEndEndRadius: bottomEnd, ...style,
  }} />;
}
