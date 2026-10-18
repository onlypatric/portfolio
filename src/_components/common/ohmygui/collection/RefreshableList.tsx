import type { UIProps } from "../_types";
import "../theme.css";
import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../control/button/Button";

export type RefreshableListProps = UIProps & ComponentPropsWithoutRef<"section"> & {
  enabled?: boolean;
  onRefresh?: () => void | Promise<void>;
  refreshEvent?: () => void | Promise<void>;
  refreshLabel?: ReactNode;
};

export function RefreshableList({ children, className, enabled = true, onRefresh, refreshEvent, refreshLabel = "Refresh", ...props }: RefreshableListProps) {
  const [state, setState] = useState<"idle" | "loading" | "error" | "complete">("idle");
  const refresh = async () => {
    if (!enabled || state === "loading") return;
    setState("loading");
    try {
      await (refreshEvent ?? onRefresh)?.();
      setState("complete");
    } catch {
      setState("error");
    }
  };

  return (
    <section data-ui="RefreshableList" {...props} className={twMerge("grid gap-[var(--ui-space-3)]", className)}>
      <div className="flex items-center justify-end gap-[var(--ui-space-2)]">
        <Button type="button" size="sm" variant="secondary" loading={state === "loading"} disabled={!enabled} onClick={() => void refresh()}>{refreshLabel}</Button>
        {state === "complete" && <span role="status" className="text-[length:var(--ui-font-size-sm)] text-[var(--success)]">Updated</span>}
        {state === "error" && <span role="alert" className="text-[length:var(--ui-font-size-sm)] text-[var(--danger)]">Unable to refresh</span>}
      </div>
      {children}
    </section>
  );
}
