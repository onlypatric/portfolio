import type { UIProps } from "../_types";
import "../theme.css";
import { twMerge } from "tailwind-merge";
import { type ComponentPropsWithRef, type CSSProperties, type ElementType } from "react";

export type ContainerRelativeFrameProps = UIProps & ComponentPropsWithRef<"div"> & {
  axis?: "horizontal" | "vertical" | "both";
  fraction?: number;
  as?: ElementType;
};

export function ContainerRelativeFrame({
  axis = "horizontal",
  children,
  className,
  fraction = 1,
  style,
  as,
  ...props
}: ContainerRelativeFrameProps) {
  const Component = as ?? "div";
  const clampedFraction = Math.min(1, Math.max(0, fraction));
  const percentage = `${clampedFraction * 100}%`;
  const containerInlineSize = `calc(${clampedFraction} * 100cqw)`;
  const containerBlockSize = `calc(${clampedFraction} * 100cqh)`;
  const frameStyle: CSSProperties = {
    containerType: "size",
    ...(axis === "horizontal" || axis === "both"
      ? { inlineSize: percentage }
      : {}),
    ...(axis === "vertical" || axis === "both"
      ? { blockSize: percentage }
      : {}),
    ["--ohmygui-frame-inline" as string]: containerInlineSize,
    ["--ohmygui-frame-block" as string]: containerBlockSize,
    ...style,
  };

  return (
    <Component data-ui="ContainerRelativeFrame"
      {...props}
      style={frameStyle}
      className={twMerge(
        axis === "horizontal" || axis === "both"
          ? "[inline-size:var(--ohmygui-frame-inline)]"
          : undefined,
        axis === "vertical" || axis === "both"
          ? "[block-size:var(--ohmygui-frame-block)]"
          : undefined,
        className,
      )}
      data-ohmygui-container-relative-frame="true"
    >
      {children}
    </Component>
  );
}
