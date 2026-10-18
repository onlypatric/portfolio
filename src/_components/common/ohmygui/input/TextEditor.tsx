import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { fieldClassName, type FieldContentProps } from "./_types";
import { Field, useField } from "./_Field";

export type TextEditorProps = UIProps & FieldContentProps & ComponentPropsWithRef<"textarea">;
export function TextEditor({ classNames = {}, wrapperProps, className, label, error, helperText, startContent, endContent, id, rows = 5, ...props }: TextEditorProps) {
  const field = useField(id, error, helperText, props["aria-describedby"]);
  return <Field name="TextEditor" id={field.fieldId} {...{ label, error, helperText, startContent, endContent, classNames, wrapperProps }} required={props.required} readOnly={props.readOnly}>
    <textarea {...props} id={field.fieldId} rows={rows} data-slot="input" aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]} className={twMerge(fieldClassName, "resize-y", classNames.input, className)} />
  </Field>;
}
