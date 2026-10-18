import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, type ComponentPropsWithoutRef, type ReactNode } from "react";

export type FocusStateProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  autoFocusReason?: string;
  children?: ReactNode;
  restore?: boolean;
  target?: string;
};

export function FocusState({ autoFocusReason, children, restore = true, target, ...props }: FocusStateProps) {
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = target ? document.querySelector<HTMLElement>(target) : null;
    if (node && autoFocusReason) node.focus();
    return () => { if (restore && previous) previous.focus(); };
  }, [autoFocusReason, restore, target]);
  return <div data-ui="FocusState" {...props} data-focus-reason={autoFocusReason}>{children}</div>;
}
