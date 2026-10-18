import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { fieldClassName, type FieldContentProps } from "./_types";
import { Field, useField } from "./_Field";

export type SearchFieldProps = UIProps & FieldContentProps & Omit<ComponentPropsWithRef<"input">, "type"> & { suggestions?: string[] };
export function SearchField({ className, classNames = {}, wrapperProps, label, error, helperText, startContent, endContent, id, list, suggestions, ...props }: SearchFieldProps) {
  const field = useField(id, error, helperText, props["aria-describedby"]);
  const listId = list ?? (suggestions?.length ? field.fieldId + "-suggestions" : undefined);
  return <Field name="SearchField" id={field.fieldId} {...{ label, error, helperText, startContent, endContent, classNames, wrapperProps }} required={props.required} readOnly={props.readOnly}>
    <input {...props} id={field.fieldId} type="search" data-slot="input" list={listId} aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]} className={twMerge(fieldClassName, classNames.input, className)} />
    {!!suggestions?.length && !list && <datalist id={listId}>{[...new Set(suggestions)].map(value => <option key={value} value={value} />)}</datalist>}
  </Field>;
}
