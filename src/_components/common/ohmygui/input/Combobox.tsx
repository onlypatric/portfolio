import "../theme.css";
import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { type FieldContentProps, type InputOption } from "./_types";
import type { UIProps } from "../_types";
import { Field, useField } from "./_Field";
import { useFormReset } from "./_useFormReset";
import { usePopupMotion, type PopupAnimationProps } from "../_usePopupMotion";
import { optionText } from "./_optionText";

export type ComboboxProps = UIProps & PopupAnimationProps & Omit<FieldContentProps, "classNames"> & Omit<ComponentPropsWithRef<"input">, "value" | "defaultValue" | "children"> & {
  /** both adds selected inline completion, accepted on Enter, Tab or blur. */
  autocomplete?: "none" | "list" | "both"; options: InputOption[]; value?: string; defaultValue?: string;
  onValueChange?: (value: string) => void;
  classNames?: FieldContentProps["classNames"] & Partial<Record<"panel" | "option", string>>;
};

export function Combobox({ autocomplete = "list", className, classNames = {}, defaultValue = "", onChange, onValueChange, options, value, label, helperText, error, startContent, endContent, wrapperProps, id, ref, openingAnimation, closingAnimation, ...props }: ComboboxProps) {
  const field = useField(id, error, helperText, props["aria-describedby"]), listId = field.fieldId + "-options";
  const [internal, setInternal] = useState(defaultValue), [open, setOpen] = useState(false), [highlighted, setHighlighted] = useState<string>();
  const [completion, setCompletion] = useState<{ query: string; value: string }>();
  const accepted = useRef(false);
  const input = useRef<HTMLInputElement>(null), composing = useRef(false), panel = useRef<HTMLUListElement>(null);
  useImperativeHandle(ref, () => input.current!, []);
  const current = value ?? internal;
  const inline = autocomplete === "both" && !props.disabled && !props.readOnly && completion?.query === current ? completion : undefined;
  useEffect(() => { if (completion && (completion.query !== current || autocomplete !== "both" || props.disabled || props.readOnly)) setCompletion(undefined); }, [current, autocomplete, props.disabled, props.readOnly, completion]);
  const query = current.trim().toLocaleLowerCase();
  const filtered = autocomplete === "none" ? options : options.filter(option => (option.textValue ?? (optionText(option.label) || option.value)).toLocaleLowerCase().includes(query) || option.value.toLocaleLowerCase().includes(query));
  const enabled = filtered.filter(option => !option.disabled);
  const activeIndex = filtered.findIndex(option => option.value === highlighted && !option.disabled);
  const visible = open && !props.disabled && !props.readOnly;
  const popup = usePopupMotion(visible, { panelRef: panel, triggerRef: input, openingAnimation, closingAnimation });
  const lastOptions = useRef({ filtered, activeIndex });
  useLayoutEffect(() => { if (visible) lastOptions.current = { filtered, activeIndex }; });
  const displayed = visible ? { filtered, activeIndex } : lastOptions.current;
  const editable = () => !!input.current && !input.current.matches(":disabled") && !input.current.readOnly;
  const close = () => { setOpen(false); setHighlighted(undefined); setCompletion(undefined); };
  const complete = (query: string) => {
    accepted.current = false;
    const candidate = autocomplete === "both" && query && !composing.current ? options.find(option => !option.disabled && option.value.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()) && option.value.length > query.length) : undefined;
    setCompletion(candidate ? { query, value: candidate.value } : undefined);
    if (candidate) setHighlighted(candidate.value);
  };
  const acceptInline = () => {
    if (!inline || accepted.current || !editable()) return;
    accepted.current = true;
    if (value === undefined) setInternal(inline.value);
    onValueChange?.(inline.value);
  };
  useFormReset(input, () => { if (value === undefined) setInternal(defaultValue); composing.current = false; close(); }, props.form);
  useEffect(() => {
    if (!visible) return;
    const outside = (event: PointerEvent) => { if (!input.current?.closest('[data-ui="Combobox"]')?.contains(event.target as Node)) close(); };
    document.addEventListener("pointerdown", outside); return () => document.removeEventListener("pointerdown", outside);
  }, [visible]);
  useLayoutEffect(() => {
    if (!inline || document.activeElement !== input.current) return;
    try { input.current?.setSelectionRange(inline.query.length, inline.value.length); } catch { /* Non-text native types do not expose a selection range. */ }
  }, [inline?.query, inline?.value]);
  useLayoutEffect(() => {
    if (!visible || activeIndex < 0) return;
    const list = panel.current, option = list?.children[activeIndex] as HTMLElement | undefined;
    if (list && option) {
      const top = option.offsetTop, bottom = top + option.offsetHeight;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
    }
  }, [visible, activeIndex]);
  const select = (option: InputOption) => {
    if (!visible || option.disabled || !editable()) return;
    accepted.current = true;
    if (value === undefined) setInternal(option.value);
    onValueChange?.(option.value); close();
  };
  return <Field name="Combobox" id={field.fieldId} {...{ label, helperText, error, startContent, endContent, wrapperProps, classNames }} required={props.required} readOnly={props.readOnly}>
    <input {...props} ref={input} id={field.fieldId} data-slot="input" value={inline?.value ?? current} role="combobox" aria-autocomplete={autocomplete} aria-expanded={visible} aria-controls={visible ? listId : undefined}
      aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]} aria-activedescendant={visible && activeIndex >= 0 ? listId + "-" + activeIndex : undefined}
      onChange={event => { onChange?.(event); if (event.defaultPrevented || !editable()) return; const next = event.currentTarget.value; if (value === undefined) setInternal(next); setOpen(true); setHighlighted(undefined); onValueChange?.(next); if ((event.nativeEvent as InputEvent).inputType?.startsWith("delete")) setCompletion(undefined); else complete(next); }}
      onFocus={event => { props.onFocus?.(event); if (!event.defaultPrevented && editable()) setOpen(true); }}
      onBlur={event => { props.onBlur?.(event); if (!event.currentTarget.closest('[data-ui="Combobox"]')?.contains(event.relatedTarget as Node)) { acceptInline(); close(); } }}
      onCompositionStart={event => { composing.current = true; setHighlighted(undefined); props.onCompositionStart?.(event); }}
      onCompositionEnd={event => { composing.current = false; props.onCompositionEnd?.(event); if (editable()) complete(event.currentTarget.value); }}
      onKeyDown={event => {
        props.onKeyDown?.(event);
        if (event.defaultPrevented || composing.current || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229 || !editable()) return;
        if (event.key === "Escape" && visible) { event.preventDefault(); event.stopPropagation(); close(); }
        else if (event.key === "Tab") { acceptInline(); close(); }
        else if (event.key === "Enter" && visible && activeIndex >= 0) { event.preventDefault(); select(filtered[activeIndex]); }
        else if (!event.altKey && !event.ctrlKey && !event.metaKey && enabled.length && ["ArrowDown", "ArrowUp"].includes(event.key)) {
          event.preventDefault(); setOpen(true);
          const index = enabled.findIndex(option => option.value === highlighted);
          const next = enabled[index < 0 ? event.key === "ArrowDown" ? 0 : enabled.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length];
          setHighlighted(next.value); accepted.current = false;
          setCompletion(autocomplete === "both" && next.value.toLocaleLowerCase().startsWith(current.toLocaleLowerCase()) ? { query: current, value: next.value } : undefined);
        }
      }}
      className={twMerge("ui-field", classNames.input, className)} />
    {popup.present && <ul ref={panel} id={listId} role="listbox" aria-label={props["aria-label"] ? props["aria-label"] + " suggestions" : "Suggestions"} data-slot="panel" className={twMerge("ui-combobox-panel", classNames.panel)}>
      {displayed.filtered.map((option, index) => <li id={listId + "-" + index} key={option.value} role="option" aria-selected={index === displayed.activeIndex} aria-disabled={option.disabled || undefined}
        onPointerDown={event => event.preventDefault()} onMouseDown={event => event.preventDefault()} onPointerMove={() => { if (!option.disabled) setHighlighted(option.value); }} onClick={() => select(option)}
        data-disabled={option.disabled || undefined} className={twMerge("ui-combobox-option", classNames.option)}>{option.label}</li>)}
      {!displayed.filtered.length && <li role="presentation" className="ui-field-message">No matches found.</li>}
    </ul>}
  </Field>;
}
