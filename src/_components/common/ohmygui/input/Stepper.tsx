import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, useImperativeHandle, useRef, useState, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../control/button/Button";
import { fieldClassName, type FieldContentProps } from "./_types";
import { Field, useField } from "./_Field";
import { finiteNumber, snapNumber } from "./_number";
import { useFormReset } from "./_useFormReset";

export type StepperProps = UIProps & FieldContentProps & Omit<ComponentPropsWithRef<"input">, "type" | "value" | "defaultValue" | "min" | "max" | "step"> & {
  defaultValue?: number; max?: number; min?: number; onValueChange?: (value: number) => void; step?: number; value?: number;
};
export function Stepper({ classNames = {}, wrapperProps, className, defaultValue = 0, label, helperText, error, startContent, endContent, id, max = Infinity, min = -Infinity, onChange, onValueChange, step = 1, value, ref, ...props }: StepperProps) {
  const lower = Number.isFinite(min) ? min : -Infinity, upper = Math.max(lower, Number.isFinite(max) ? max : Infinity), increment = step > 0 ? finiteNumber(step, 1) : 1;
  const normalize = (number: number) => snapNumber(number, lower, upper, increment, Number.isFinite(lower) ? lower : defaultValue);
  const [draft, setDraft] = useState(() => String(normalize(value ?? defaultValue)));
  const input = useRef<HTMLInputElement>(null), field = useField(id, error, helperText, props["aria-describedby"]);
  useImperativeHandle(ref, () => input.current!, []);
  useEffect(() => { if (value !== undefined) setDraft(String(normalize(value))); }, [value, min, max, step]);
  useFormReset(input, () => setDraft(String(normalize(value ?? defaultValue))), props.form);
  const isIntermediate = draft === "" || !Number.isFinite(Number(draft)) || Number(draft) < lower || Number(draft) > upper;
  const renderedDraft = value === undefined || isIntermediate ? draft : String(normalize(value));
  const current = renderedDraft === "" ? normalize(value ?? defaultValue) : finiteNumber(Number(renderedDraft), normalize(value ?? defaultValue));
  const commit = (next: number) => { const normalized = normalize(next); setDraft(String(normalize(value ?? normalized))); if (normalized !== current) onValueChange?.(normalized); };
  const changeBy = (direction: number) => {
    const control = input.current; if (!control || control.matches(":disabled") || props.readOnly) return;
    const base = Number.isFinite(lower) ? lower : defaultValue;
    const position = (current - base) / increment;
    const index = direction > 0 ? Math.floor(position + 1e-9) + 1 : Math.ceil(position - 1e-9) - 1;
    commit(base + index * increment);
  };
  const blocked = props.disabled || props.readOnly;
  return <Field name="Stepper" id={field.fieldId} {...{ label, error, helperText, classNames, wrapperProps }} required={props.required} readOnly={props.readOnly}
    startContent={<>{startContent}<Button type="button" size="sm" variant="ghost" aria-label="Decrease" aria-controls={field.fieldId} disabled={blocked || current <= lower} onClick={() => changeBy(-1)}>−</Button></>}
    endContent={<>{endContent}<Button type="button" size="sm" variant="ghost" aria-label="Increase" aria-controls={field.fieldId} disabled={blocked || current >= upper} onClick={() => changeBy(1)}>+</Button></>}>
    <input {...props} ref={input} id={field.fieldId} data-slot="input" type="number" inputMode={props.inputMode ?? "decimal"} min={Number.isFinite(lower) ? lower : undefined} max={Number.isFinite(upper) ? upper : undefined} step={increment} value={renderedDraft}
      aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]}
      onChange={event => {
        onChange?.(event); if (event.defaultPrevented || props.readOnly) return;
        const raw = event.currentTarget.value, number = event.currentTarget.valueAsNumber; setDraft(raw);
        if (Number.isFinite(number) && number >= lower && number <= upper) onValueChange?.(number);
      }}
      onBlur={event => {
        props.onBlur?.(event); if (props.readOnly || props.disabled || event.defaultPrevented) return;
        if (renderedDraft === "") { if (value !== undefined) setDraft(String(normalize(value))); }
        else { const normalized = normalize(current); setDraft(String(normalize(value ?? normalized))); if (normalized !== current) onValueChange?.(normalized); }
      }}
      className={twMerge(fieldClassName, "ui-stepper-input", classNames.input, className)} />
  </Field>;
}
