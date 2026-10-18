import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const variantMap = {
  bordered: "border border-[var(--border)]",
  filled: "bg-[var(--surface-secondary)]",
} as const;

export type GroupBoxProps = UIProps & ComponentPropsWithoutRef<"fieldset"> & {
  title?: ReactNode;
  variant?: keyof typeof variantMap;
};

export function GroupBox({ children, className, title, variant = "bordered", ...props }: GroupBoxProps) {
  return (
    <fieldset data-ui="GroupBox" {...props} className={twMerge("min-w-0 rounded-[var(--radius)] p-[var(--ui-space-4)]", variantMap[variant], className)}>
      {title !== undefined && <legend className="px-[var(--ui-space-1)] text-[length:var(--ui-font-size-sm)] font-semibold">{title}</legend>}
      {children}
    </fieldset>
  );
}
