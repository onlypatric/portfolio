import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../control/button/Button";
import { useField, hasFieldContent } from "./_Field";
import { useFormReset } from "./_useFormReset";
import { addDays, addMonths, boundedDates, dateObject, monthDates, validDate, validMonth } from "./_calendar";

export type MultiDatePickerProps = UIProps & Omit<ComponentPropsWithRef<"fieldset">, "onChange"> & {
  label?: ReactNode; helperText?: ReactNode; error?: ReactNode; max?: string; min?: string; name?: string; readOnly?: boolean;
  selected?: string[]; defaultSelected?: string[]; onSelectedChange?: (selected: string[]) => void;
  /** YYYY-MM; supply for a deterministic SSR calendar when no bounds/selection exist. */
  initialMonth?: string; locale?: string; weekStartsOn?: 0 | 1;
};
export function MultiDatePicker({ className, label = "Select dates", max, min, onSelectedChange, selected, defaultSelected = [], initialMonth, name, readOnly = false, locale = "en-US", weekStartsOn = 1, helperText, error, id, ref, ...props }: MultiDatePickerProps) {
  const lower = validDate(min) ? min : "0001-01-01", upper = validDate(max) ? max : "9999-12-31";
  const field = useField(id, error, helperText, props["aria-describedby"]), root = useRef<HTMLFieldSetElement>(null);
  const [internal, setInternal] = useState(() => boundedDates(defaultSelected, lower, upper));
  const current = boundedDates(selected ?? internal, lower, upper);
  const clampDate = (date: string) => date < lower ? lower : date > upper ? upper : date;
  const seed = boundedDates(selected ?? defaultSelected, lower, upper);
  const anchor = validMonth(initialMonth) ? initialMonth : (seed[0] ?? (validDate(min) ? min : validDate(max) ? max : "" )).slice(0, 7);
  const [month, setMonth] = useState(anchor), [focused, setFocused] = useState(current[0] ?? "");
  const pendingFocus = useRef<string | null>(null);
  useImperativeHandle(ref, () => root.current!, []);
  // Avoid server/client clock disagreement: unanchored SSR waits for the local browser month.
  useEffect(() => { if (!month) { const now = new Date(); setMonth([now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0")].join("-")); } }, [month]);
  const visibleMonth = validMonth(month) ? clampDate(month + "-01").slice(0, 7) : "";
  const dates = visibleMonth ? monthDates(visibleMonth, weekStartsOn) : [];
  const available = dates.filter((date): date is string => !!date && date >= lower && date <= upper);
  const tabDate = available.includes(focused) ? focused : current.find(date => available.includes(date)) ?? available[0];
  const navigate = (date: string, focus: boolean) => {
    if (!validDate(date) || lower > upper) return;
    const next = clampDate(date); setFocused(next); setMonth(next.slice(0, 7));
    if (focus) pendingFocus.current = next;
  };
  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    root.current?.querySelector<HTMLButtonElement>('[data-date="' + pendingFocus.current + '"]')?.focus();
    pendingFocus.current = null;
  });
  useFormReset(root, () => {
    if (selected === undefined) setInternal(boundedDates(defaultSelected, lower, upper));
    setFocused(""); if (anchor) setMonth(anchor);
  }, props.form);
  const { monthFormat, dayFormat, weekdayLong, weekdayShort } = useMemo(() => {
    const format = (options: Intl.DateTimeFormatOptions) => { try { return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }); } catch { return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }); } };
    return { monthFormat: format({ month: "long", year: "numeric" }), dayFormat: format({ weekday: "long", day: "numeric", month: "long", year: "numeric" }), weekdayLong: format({ weekday: "long" }), weekdayShort: format({ weekday: "short" }) };
  }, [locale]);
  const title = visibleMonth ? monthFormat.format(dateObject(visibleMonth + "-01")) : "Choose a month";
  const message = field.invalid ? error : helperText, titleId = field.fieldId + "-month", helpId = field.fieldId + "-keys";
  const previous = visibleMonth && visibleMonth > "0001-01" ? addMonths(visibleMonth + "-01", -1) : "";
  const next = visibleMonth && visibleMonth < "9999-12" ? addMonths(visibleMonth + "-01", 1) : "";
  return <fieldset {...props} id={id} ref={root} data-ui="MultiDatePicker" aria-describedby={field.describedBy} aria-invalid={field.invalid || props["aria-invalid"]} className={twMerge("ui-choice-group ui-calendar", className)}>
    <legend className="ui-field-label">{label}</legend>
    <div className="ui-calendar-header">
      <Button variant="ghost" size="sm" iconOnly aria-label="Previous month" disabled={!previous || previous.slice(0, 7) < lower.slice(0, 7) || lower > upper} onClick={() => navigate(previous, false)}>‹</Button>
      <div id={titleId} data-slot="month" aria-live="polite" aria-atomic="true">{title}</div>
      <Button variant="ghost" size="sm" iconOnly aria-label="Next month" disabled={!next || next.slice(0, 7) > upper.slice(0, 7) || lower > upper} onClick={() => navigate(next, false)}>›</Button>
    </div>
    {visibleMonth && <div role="grid" aria-labelledby={titleId} aria-describedby={helpId} aria-multiselectable="true" aria-readonly={readOnly || undefined} className="ui-calendar-grid">
      <div role="row" className="ui-calendar-week">
        {Array.from({ length: 7 }, (_, index) => {
          const date = dateObject(addDays("2023-01-01", (index + weekStartsOn) % 7));
          return <span role="columnheader" key={index} aria-label={weekdayLong.format(date)}>{weekdayShort.format(date)}</span>;
        })}
      </div>
      {Array.from({ length: 6 }, (_, week) => <div role="row" key={visibleMonth + "-" + week} className="ui-calendar-week ui-calendar-days">
        {dates.slice(week * 7, week * 7 + 7).map((date, index) => date ? <div role="gridcell" aria-selected={current.includes(date)} key={date}>
          <Button variant="unstyled" data-date={date} className="ui-calendar-day" aria-label={dayFormat.format(dateObject(date))} aria-pressed={current.includes(date)} aria-disabled={readOnly || undefined}
            disabled={date < lower || date > upper} tabIndex={date === tabDate ? 0 : -1}
            onFocus={() => setFocused(date)}
            onClick={() => {
              if (readOnly || root.current?.matches(":disabled")) return;
              const next = current.includes(date) ? current.filter(item => item !== date) : [...current, date].sort();
              if (selected === undefined) setInternal(next); onSelectedChange?.(next);
            }}
            onKeyDown={event => {
              if (event.altKey || event.ctrlKey || event.metaKey) return;
              const rtl = getComputedStyle(event.currentTarget).direction === "rtl", weekday = (dateObject(date).getUTCDay() - weekStartsOn + 7) % 7;
              let target: string | undefined;
              if (event.key === "ArrowLeft") target = addDays(date, rtl ? 1 : -1);
              else if (event.key === "ArrowRight") target = addDays(date, rtl ? -1 : 1);
              else if (event.key === "ArrowUp") target = addDays(date, -7);
              else if (event.key === "ArrowDown") target = addDays(date, 7);
              else if (event.key === "Home") target = addDays(date, -weekday);
              else if (event.key === "End") target = addDays(date, 6 - weekday);
              else if (event.key === "PageUp") target = addMonths(date, event.shiftKey ? -12 : -1);
              else if (event.key === "PageDown") target = addMonths(date, event.shiftKey ? 12 : 1);
              if (target !== undefined) { event.preventDefault(); navigate(target, true); }
            }}>{Number(date.slice(-2))}</Button>
        </div> : <span key={"empty-" + index} role="gridcell" />)}
      </div>)}
    </div>}
    {!available.length && visibleMonth && <p role="status" className="ui-field-message">No dates available in this range.</p>}
    {!visibleMonth && <p className="ui-field-message">The calendar uses your local browser month when interactive. Supply initialMonth for a prerendered calendar.</p>}
    <p id={helpId} className="ui-field-message">Use arrow keys to move, Page Up/Down to change month, and Space to select dates.</p>
    <output data-slot="selection" aria-live="polite" className="ui-field-message">{current.length} {current.length === 1 ? "date" : "dates"} selected</output>
    {hasFieldContent(message) && <div id={field.fieldId + "-message"} data-slot="hint" data-error={field.invalid || undefined} aria-live="polite" className="ui-field-message">{message}</div>}
    {name && current.map(date => <input key={date} type="hidden" name={name} form={props.form} value={date} />)}
  </fieldset>;
}
