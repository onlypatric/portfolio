import { Button } from "../control/button/Button";
import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { BehaviorAction } from "./_types";

export type SwipeActionsProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  actions: BehaviorAction[];
  children?: ReactNode;
  threshold?: number;
};

export function SwipeActions({ actions, children, className, threshold = 64, ...props }: SwipeActionsProps) {
  return <div data-ui="SwipeActions" {...props} data-threshold={threshold} className={twMerge("flex items-stretch gap-[var(--ui-space-2)]", className)}><div className="min-w-0 flex-1">{children}</div><div className="flex shrink-0 items-center gap-[var(--ui-space-1)]">{actions.map((action, index) => <Button variant="unstyled" key={index} type="button" onClick={action.onSelect} className={action.tone === "danger" ? "rounded bg-[var(--danger)] px-[var(--ui-space-3)] text-[length:var(--ui-font-size-sm)] text-[var(--danger-foreground)]" : "rounded bg-[var(--default)] px-[var(--ui-space-3)] text-[length:var(--ui-font-size-sm)]"}>{action.label}</Button>)}</div></div>;
}
