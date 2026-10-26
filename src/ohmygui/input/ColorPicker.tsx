import type { UIProps } from "../_types";
import "../theme.css";
import { useImperativeHandle, useRef, useState, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import type { FieldContentProps } from "./_types";
import { Field, useField } from "./_Field";
import { useFormReset } from "./_useFormReset";

export type ColorPickerProps = UIProps & FieldContentProps & Omit<ComponentPropsWithRef<"input">, "type" | "value" | "defaultValue" | "children"> & {
  /** Compatibility only: this portable control is opaque sRGB; alpha is not supported. */
  allowAlpha?: boolean; value?: string; defaultValue?: string; showValue?: boolean;
};
const colorValue = (value: string) => /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : "#000000";
export function ColorPicker({ classNames = {}, wrapperProps, className, label, allowAlpha: _allowAlpha, value, defaultValue = "#000000", showValue = true, onChange, helperText, error, startContent, endContent, id, ref, ...props }: ColorPickerProps) {
  const field = useField(id, error, helperText, props["aria-describedby"]), input = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState(() => colorValue(defaultValue)), current = colorValue(value ?? internal);
  useImperativeHandle(ref, () => input.current!, []);
  useFormReset(input, () => { if (value === undefined) setInternal(colorValue(defaultValue)); }, props.form);
  return <Field name="ColorPicker" id={field.fieldId} {...{ label, classNames, wrapperProps, helperText, error, startContent }} readOnly={props.readOnly}
    endContent={<>{showValue && <output data-slot="value" htmlFor={field.fieldId} aria-hidden="true" className="ui-number-value">{current.toUpperCase()}</output>}{endContent}</>}>
    <input {...props} ref={input} id={field.fieldId} type="color" value={current} data-slot="input" aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]}
      onChange={event => { onChange?.(event); if (!event.defaultPrevented && !props.readOnly && value === undefined) setInternal(colorValue(event.currentTarget.value)); }}
      onClick={event => { props.onClick?.(event); if (props.readOnly) event.preventDefault(); }}
      onKeyDown={event => { props.onKeyDown?.(event); if (props.readOnly && [" ", "Enter"].includes(event.key)) event.preventDefault(); }}
      className={twMerge("ui-field ui-color-input", classNames.input, className)} />
  </Field>;
}
