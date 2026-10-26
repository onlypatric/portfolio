import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type ControlGroupProps = UIProps & ComponentPropsWithRef<"fieldset"> & {
  compact?: boolean; label?: ReactNode; orientation?: "horizontal" | "vertical";
  classNames?: Partial<Record<"root" | "label" | "content", string>>;
};
export function ControlGroup({ className, classNames = {}, compact = false, label, orientation = "horizontal", children, ...props }: ControlGroupProps) {
  return <fieldset {...props} data-ui="ControlGroup" data-orientation={orientation} data-compact={compact || undefined} className={twMerge("ui-choice-group ui-control-group", classNames.root, className)}>
    {label !== undefined && <legend className={twMerge("ui-field-label", classNames.label)}>{label}</legend>}
    <div data-slot="content" className={twMerge("ui-control-group-content", classNames.content)}>{children}</div>
  </fieldset>;
}
