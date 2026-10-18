import { useId, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { FieldContentProps } from "./_types";

export const hasFieldContent = (value: ReactNode) => value !== undefined && value !== null && value !== false && value !== "";
export function useField(id: string | undefined, error: ReactNode, helperText: ReactNode, describedBy?: string) {
  const generated = useId(), fieldId = id ?? generated;
  const invalid = hasFieldContent(error);
  const messageId = invalid || hasFieldContent(helperText) ? fieldId + "-message" : undefined;
  return { fieldId, invalid, describedBy: [...new Set([...(describedBy?.split(/\s+/) ?? []), messageId].filter(Boolean))].join(" ") || undefined };
}

/** Explicit label association keeps interactive adornments outside the label. */
export function Field({ name, id, label, error, helperText, startContent, endContent, classNames = {}, wrapperProps, children, required, readOnly }: FieldContentProps & { name: string; id: string; children: ReactNode; required?: boolean; readOnly?: boolean }) {
  const invalid = hasFieldContent(error), message = invalid ? error : helperText;
  const rootProps = wrapperProps ?? {};
  return <div {...rootProps} data-ui={name} data-field-root="" data-invalid={invalid || undefined} data-readonly={readOnly || undefined} className={twMerge("ui-field-root", classNames.root, rootProps.className)}>
    {hasFieldContent(label) && <label htmlFor={id} data-slot="label" className={twMerge("ui-field-label", classNames.label)}>{label}{required && <span aria-hidden="true" data-slot="required"> *</span>}</label>}
    <div data-slot="control" className={twMerge("ui-field-frame", classNames.control)}>
      {hasFieldContent(startContent) && <span data-slot="startContent" className={twMerge("ui-field-adornment", classNames.startContent)}>{startContent}</span>}
      {children}
      {hasFieldContent(endContent) && <span data-slot="endContent" className={twMerge("ui-field-adornment", classNames.endContent)}>{endContent}</span>}
    </div>
    {hasFieldContent(message) && <div key={invalid ? "error" : "hint"} id={id + "-message"} data-slot="hint" data-error={invalid || undefined} aria-live="polite" className={twMerge("ui-field-message", classNames.hint)}>{message}</div>}
  </div>;
}
