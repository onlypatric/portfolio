import type { UIProps } from "../_types";
import "../theme.css";
import "../theme/design-system.css";
import { useId, type ComponentPropsWithRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type ToggleProps = UIProps & Omit<ComponentPropsWithRef<"input">, "children" | "type"> & {
  controlPlacement?: "leading" | "trailing";
  label?: ReactNode; description?: ReactNode; wrapperProps?: ComponentPropsWithoutRef<"label">;
  classNames?: Partial<Record<"root" | "input" | "track" | "thumb" | "label", string>>;
};
export function Toggle({ controlPlacement = "leading", className, label, description, classNames = {}, wrapperProps, ...props }: ToggleProps) {
  const id = useId(), labelId = id + "-label", descriptionId = id + "-description";
  const describedBy = [...new Set([props["aria-describedby"], description !== undefined ? descriptionId : undefined].filter(Boolean).join(" ").split(/\s+/).filter(Boolean))].join(" ") || undefined;
  return <label {...wrapperProps} data-ui="Toggle" data-control-placement={controlPlacement} className={twMerge("ui-toggle", classNames.root, wrapperProps?.className)}>
    <span className="ui-toggle-control">
      <input {...props} type="checkbox" role={props.role ?? "switch"} aria-labelledby={props["aria-labelledby"] ?? (props["aria-label"] === undefined && label !== undefined ? labelId : undefined)} aria-describedby={describedBy} className={twMerge("ui-choice-hidden", classNames.input)} />
      <span aria-hidden="true" data-slot="track" className={twMerge("ui-switch-track", classNames.track, className)}>
        <span data-slot="thumb" className={twMerge("ui-switch-thumb", classNames.thumb)} />
      </span>
    </span>
    {(label !== undefined || description !== undefined) && <span className={twMerge("ui-toggle-text", classNames.label)}>{label !== undefined && <span id={labelId}>{label}</span>}{description !== undefined && <span id={descriptionId} data-slot="description">{description}</span>}</span>}
  </label>;
}
