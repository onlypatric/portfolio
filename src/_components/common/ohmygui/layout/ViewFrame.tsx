import type { UIProps } from "../_types";
import "../theme.css";
import { twMerge } from "tailwind-merge";
import { cssSize, type LayoutElementProps, type LayoutSize } from "./_types";

export type ViewFrameProps = UIProps & LayoutElementProps & {
  height?: LayoutSize;
  ideal?: LayoutSize;
  max?: LayoutSize;
  min?: LayoutSize;
  width?: LayoutSize;
};

export function ViewFrame({
  children,
  className,
  height,
  ideal,
  max,
  min,
  width,
  style,
  as,
  ...props
}: ViewFrameProps) {
  const Component = as ?? "div";

  return (
    <Component data-ui="ViewFrame"
      {...props}
      style={{
        minInlineSize: cssSize(min),
        inlineSize: cssSize(width ?? ideal),
        maxInlineSize: cssSize(max),
        blockSize: cssSize(height),
        ...style,
      }}
      className={twMerge("min-w-0", className)}
    >
      {children}
    </Component>
  );
}
