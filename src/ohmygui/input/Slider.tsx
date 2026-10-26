import type { UIProps, UIStyle } from "../_types";
import "../theme.css";
import { useImperativeHandle, useRef, useState, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import type { FieldContentProps } from "./_types";
import { Field, useField } from "./_Field";
import { rangeBounds, rangePercent, snapNumber } from "./_number";
import { useFormReset } from "./_useFormReset";

export type SliderProps = UIProps & FieldContentProps & Omit<ComponentPropsWithRef<"input">, "children" | "max" | "min" | "step" | "type" | "value" | "defaultValue"> & {
  max?: number; min?: number; showValue?: boolean; step?: number; value?: number; defaultValue?: number;
  onValueChange?: (value: number) => void; formatValue?: (value: number) => string;
};
export function Slider({ classNames = {}, wrapperProps, className, label, error, helperText, startContent, endContent, id, max = 100, min = 0, step = 1, showValue = false, value, defaultValue, onValueChange, formatValue, onChange, style, ref, ...props }: SliderProps) {
  const bounds = rangeBounds(min, max, step);
  const initial = () => snapNumber(defaultValue ?? (bounds.min + bounds.max) / 2, bounds.min, bounds.max, bounds.step);
  const [internal, setInternal] = useState(initial);
  const current = snapNumber(value ?? internal, bounds.min, bounds.max, bounds.step);
  const input = useRef<HTMLInputElement>(null), field = useField(id, error, helperText, props["aria-describedby"]);
  useImperativeHandle(ref, () => input.current!, []);
  useFormReset(input, () => { if (value === undefined) setInternal(initial()); }, props.form);
  return <Field name="Slider" id={field.fieldId} {...{ label, error, helperText, startContent, classNames, wrapperProps }} readOnly={props.readOnly}
    endContent={showValue || endContent ? <>{showValue && <output aria-hidden="true" htmlFor={field.fieldId} className="ui-number-value">{formatValue?.(current) ?? current}</output>}{endContent}</> : undefined}>
    <input {...props} ref={input} id={field.fieldId} type="range" data-slot="input" {...bounds} value={current}
      aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]} aria-readonly={props.readOnly || undefined} aria-valuetext={props["aria-valuetext"] ?? formatValue?.(current)}
      onChange={event => { onChange?.(event); if (event.defaultPrevented || props.readOnly) return; const next = snapNumber(event.currentTarget.valueAsNumber, bounds.min, bounds.max, bounds.step); if (value === undefined) setInternal(next); onValueChange?.(next); }}
      onKeyDown={event => { props.onKeyDown?.(event); if (props.readOnly && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(event.key)) event.preventDefault(); }}
      onPointerDown={event => { props.onPointerDown?.(event); if (props.readOnly) event.preventDefault(); }}
      className={twMerge("ui-range", classNames.input, className)} style={{ "--ui-range-value": rangePercent(current, bounds.min, bounds.max) + "%", ...style } as UIStyle} />
  </Field>;
}
