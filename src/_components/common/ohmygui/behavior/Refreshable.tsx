import "../theme.css";
import { useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Button } from "../control/button/Button";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
export type RefreshableProps = UIProps & ComponentPropsWithoutRef<"div"> & {
  onRefreshEvent?: () => void | Promise<void>; label?: ReactNode;
  classNames?: Partial<Record<"toolbar" | "button" | "content", string>>;
};
export function Refreshable({ children, className, classNames = {}, label = "Refresh", onRefreshEvent, ...props }: RefreshableProps) {
  const pending = useRef(false);
  const [state, setState] = useState<"idle" | "loading" | "error" | "complete">("idle");
  const refresh = async () => { if (pending.current) return; pending.current = true; setState("loading"); try { await onRefreshEvent?.(); setState("complete"); } catch { setState("error"); } finally { pending.current = false; } };
  return <div {...props} data-ui="Refreshable" aria-busy={state === "loading"} className={twMerge("grid gap-[var(--ui-space-3)]", className)}>
    <div data-slot="toolbar" className={twMerge("flex items-center justify-end gap-[var(--ui-space-2)]", classNames.toolbar)}>
      {state === "error" && <span role="alert" className="text-[var(--danger)]">Unable to refresh.</span>}
      {state === "complete" && <span role="status" className="text-[var(--muted)]">Updated</span>}
      <Button size="sm" loading={state === "loading"} className={classNames.button} onClick={() => void refresh()}>{label}</Button>
    </div><div data-slot="content" className={classNames.content}>{children}</div>
  </div>;
}
