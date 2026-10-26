import type { UIProps, UIStyle } from "../_types";
import "../theme.css";
import { useId, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { rangeBounds, rangePercent, snapNumber } from "./_number";
import { useFormReset } from "./_useFormReset";

export type RangeSliderProps = UIProps & Omit<ComponentPropsWithRef<"div">, "onChange"> & {
  low?: number; high?: number; defaultLow?: number; defaultHigh?: number; min?: number; max?: number; step?: number;
  onLowChange?: (value: number) => void; onHighChange?: (value: number) => void;
  disabled?: boolean; readOnly?: boolean; label?: ReactNode; lowLabel?: string; highLabel?: string;
  lowName?: string; highName?: string; form?: string; showValue?: boolean;
};
export function RangeSlider({ className, low, high, defaultLow = 25, defaultHigh = 75, min = 0, max = 100, step = 1, onLowChange, onHighChange, disabled = false, readOnly = false, label, lowLabel = "Minimum", highLabel = "Maximum", lowName, highName, form, showValue = true, style, ...props }: RangeSliderProps) {
  const bounds = rangeBounds(min, max, step), id = useId(), lowRef = useRef<HTMLInputElement>(null), highRef = useRef<HTMLInputElement>(null);
  const [internalLow, setLow] = useState(defaultLow), [internalHigh, setHigh] = useState(defaultHigh);
  const safeHigh = snapNumber(high ?? internalHigh, bounds.min, bounds.max, bounds.step);
  const safeLow = Math.min(safeHigh, snapNumber(low ?? internalLow, bounds.min, bounds.max, bounds.step));
  useFormReset(lowRef, () => { if (low === undefined) setLow(defaultLow); if (high === undefined) setHigh(defaultHigh); }, form);
  const update = (which: "low" | "high", raw: number) => {
    if (disabled || readOnly || lowRef.current?.matches(":disabled")) return;
    const next = snapNumber(raw, bounds.min, bounds.max, bounds.step);
    if (which === "low") { const clamped = Math.min(next, safeHigh); if (low === undefined) setLow(clamped); onLowChange?.(clamped); }
    else { const clamped = Math.max(next, safeLow); if (high === undefined) setHigh(clamped); onHighChange?.(clamped); }
  };
  const preventReadOnly = (event: React.KeyboardEvent<HTMLInputElement>) => { if (readOnly && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(event.key)) event.preventDefault(); };
  return <div {...props} data-ui="RangeSlider" role={props.role ?? "group"} aria-labelledby={props["aria-labelledby"] ?? (label ? id + "-label" : undefined)} aria-disabled={disabled || undefined}
    className={twMerge("ui-range-group", className)} style={{ "--ui-range-low": rangePercent(safeLow, bounds.min, bounds.max) + "%", "--ui-range-high": rangePercent(safeHigh, bounds.min, bounds.max) + "%", ...style } as UIStyle}>
    {(label || showValue) && <div className="ui-range-heading">{label && <span id={id + "-label"}>{label}</span>}{showValue && <output aria-hidden="true" className="ui-number-value">{safeLow}–{safeHigh}</output>}</div>}
    <div data-slot="rail" className="ui-range-rail" onPointerDown={event => {
      if (event.target instanceof HTMLInputElement || disabled || readOnly) return;
      const rect = event.currentTarget.getBoundingClientRect();
      let fraction = Math.max(0, Math.min(1, (event.clientX - rect.left - 10) / Math.max(1, rect.width - 20)));
      if (getComputedStyle(event.currentTarget).direction === "rtl") fraction = 1 - fraction;
      const target = bounds.min + fraction * (bounds.max - bounds.min), which = Math.abs(target - safeLow) < Math.abs(target - safeHigh) ? "low" : "high";
      update(which, target); (which === "low" ? lowRef : highRef).current?.focus({ preventScroll: true });
    }}>
      <span data-slot="track" className="ui-range-track" aria-hidden="true" />
      <input ref={lowRef} aria-label={lowLabel} aria-describedby={props["aria-describedby"]} aria-valuemin={bounds.min} aria-valuemax={safeHigh} aria-readonly={readOnly || undefined} type="range" {...bounds} value={safeLow} name={lowName} form={form} disabled={disabled}
        onChange={event => update("low", event.currentTarget.valueAsNumber)} onKeyDown={preventReadOnly} onPointerDown={event => { if (readOnly) event.preventDefault(); }} className="ui-range ui-range-low" />
      <input ref={highRef} aria-label={highLabel} aria-describedby={props["aria-describedby"]} aria-valuemin={safeLow} aria-valuemax={bounds.max} aria-readonly={readOnly || undefined} type="range" {...bounds} value={safeHigh} name={highName} form={form} disabled={disabled}
        onChange={event => update("high", event.currentTarget.valueAsNumber)} onKeyDown={preventReadOnly} onPointerDown={event => { if (readOnly) event.preventDefault(); }} className="ui-range ui-range-high" />
    </div>
  </div>;
}
