import type { FieldAppearanceProps } from "./_types";
import type { UIProps, UIStyle } from "../_types";
import "../theme.css";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { finiteNumber, rangePercent } from "./_number";

export type GaugeProps = UIProps & Omit<FieldAppearanceProps, "classNames"> & Omit<ComponentPropsWithRef<"meter">, "children" | "high" | "low" | "max" | "min" | "optimum" | "value"> & {
  high?: number; label?: ReactNode; low?: number; max?: number; min?: number; optimum?: number; value: number;
  showValue?: boolean; formatValue?: (value: number) => string; tone?: "auto" | "accent" | "success" | "warning" | "danger";
  classNames?: FieldAppearanceProps["classNames"] & Partial<Record<"track" | "fill" | "value", string>>;
};
export function Gauge({ classNames = {}, wrapperProps, className, label, min = 0, max = 1, value, low, high, optimum, showValue = true, formatValue, tone = "auto", id, ...props }: GaugeProps) {
  const generated = useId(), nativeId = id ?? generated, lower = finiteNumber(min, 0), upper = Math.max(lower, finiteNumber(max, 1));
  const clamp = (value: number | undefined, fallback: number) => Math.min(upper, Math.max(lower, finiteNumber(value, fallback)));
  const current = clamp(value, lower), safeLow = clamp(low, lower), safeHigh = Math.max(safeLow, clamp(high, upper)), safeOptimum = clamp(optimum, (lower + upper) / 2);
  const region = (value: number) => value < safeLow ? 0 : value > safeHigh ? 2 : 1;
  const distance = Math.abs(region(current) - region(safeOptimum)), color = tone === "auto" ? distance === 0 ? "success" : distance === 1 ? "warning" : "danger" : tone;
  const text = formatValue?.(current) ?? String(current);
  return <label {...wrapperProps} htmlFor={nativeId} data-ui="Gauge" data-tone={color} className={twMerge("ui-indicator", classNames.root, wrapperProps?.className)}>
    <span className="ui-indicator-heading">{label !== undefined && <span data-slot="label" className={twMerge("ui-field-label", classNames.label)}>{label}</span>}{showValue && <output aria-hidden="true" htmlFor={nativeId} className={twMerge("ui-number-value", classNames.value)}>{text}</output>}</span>
    <span data-slot="track" className={twMerge("ui-indicator-track", classNames.track)}>
      <meter {...props} id={nativeId} min={lower} max={upper} value={current} low={safeLow} high={safeHigh} optimum={safeOptimum} aria-label={props["aria-label"] ?? (label === undefined ? "Gauge" : undefined)} aria-valuetext={props["aria-valuetext"] ?? text} className={twMerge("ui-indicator-native", classNames.input, className)} />
      <span aria-hidden="true" data-slot="fill" className={twMerge("ui-indicator-fill", classNames.fill)} style={{ "--ui-indicator-fraction": rangePercent(current, lower, upper) / 100 } as UIStyle} />
    </span>
  </label>;
}
