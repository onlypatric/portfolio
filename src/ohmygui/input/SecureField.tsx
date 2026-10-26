import { Button } from "../control/button/Button";
import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { fieldClassName, type FieldContentProps } from "./_types";
import { Field, useField } from "./_Field";

export type SecureFieldProps = UIProps & FieldContentProps & Omit<ComponentPropsWithRef<"input">, "type"> & { revealable?: boolean };
export function SecureField({ classNames = {}, wrapperProps, className, label, error, helperText, startContent, endContent, id, revealable = true, ref, ...props }: SecureFieldProps) {
  const [revealed, setRevealed] = useState(false), input = useRef<HTMLInputElement>(null);
  const caret = useRef<{ start: number | null; end: number | null } | null>(null);
  const field = useField(id, error, helperText, props["aria-describedby"]);
  useImperativeHandle(ref, () => input.current!, []);
  useLayoutEffect(() => {
    const selection = caret.current; caret.current = null;
    if (selection && input.current) { input.current.focus({ preventScroll: true }); input.current.setSelectionRange(selection.start, selection.end); }
  }, [revealed]);
  useEffect(() => {
    const form = input.current?.form;
    const reset = () => setRevealed(false);
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [props.form]);
  const reveal = revealable && <Button variant="ghost" size="sm" type="button" data-slot="reveal" disabled={props.disabled} aria-controls={field.fieldId} aria-label={revealed ? "Hide password" : "Show password"} aria-pressed={revealed}
    onPointerDown={event => { if (event.button === 0) event.preventDefault(); }}
    onClick={() => {
      if (document.activeElement === input.current && input.current) caret.current = { start: input.current.selectionStart, end: input.current.selectionEnd };
      setRevealed(current => !current);
    }}>{revealed ? "Hide" : "Show"}</Button>;
  return <Field name="SecureField" id={field.fieldId} {...{ label, error, helperText, startContent, classNames, wrapperProps }} required={props.required} readOnly={props.readOnly} endContent={revealable || endContent ? <>{endContent}{reveal}</> : undefined}>
    <input {...props} ref={input} id={field.fieldId} type={revealed && revealable ? "text" : "password"} data-slot="input" aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]} className={twMerge(fieldClassName, classNames.input, className)} />
  </Field>;
}
