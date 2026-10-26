import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { fieldClassName, type FieldContentProps } from "./_types";
import { Field, useField } from "./_Field";
import { Button } from "../control/button/Button";
import { validDate, dateObject } from "./_calendar";
import { dateLocaleInfo, resolveDateLocale, type DatePickerMessages } from "./_date-locale";
import { DateCalendar } from "./_DateCalendar";
import { useFormReset } from "./_useFormReset";
import { usePopupMotion, type PopupAnimationProps } from "../_usePopupMotion";

export type { DatePickerMessages } from "./_date-locale";
export type DatePickerProps = UIProps & PopupAnimationProps & Omit<FieldContentProps, "classNames"> & Omit<ComponentPropsWithRef<"input">, "type"> & {
  mode?: "date" | "time" | "datetime-local";
  /** Explicit application/user preference wins over browser languages. */
  locale?: string; fallbackLocale?: string; preferClientLocale?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  messages?: Partial<DatePickerMessages>;
  onValueChange?: (isoDate: string) => void;
  classNames?: FieldContentProps["classNames"] & Partial<Record<"trigger" | "panel", string>>;
};
export function DatePicker({ classNames = {}, wrapperProps, className, label, error, helperText, startContent, endContent, id, mode = "date", locale, fallbackLocale = "en-US", preferClientLocale = true, weekStartsOn, messages, onValueChange, ref, onChange, onFocus, onInvalid, openingAnimation, closingAnimation, ...props }: DatePickerProps) {
  const [validation, setValidation] = useState("");
  const visibleError = error || validation;
  const field = useField(id, visibleError, helperText, props["aria-describedby"]);
  const native = useRef<HTMLInputElement>(null), trigger = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false), [clientLocale, setClientLocale] = useState<string>();
  const [internal, setInternal] = useState(String(props.defaultValue ?? "")), [open, setOpen] = useState(false), [today, setToday] = useState("");
  useImperativeHandle(ref, () => native.current!, []);
  useEffect(() => {
    setReady(true);
    const update = () => setClientLocale(resolveDateLocale(navigator.languages?.length ? navigator.languages : [navigator.language], fallbackLocale));
    update(); window.addEventListener("languagechange", update);
    return () => window.removeEventListener("languagechange", update);
  }, [fallbackLocale]);
  const resolved = resolveDateLocale([locale ?? (preferClientLocale ? clientLocale : undefined) ?? fallbackLocale], fallbackLocale);
  const info = useMemo(() => dateLocaleInfo(resolved), [resolved]), text = { ...info.messages, ...messages };
  const format = useMemo(() => new Intl.DateTimeFormat(resolved, { year: "numeric", month: "short", day: "numeric", calendar: "gregory", timeZone: "UTC" }), [resolved]);
  const value = String(props.value ?? internal), custom = ready && mode === "date" && !props.hidden, panelId = field.fieldId + "-calendar";
  const visible = open && custom && !props.disabled && !props.readOnly;
  const popup = usePopupMotion(visible, { panelRef: panel, triggerRef: trigger, anchored: true, openingAnimation, closingAnimation, onDismiss: () => setOpen(false) });
  useLayoutEffect(() => {
    if (props.value === undefined) setInternal(native.current?.value ?? "");
    if (custom && document.activeElement === native.current) trigger.current?.focus();
  }, [custom, mode]);
  const disabled = () => !!(props.disabled || props.readOnly || native.current?.matches(":disabled"));
  const close = (restore = false) => { setOpen(false); if (restore) trigger.current?.focus(); };
  const show = () => {
    if (!custom || disabled()) return;
    const now = new Date();
    setToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
    setOpen(true);
  };
  const commit = (date: string) => {
    if (!visible || disabled()) return;
    const input = native.current!;
    // React observes the same native events as manual input; controlled parents can reject.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, date);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    close(true);
  };
  useFormReset(native, () => { if (props.value === undefined) setInternal(native.current?.value ?? ""); setValidation(""); close(); }, props.form);
  useEffect(() => { if (props.disabled || props.readOnly || mode !== "date") setOpen(false); }, [props.disabled, props.readOnly, mode]);
  useLayoutEffect(() => {
    if (visible) (panel.current?.querySelector<HTMLButtonElement>('[data-date][tabindex="0"]') ?? panel.current?.querySelector<HTMLButtonElement>('button:not(:disabled)'))?.focus();
  }, [visible]);
  useEffect(() => {
    if (!visible) return;
    const outside = (event: PointerEvent) => { if (!panel.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) close(); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [visible]);
  const labelId = field.fieldId + "-date-label", valueId = field.fieldId + "-date-value";
  return <Field name="DatePicker" id={field.fieldId} {...{ helperText, startContent, endContent, classNames, wrapperProps }} label={label ? <span id={labelId}>{label}</span> : label} error={visibleError} required={props.required} readOnly={props.readOnly}>
    <input {...props} ref={native} id={field.fieldId} type={mode} data-slot="input" data-date-native={custom || undefined} tabIndex={custom ? -1 : props.tabIndex} aria-hidden={custom || undefined}
      aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]}
      onChange={event => { if (props.value === undefined) setInternal(event.currentTarget.value); setValidation(event.currentTarget.validity.valid ? "" : event.currentTarget.validationMessage); onChange?.(event); onValueChange?.(event.currentTarget.value); }}
      onFocus={event => { onFocus?.(event); if (custom) { if (disabled()) trigger.current?.focus(); else show(); } }}
      onInvalid={event => { onInvalid?.(event); if (custom && !event.defaultPrevented) { event.preventDefault(); setValidation(event.currentTarget.validationMessage); show(); } }}
      className={twMerge(fieldClassName, classNames.input, className, custom && "ui-date-native")} />
    {custom && <Button variant="unstyled" ref={trigger} data-slot="dateTrigger" className={twMerge("ui-date-trigger", classNames.trigger)} lang={resolved} dir={props.dir ?? info.direction} tabIndex={props.tabIndex} title={props.title} accessKey={props.accessKey}
      disabled={props.disabled} aria-disabled={props.readOnly || undefined} aria-haspopup="dialog" aria-expanded={visible} aria-controls={visible ? panelId : undefined}
      aria-label={props["aria-label"] ?? (label ? undefined : text.chooseDate)} aria-labelledby={props["aria-labelledby"] ? props["aria-labelledby"] + " " + valueId : props["aria-label"] ? undefined : label ? labelId + " " + valueId : undefined} aria-describedby={[field.describedBy, props["aria-label"] ? valueId : undefined].filter(Boolean).join(" ") || undefined}
      aria-invalid={field.invalid || props["aria-invalid"]} onClick={() => open ? close() : show()}
      onBlur={event => { if (visible && !panel.current?.contains(event.relatedTarget as Node)) close(); }}
      onKeyDown={event => { if (event.key === "Escape" && visible) { event.preventDefault(); event.stopPropagation(); close(true); } else if (event.key === "ArrowDown") { event.preventDefault(); show(); } }}>
      <span id={valueId}>{validDate(value) ? format.format(dateObject(value)) : props.placeholder ?? text.chooseDate}</span>
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 2v6M17 2v6M3 11h18" /></svg>
    </Button>}
    {popup.present && <div ref={panel} id={panelId} popover={typeof HTMLElement.prototype.showPopover === "function" ? "manual" : undefined} role="dialog" aria-label={text.chooseDate} aria-describedby={panelId + "-help"} lang={resolved} dir={props.dir ?? info.direction} className={twMerge("ui-calendar ui-date-panel", classNames.panel)}
      onToggle={event => { if (event.newState === "closed" && !event.currentTarget.matches(":popover-open")) setOpen(false); }}
      onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node) && event.relatedTarget !== trigger.current) close(); }}
      onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(true); } }}>
      <DateCalendar {...{ value, today, resolved, text }} id={panelId} weekStartsOn={weekStartsOn ?? info.weekStartsOn} min={String(props.min ?? "")} max={String(props.max ?? "")} step={props.step} stepBase={String(props.defaultValue ?? props.value ?? "")} required={props.required} onSelect={commit} onClose={() => close(true)} />
    </div>}
  </Field>;
}
