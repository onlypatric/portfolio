import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { InputOption } from "./_types";
import { hasFieldContent, useField } from "./_Field";

export type RadioGroupProps = UIProps & Omit<ComponentPropsWithRef<"fieldset">, "onChange"> & {
  items: InputOption[]; legend?: ReactNode; name: string; onChange?: (value: string) => void; defaultValue?: string; value?: string;
  helperText?: ReactNode; error?: ReactNode; required?: boolean; orientation?: "vertical" | "horizontal";
  classNames?: Partial<Record<"root" | "legend" | "list" | "item" | "input" | "label" | "hint", string>>;
};
export function RadioGroup({ className, classNames = {}, disabled = false, items, legend, name, onChange, defaultValue, value, error, helperText, required, orientation = "vertical", ...props }: RadioGroupProps) {
  const field = useField(props.id, error, helperText, props["aria-describedby"]), message = field.invalid ? error : helperText;
  return <fieldset {...props} data-ui="RadioGroup" disabled={disabled} aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]} data-orientation={orientation} className={twMerge("ui-choice-group", classNames.root, className)}>
    <legend className={twMerge(legend === undefined ? "sr-only" : "ui-field-label", classNames.legend)}>{legend ?? name}</legend>
    <div data-slot="list" className={twMerge("ui-radio-list", classNames.list)}>
      {!items.length && <p className="ui-field-message" role="status">No options available.</p>}
      {items.map(item => <label key={item.value} data-slot="option" className={twMerge("ui-radio-row", classNames.item)}>
        <input type="radio" name={name} value={item.value} form={props.form} checked={value === undefined ? undefined : value === item.value} defaultChecked={value === undefined ? defaultValue === item.value : undefined}
          disabled={item.disabled} required={required} onChange={() => onChange?.(item.value)} className={twMerge("ui-radio", classNames.input)} />
        <span className={classNames.label}>{item.label}</span>
      </label>)}
    </div>
    {hasFieldContent(message) && <div id={field.fieldId + "-message"} data-slot="hint" data-error={field.invalid || undefined} aria-live="polite" className={twMerge("ui-field-message", classNames.hint)}>{message}</div>}
  </fieldset>;
}
