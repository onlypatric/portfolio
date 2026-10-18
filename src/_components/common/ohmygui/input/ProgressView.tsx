import type { FieldAppearanceProps } from "./_types";
import type { UIProps, UIStyle } from "../_types";
import "../theme.css";
import { useId, useLayoutEffect, useRef, type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { finiteNumber } from "./_number";
import { createProgressMotion } from "./_progress-motion";

export type ProgressViewProps = UIProps & Omit<FieldAppearanceProps, "classNames"> & Omit<ComponentPropsWithRef<"progress">, "children" | "max" | "value"> & {
  label?: ReactNode; max?: number; value?: number; showValue?: boolean; formatValue?: (value: number, max: number) => string;
  classNames?: FieldAppearanceProps["classNames"] & Partial<Record<"track" | "fill" | "value", string>>;
};
export function ProgressView({ classNames = {}, wrapperProps, className, label, max = 1, value, showValue = true, formatValue, id, ...props }: ProgressViewProps) {
  const generated = useId(), nativeId = id ?? generated, maximum = max > 0 ? finiteNumber(max, 1) : 1;
  const current = typeof value === "number" && Number.isFinite(value) ? Math.min(maximum, Math.max(0, value)) : undefined;
  const text = current === undefined ? "In progress" : formatValue?.(current, maximum) ?? Math.round(current / maximum * 100) + "%";
  const track = useRef<HTMLSpanElement>(null), fill = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => { if (current === undefined && track.current && fill.current) return createProgressMotion(track.current, fill.current); }, [current === undefined]);
  return <label {...wrapperProps} htmlFor={nativeId} data-ui="ProgressView" data-mode={current === undefined ? "indeterminate" : "determinate"} className={twMerge("ui-indicator", classNames.root, wrapperProps?.className)}>
    <span className="ui-indicator-heading">{label !== undefined && <span data-slot="label" className={twMerge("ui-field-label", classNames.label)}>{label}</span>}{showValue && <output aria-hidden="true" htmlFor={nativeId} className={twMerge("ui-number-value", classNames.value)}>{text}</output>}</span>
    <span ref={track} data-slot="track" className={twMerge("ui-indicator-track", classNames.track)}>
      <progress {...props} id={nativeId} max={maximum} value={current} aria-label={props["aria-label"] ?? (label === undefined ? "Progress" : undefined)} aria-valuetext={props["aria-valuetext"] ?? (current === undefined ? undefined : text)} className={twMerge("ui-indicator-native", classNames.input, className)} />
      <span ref={fill} aria-hidden="true" data-slot="fill" className={twMerge("ui-indicator-fill", classNames.fill)} style={{ "--ui-indicator-fraction": current === undefined ? 0 : current / maximum } as UIStyle} />
    </span>
  </label>;
}
