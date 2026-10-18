import type { UIProps } from "../_types";
import "../theme.css";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type FieldGroupProps = UIProps & ComponentPropsWithRef<"fieldset"> & {
  disabled?: boolean;
  hint?: ReactNode;
  legend: ReactNode;
};

export function FieldGroup({ className, disabled = false, hint, legend, ...props }: FieldGroupProps) {
  const generated = useId();
  const hintId = hint !== undefined ? `${props.id ?? generated}-hint` : undefined;
  return (
    <fieldset data-ui="FieldGroup" {...props} disabled={disabled} aria-describedby={[props["aria-describedby"], hintId].filter(Boolean).join(" ") || undefined} className={twMerge("grid min-w-0 gap-[var(--ui-space-3)]", className)}>
      <legend className="text-[length:var(--ui-font-size-base)] font-semibold">{legend}</legend>
      {props.children}
      {hint !== undefined && <p id={hintId} className="m-0 text-[length:var(--ui-font-size-sm)] text-[var(--muted)]">{hint}</p>}
    </fieldset>
  );
}
