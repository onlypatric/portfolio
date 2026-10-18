import type { UIProps } from "../_types";
import "../theme.css";
import { useLayoutEffect, useRef, type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { InputOption } from "./_types";
import { hasFieldContent, useField } from "./_Field";
import { createSegmentedMotion } from "./_segmented-motion";

export type SegmentedPickerProps = UIProps & Omit<ComponentPropsWithRef<"fieldset">, "onChange"> & {
  choices: InputOption[]; name: string; onChange?: (value: string) => void; defaultValue?: string; value?: string;
  label?: ReactNode; helperText?: ReactNode; error?: ReactNode; required?: boolean;
  classNames?: Partial<Record<"root" | "legend" | "track" | "option" | "label" | "indicator" | "hint", string>>;
};
export function SegmentedPicker({ choices, className, classNames = {}, name, onChange, defaultValue, value, label, error, helperText, required, ...props }: SegmentedPickerProps) {
  const field = useField(props.id, error, helperText, props["aria-describedby"]), message = field.invalid ? error : helperText;
  const track = useRef<HTMLDivElement>(null), motion = useRef<ReturnType<typeof createSegmentedMotion> | null>(null);
  useLayoutEffect(() => { if (!track.current) return; motion.current = createSegmentedMotion(track.current); motion.current.update(false); return () => { motion.current?.dispose(); motion.current = null; }; }, []);
  useLayoutEffect(() => { motion.current?.update(); });
  return <fieldset {...props} data-ui="SegmentedPicker" aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]} className={twMerge("ui-choice-group ui-segmented", classNames.root, className)}>
    <legend className={twMerge(label === undefined ? "sr-only" : "ui-field-label", classNames.legend)}>{label ?? name}</legend>
    <div ref={track} data-slot="segments" className={twMerge("ui-segmented-track", classNames.track)}>
      <span data-slot="selectionIndicator" aria-hidden="true" hidden className={twMerge("ui-segment-indicator", classNames.indicator)} />
      {!choices.length && <span className="ui-field-message" role="status">No choices available.</span>}
      {choices.map(choice => <label key={choice.value} data-slot="option" className={twMerge("ui-segment-option", classNames.option)}>
        <input type="radio" name={name} value={choice.value} form={props.form} checked={value === undefined ? undefined : value === choice.value} defaultChecked={value === undefined ? defaultValue === choice.value : undefined}
          disabled={choice.disabled} required={required} onChange={() => onChange?.(choice.value)} className="ui-choice-hidden" />
        <span data-slot="caption" className={twMerge("ui-segment-caption", classNames.label)}>{choice.label}</span>
      </label>)}
    </div>
    {hasFieldContent(message) && <div id={field.fieldId + "-message"} data-slot="hint" data-error={field.invalid || undefined} aria-live="polite" className={twMerge("ui-field-message", classNames.hint)}>{message}</div>}
  </fieldset>;
}
