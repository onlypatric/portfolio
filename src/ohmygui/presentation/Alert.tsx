import { Button } from "../control/button/Button";
import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { PresentationAction } from "./_types";

export type AlertProps = UIProps & Omit<ComponentPropsWithoutRef<"aside">, "children"> & {
  actions?: PresentationAction[];
  message: ReactNode;
  severity?: "danger" | "info" | "success" | "warning";
  title: ReactNode;
};

export function Alert({ actions, className, message, severity = "info", title, ...props }: AlertProps) {
  return (
    <aside data-ui="Alert" {...props} role="alert" data-severity={severity} className={twMerge("grid gap-[var(--ui-space-3)] rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-[var(--ui-space-4)]", className)}>
      <div className="grid gap-[var(--ui-space-1)]"><h2 className="font-semibold">{title}</h2><p className="text-[length:var(--ui-font-size-sm)] text-[var(--muted)]">{message}</p></div>
      {actions && <div className="flex flex-wrap gap-[var(--ui-space-2)]">{actions.map((action, index) => <Button variant="unstyled" key={index} type="button" disabled={action.disabled} onClick={action.onSelect} className={twMerge("rounded px-[var(--ui-space-3)] py-1.5 text-[length:var(--ui-font-size-sm)] font-medium hover:opacity-85", action.destructive ? "bg-[var(--danger)] text-[var(--danger-foreground)]" : "bg-[var(--default)] text-[var(--default-foreground)]")}>{action.label}</Button>)}</div>}
    </aside>
  );
}
