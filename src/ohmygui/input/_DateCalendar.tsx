import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "../control/button/Button";
import { addDays, addMonths, dateObject, monthDates, validDate } from "./_calendar";
import type { DatePickerMessages } from "./_date-locale";

/** Single-selection calendar owned solely by DatePicker, using shared Gregorian arithmetic. */
export function DateCalendar({ value, today, resolved, text, id, weekStartsOn, min, max, step, stepBase, required, onSelect, onClose }: {
  value: string; today: string; resolved: string; text: DatePickerMessages; id: string; weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  min: string; max: string; step?: string | number; stepBase: string; required?: boolean; onSelect: (date: string) => void; onClose: () => void;
}) {
  const lower = validDate(min) ? min : "0001-01-01", upper = validDate(max) ? max : "9999-12-31";
  const clamp = (date: string) => date < lower ? lower : date > upper ? upper : date;
  const initial = clamp(validDate(value) ? value : today);
  const [month, setMonth] = useState(initial.slice(0, 7)), [focused, setFocused] = useState(initial);
  const root = useRef<HTMLDivElement>(null), pending = useRef<string | null>(null);
  const format = useMemo(() => {
    const date = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(resolved, { ...options, calendar: "gregory", timeZone: "UTC" });
    return { month: date({ year: "numeric", month: "long" }), day: date({ dateStyle: "full" }), weekday: date({ weekday: "short" }), weekdayLong: date({ weekday: "long" }), number: new Intl.NumberFormat(resolved, { useGrouping: false }) };
  }, [resolved]);
  const selectable = (date: string) => {
    if (!validDate(date) || date < lower || date > upper) return false;
    const amount = Number(step ?? 1);
    if (step === "any" || !Number.isFinite(amount) || amount <= 0) return true;
    const base = validDate(min) ? min : validDate(stepBase) ? stepBase : "1970-01-01";
    const delta = (dateObject(date).getTime() - dateObject(base).getTime()) / 86400000 / amount;
    return Math.abs(delta - Math.round(delta)) < 1e-7;
  };
  const dates = monthDates(month, weekStartsOn), available = dates.filter((date): date is string => !!date && selectable(date));
  const tabDate = available.includes(focused) ? focused : available.includes(value) ? value : available[0];
  const navigate = (date: string, focus = true) => {
    if (!validDate(date) || lower > upper) return;
    const next = clamp(date); setMonth(next.slice(0, 7)); setFocused(next); if (focus) pending.current = next;
  };
  useLayoutEffect(() => { if (pending.current) { root.current?.querySelector<HTMLButtonElement>(`[data-date="${pending.current}"]`)?.focus(); pending.current = null; } });
  const previous = month > "0001-01" ? addMonths(month + "-01", -1) : "", next = month < "9999-12" ? addMonths(month + "-01", 1) : "";
  return <div ref={root}>
    <div className="ui-calendar-header">
      <Button variant="ghost" size="sm" iconOnly aria-label={text.previousMonth} disabled={!previous || previous.slice(0, 7) < lower.slice(0, 7) || lower > upper} onClick={() => navigate(previous, false)}>‹</Button>
      <span id={id + "-month"} aria-live="polite" aria-atomic="true">{format.month.format(dateObject(month + "-01"))}</span>
      <Button variant="ghost" size="sm" iconOnly aria-label={text.nextMonth} disabled={!next || next.slice(0, 7) > upper.slice(0, 7) || lower > upper} onClick={() => navigate(next, false)}>›</Button>
    </div>
    <div role="grid" aria-labelledby={id + "-month"} className="ui-calendar-grid">
      <div role="row" className="ui-calendar-week">{Array.from({ length: 7 }, (_, index) => { const day = dateObject(addDays("2023-01-01", (index + weekStartsOn) % 7)); return <span key={index} role="columnheader" aria-label={format.weekdayLong.format(day)}>{format.weekday.format(day)}</span>; })}</div>
      {Array.from({ length: 6 }, (_, week) => <div role="row" key={month + week} className="ui-calendar-week ui-calendar-days">{dates.slice(week * 7, week * 7 + 7).map((date, index) => date ? <div key={date} role="gridcell" aria-selected={date === value}>
        <Button variant="unstyled" className="ui-calendar-day" data-date={date} disabled={!selectable(date)} aria-label={format.day.format(dateObject(date))} aria-pressed={date === value} aria-current={date === today ? "date" : undefined} tabIndex={date === tabDate ? 0 : -1}
          onFocus={() => setFocused(date)} onClick={() => onSelect(date)} onKeyDown={event => {
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            const rtl = getComputedStyle(event.currentTarget).direction === "rtl", weekday = (dateObject(date).getUTCDay() - weekStartsOn + 7) % 7;
            let target: string | undefined;
            if (event.key === "ArrowLeft") target = addDays(date, rtl ? 1 : -1);
            if (event.key === "ArrowRight") target = addDays(date, rtl ? -1 : 1);
            if (event.key === "ArrowUp") target = addDays(date, -7);
            if (event.key === "ArrowDown") target = addDays(date, 7);
            if (event.key === "Home") target = addDays(date, -weekday);
            if (event.key === "End") target = addDays(date, 6 - weekday);
            if (event.key === "PageUp") target = addMonths(date, event.shiftKey ? -12 : -1);
            if (event.key === "PageDown") target = addMonths(date, event.shiftKey ? 12 : 1);
            if (target && validDate(target)) {
              event.preventDefault(); let candidate = clamp(target);
              const direction = candidate < date ? -1 : 1;
              for (let count = 0; count < 366 && !selectable(candidate) && candidate > lower && candidate < upper; count++) candidate = addDays(candidate, direction);
              if (selectable(candidate)) navigate(candidate);
            }
          }}>{format.number.format(Number(date.slice(-2)))}</Button>
      </div> : <span key={index} role="gridcell" />)}</div>)}
    </div>
    {!available.length && <p role="status" className="ui-field-message">{text.unavailable}</p>}
    <div className="ui-date-actions"><Button size="sm" variant="ghost" disabled={!selectable(today)} onClick={() => onSelect(today)}>{text.today}</Button><Button size="sm" variant="ghost" disabled={!value || required} onClick={() => onSelect("")}>{text.clear}</Button><Button size="sm" variant="ghost" onClick={onClose}>{text.close}</Button></div>
    <p id={id + "-help"} className="ui-field-message">{text.keyboardHelp}</p>
  </div>;
}
