import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { fieldClassName, type FieldContentProps, type InputOption } from "./_types";
import { Field, useField } from "./_Field";
import { Button } from "../control/button/Button";
import { useFormReset } from "./_useFormReset";
import { optionText } from "./_optionText";
import { usePopupMotion, type PopupAnimationProps } from "../_usePopupMotion";

export type PickerProps = UIProps & PopupAnimationProps & Omit<FieldContentProps, "classNames"> & Omit<ComponentPropsWithRef<"select">, "children"> & {
  items: InputOption[]; placeholder?: ReactNode; emptyMessage?: ReactNode; readOnly?: boolean;
  classNames?: FieldContentProps["classNames"] & Partial<Record<"trigger" | "panel" | "option", string>>;
};
export function Picker({ className, classNames = {}, wrapperProps, label, error, helperText, startContent, endContent, id, items, placeholder, emptyMessage = "No options available", readOnly = false, ref, onChange, onFocus, onInvalid, openingAnimation, closingAnimation, ...props }: PickerProps) {
  const [ready, setReady] = useState(false), [open, setOpen] = useState(false), [active, setActive] = useState(-1), [validation, setValidation] = useState("");
  const native = useRef<HTMLSelectElement>(null), trigger = useRef<HTMLButtonElement>(null), panel = useRef<HTMLUListElement>(null);
  const search = useRef({ text: "", time: 0 });
  const choices: InputOption[] = placeholder === undefined ? items : [{ value: "", label: placeholder }, ...items];
  const values = (value: PickerProps["value"]) => value === undefined ? [] : typeof value === "string" || typeof value === "number" ? [String(value)] : Array.from(value, String);
  const fallback = props.multiple ? [] : choices.find(item => !item.disabled)?.value;
  const [internal, setInternal] = useState<string[]>(() => props.defaultValue === undefined ? fallback === undefined ? [] : Array.isArray(fallback) ? fallback : [fallback] : values(props.defaultValue));
  const requested = props.value === undefined ? internal : values(props.value);
  const known = requested.filter(value => choices.some(choice => choice.value === value));
  const current = props.multiple ? known : known.length ? known.slice(0, 1) : fallback === undefined || Array.isArray(fallback) ? [] : [fallback];
  const custom = ready && !props.hidden, visible = open && custom && !props.disabled && !props.inert && !readOnly;
  const field = useField(id, error || validation, helperText, props["aria-describedby"]), listId = field.fieldId + "-options", labelId = field.fieldId + "-label", valueId = field.fieldId + "-value";
  const rows = Math.min(12, Math.max(1, Number.isFinite(props.size) ? props.size! : 8));
  const popup = usePopupMotion(visible, { panelRef: panel, triggerRef: trigger, anchored: true, matchTriggerWidth: true, maxHeight: rows * 40, openingAnimation, closingAnimation, onDismiss: () => setOpen(false) });
  const disabled = () => !!(props.disabled || props.inert || readOnly || native.current?.matches(":disabled") || native.current?.closest("[inert]"));
  useImperativeHandle(ref, () => native.current!, []);
  useEffect(() => { setReady(true); }, []);
  const sync = () => {
    const next = Array.from(native.current?.selectedOptions ?? [], option => option.value);
    if (props.value === undefined) setInternal(previous => previous.length === next.length && previous.every((item, index) => item === next[index]) ? previous : next);
  };
  useLayoutEffect(() => { sync(); });
  useLayoutEffect(() => { if (custom && document.activeElement === native.current) trigger.current?.focus(); }, [custom]);
  const close = () => { setOpen(false); search.current.text = ""; };
  useFormReset(native, () => {
    if (props.value !== undefined && native.current) for (const option of native.current.options) option.selected = current.includes(option.value);
    sync(); setValidation(""); close();
  }, props.form);
  useEffect(() => { if (props.disabled || props.inert || readOnly || !custom) close(); }, [props.disabled, props.inert, readOnly, custom]);
  const enabled = choices.map((choice, index) => choice.disabled ? -1 : index).filter(index => index >= 0);
  const activeIndex = enabled.includes(active) ? active : enabled.find(index => current.includes(choices[index].value)) ?? enabled[0] ?? -1;
  const show = (direction = 1) => {
    if (!custom || disabled()) return;
    setActive(enabled.find(index => current.includes(choices[index].value)) ?? (direction > 0 ? enabled[0] : enabled.at(-1)) ?? -1);
    setOpen(true);
  };
  const choose = (index: number) => {
    const choice = choices[index], select = native.current;
    if (!visible || !select || !choice || choice.disabled || disabled()) return;
    const next = props.multiple ? current.includes(choice.value) ? current.filter(value => value !== choice.value) : [...current, choice.value] : [choice.value];
    if (next.length !== current.length || next.some((value, index) => value !== current[index])) {
      if (props.multiple) for (const option of select.options) option.selected = next.includes(option.value);
      else select.value = choice.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (!props.multiple) close();
  };
  useEffect(() => {
    if (!visible) return;
    const outside = (event: PointerEvent) => { if (!panel.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) close(); };
    document.addEventListener("pointerdown", outside); return () => document.removeEventListener("pointerdown", outside);
  }, [visible]);
  useLayoutEffect(() => {
    if (!visible || activeIndex < 0) return;
    const list = panel.current, option = list?.children[activeIndex] as HTMLElement | undefined;
    if (list && option) { if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop; else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight; }
  }, [visible, activeIndex]);
  const selected = choices.filter(choice => current.includes(choice.value));
  return <Field name="Picker" id={field.fieldId} {...{ helperText, startContent, endContent, classNames, wrapperProps }} label={label ? <span id={labelId}>{label}</span> : label} error={error || validation} required={props.required} readOnly={readOnly}>
    <select {...props} ref={native} id={field.fieldId} data-slot="input" tabIndex={custom ? -1 : props.tabIndex} aria-hidden={custom || props["aria-hidden"] || undefined} aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]}
      onChange={event => { sync(); setValidation(event.currentTarget.validity.valid ? "" : event.currentTarget.validationMessage); onChange?.(event); }}
      onFocus={event => { onFocus?.(event); if (custom) { trigger.current?.focus(); show(); } }}
      onInvalid={event => { onInvalid?.(event); if (custom && !event.defaultPrevented) { event.preventDefault(); setValidation(event.currentTarget.validationMessage); trigger.current?.focus(); show(); } }}
      className={twMerge(fieldClassName, classNames.input, className, custom && "ui-picker-native")}>
      {choices.map((item, index) => <option key={item.value + index} value={item.value} disabled={item.disabled}>{item.textValue ?? (optionText(item.label) || item.value)}</option>)}
    </select>
    {custom && <Button variant="unstyled" ref={trigger} role="combobox" data-slot="pickerTrigger" className={twMerge("ui-picker-trigger", classNames.trigger)}
      disabled={props.disabled} inert={props.inert} tabIndex={props.tabIndex} title={props.title} accessKey={props.accessKey} dir={props.dir} aria-haspopup="listbox" aria-expanded={visible} aria-controls={visible ? listId : undefined} aria-activedescendant={visible && activeIndex >= 0 ? listId + "-" + activeIndex : undefined}
      aria-required={props.required || undefined} aria-readonly={readOnly || undefined} aria-invalid={field.invalid || props["aria-invalid"]}
      aria-label={props["aria-label"] ?? (label ? undefined : "Select an option")} aria-labelledby={props["aria-labelledby"] ? props["aria-labelledby"] + " " + valueId : props["aria-label"] ? undefined : label ? labelId + " " + valueId : undefined} aria-describedby={[field.describedBy, props["aria-label"] ? valueId : undefined].filter(Boolean).join(" ") || undefined}
      onClick={() => visible ? close() : show()} onBlur={event => { if (!panel.current?.contains(event.relatedTarget as Node)) close(); }}
      onKeyDown={event => {
        if (disabled() || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "Escape" && visible) { event.preventDefault(); event.stopPropagation(); close(); }
        else if (event.key === "Tab") close();
        else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); if (visible) choose(activeIndex); else show(); }
        else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          if (!visible) { show(event.key === "ArrowUp" || event.key === "End" ? -1 : 1); if (event.key === "Home") setActive(enabled[0] ?? -1); if (event.key === "End") setActive(enabled.at(-1) ?? -1); }
          else { const index = enabled.indexOf(activeIndex); setActive(event.key === "Home" ? enabled[0] ?? -1 : event.key === "End" ? enabled.at(-1) ?? -1 : enabled[(index + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length] ?? -1); }
        } else if (event.key.length === 1 && !event.nativeEvent.isComposing) {
          const now = performance.now(); search.current = { text: now - search.current.time < 700 ? search.current.text + event.key : event.key, time: now };
          const query = [...search.current.text].every(char => char === event.key) ? event.key : search.current.text;
          const ordered = enabled.map((_, offset) => enabled[(enabled.indexOf(activeIndex) + 1 + offset) % enabled.length]);
          const index = ordered.find(candidate => (choices[candidate].textValue ?? (optionText(choices[candidate].label) || choices[candidate].value)).toLocaleLowerCase().startsWith(query.toLocaleLowerCase()));
          if (index !== undefined) { event.preventDefault(); setOpen(true); setActive(index); }
        }
      }}>
      <span id={valueId}>{selected.length ? selected.map((choice, index) => <span key={choice.value}>{index > 0 && ", "}{choice.label}</span>) : placeholder ?? "Select an option"}</span>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 9 6 6 6-6" /></svg>
    </Button>}
    {popup.present && <ul ref={panel} id={listId} popover={typeof HTMLElement.prototype.showPopover === "function" ? "manual" : undefined} role="listbox" data-slot="panel" aria-multiselectable={props.multiple || undefined} aria-label={typeof label === "string" ? label : props["aria-label"] ?? "Options"} dir={props.dir} className={twMerge("ui-picker-panel", classNames.panel)}>
      {choices.map((choice, index) => <li key={choice.value + index} role="presentation"><Button variant="unstyled" id={listId + "-" + index} role="option" tabIndex={-1} disabled={choice.disabled} aria-disabled={choice.disabled || undefined} aria-selected={current.includes(choice.value)} data-active={index === activeIndex || undefined} className={twMerge("ui-picker-option", classNames.option)}
        onPointerDown={event => event.preventDefault()} onMouseDown={event => event.preventDefault()} onPointerMove={() => { if (visible && !choice.disabled) setActive(index); }} onClick={() => choose(index)}>
        <span>{choice.label}</span><span aria-hidden="true" data-slot="check">{current.includes(choice.value) ? "✓" : ""}</span>
      </Button></li>)}
      {!choices.length && <li role="presentation" className="ui-field-message">{emptyMessage}</li>}
    </ul>}
  </Field>;
}
