import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { LayoutElementProps } from "./_types";

const alignmentMap = {
  start: "items-start",
  top: "items-start",
  bottom: "items-end",
  end: "items-end",
  center: "items-center",
  stretch: "items-stretch",
} as const;

const justifyMap = {
  start: "justify-items-start",
  left: "justify-items-start",
  right: "justify-items-end",
  end: "justify-items-end",
  center: "justify-items-center",
  stretch: "justify-items-stretch",
} as const;

export type ZStackProps = UIProps & LayoutElementProps & {
  align?: keyof typeof alignmentMap;
  justify?: keyof typeof justifyMap;
};

export function ZStack({
  children,
  className,
  align = "center",
  justify = "center",
  as,
  ...props
}: ZStackProps) {
  const Component = as ?? "div";

  return (
    <Component data-ui="ZStack"
      {...props}
      className={twMerge(
        clsx(
          "grid min-w-0 *:col-start-1 *:row-start-1",
          alignmentMap[align],
          justifyMap[justify],
          className,
        ),
      )}
    >
      {children}
    </Component>
  );
}
