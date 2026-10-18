import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { fieldClassName, type FieldContentProps } from "./_types";
import { Field, useField } from "./_Field";

export type TextFieldProps = UIProps & FieldContentProps & Omit<ComponentPropsWithRef<"input">, "children">;
export function TextField({ classNames = {}, wrapperProps, className, error, helperText, id, label, startContent, endContent, ...props }: TextFieldProps) {
  const field = useField(id, error, helperText, props["aria-describedby"]);
  return <Field name="TextField" id={field.fieldId} {...{ label, error, helperText, startContent, endContent, classNames, wrapperProps }} required={props.required} readOnly={props.readOnly}>
    <input {...props} id={field.fieldId} data-slot="input" aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]} className={twMerge(fieldClassName, classNames.input, className)} />
  </Field>;
}
