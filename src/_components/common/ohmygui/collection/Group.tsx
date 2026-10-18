import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ElementType } from "react";

export type GroupProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  as?: ElementType;
};

export function Group({ as, children, ...props }: GroupProps) {
  if (!as) return <>{children}</>;
  const Component = as;
  return <Component data-ui="Group" {...props}>{children}</Component>;
}
