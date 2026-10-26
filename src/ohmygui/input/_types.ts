import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

export type InputElementProps = ComponentPropsWithoutRef<"input">;

export type FieldAppearanceProps = {
  classNames?: Partial<Record<"root" | "label" | "control" | "input" | "hint" | "startContent" | "endContent", string>>;
  wrapperProps?: ComponentPropsWithoutRef<"label">;
};

export type InputOption = {
  disabled?: boolean;
  label: ReactNode;
  /** Searchable plain text for non-text or custom-component labels. */
  textValue?: string;
  value: string;
};

export type FieldContentProps = Omit<FieldAppearanceProps, "wrapperProps"> & {
  /** Outer non-label frame; labels are explicitly associated with the native control. */
  wrapperProps?: ComponentPropsWithoutRef<"div">;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export const fieldClassName = "ui-field";

export const fieldLabelClassName =
  "mb-[var(--ui-space-2)] block text-[length:var(--ui-font-size-sm)] font-medium text-[var(--foreground)]";

export function mergeInputStyle(
  style: CSSProperties | undefined,
  additions: CSSProperties,
) {
  return Object.keys(additions).length > 0
    ? { ...additions, ...style }
    : style;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function numericValue(value: string | number | undefined, fallback: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function numberStep(value: number, step: number) {
  const decimals = Math.max(
    (step.toString().split(".")[1] ?? "").length,
    0,
  );
  return Number(value.toFixed(decimals));
}
