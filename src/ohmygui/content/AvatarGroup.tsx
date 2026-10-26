import type { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import "../theme/design-system.css";
export type AvatarGroupProps = UIProps & ComponentPropsWithRef<"div"> & { label: string };
export function AvatarGroup({ label, className, ...props }: AvatarGroupProps) {
  return <div {...props} data-ui="AvatarGroup" role={props.role ?? "group"} aria-label={label} className={twMerge("ui-avatar-group", className)} />;
}
