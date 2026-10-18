import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, useImperativeHandle, useRef, useState, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { Field, useField } from "./_Field";
import type { FieldContentProps } from "./_types";
import { useFormReset } from "./_useFormReset";

export type FilePickerProps = UIProps & FieldContentProps & Omit<ComponentPropsWithRef<"input">, "type" | "value" | "defaultValue" | "children" | "readOnly"> & {
  /** Maximum bytes per file. Client-side convenience, not a server trust boundary. */
  maxSize?: number; onFilesChange?: (files: File[]) => void; onCancel?: (event: Event) => void;
};
export function FilePicker({ className, classNames = {}, wrapperProps, label = "Choose files", maxSize, onFilesChange, onCancel, onChange, helperText, error, startContent, endContent, id, ref, ...props }: FilePickerProps) {
  const input = useRef<HTMLInputElement>(null), [sizeError, setSizeError] = useState<string>(), [names, setNames] = useState<string[]>([]);
  useImperativeHandle(ref, () => input.current!, []);
  useEffect(() => {
    const native = input.current;
    if (!onCancel || !native) return;
    native.addEventListener("cancel", onCancel); return () => native.removeEventListener("cancel", onCancel);
  }, [onCancel]);
  const message = sizeError ?? error, field = useField(id, message, true, props["aria-describedby"]);
  useFormReset(input, () => { setSizeError(undefined); setNames([]); input.current?.setCustomValidity(""); }, props.form);
  return <Field name="FilePicker" id={field.fieldId} {...{ classNames, wrapperProps, label, startContent, endContent }} required={props.required} error={message}
    helperText={<>{helperText}<output data-slot="selection" htmlFor={field.fieldId} className="ui-file-selection">{names.length ? names.join(", ") : "No files selected"}</output></>}>
    <input {...props} ref={input} id={field.fieldId} type="file" data-slot="input" aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]}
      onChange={event => {
        onChange?.(event); if (event.defaultPrevented) return;
        const native = event.currentTarget, files = Array.from(native.files ?? []);
        const limit = maxSize !== undefined && Number.isFinite(maxSize) && maxSize >= 0 ? maxSize : undefined;
        if (limit !== undefined && files.some(file => file.size > limit)) {
          const message = `Each file must be ${limit.toLocaleString()} bytes or smaller.`;
          native.value = ""; native.setCustomValidity(message); setSizeError(message); setNames([]); onFilesChange?.([]); return;
        }
        native.setCustomValidity(""); setSizeError(undefined); setNames(files.map(file => file.name)); onFilesChange?.(files);
      }}
      className={twMerge("ui-field ui-file-input", classNames.input, className)} />
  </Field>;
}
