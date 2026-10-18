import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type EmptyStateProps = UIProps & ComponentPropsWithoutRef<"section"> & {
  action?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
};

export function EmptyState({ action, children, className, description, title, ...props }: EmptyStateProps) {
  return (
    <section data-ui="EmptyState" {...props} className={twMerge("grid justify-items-center gap-[var(--ui-space-2)] py-10 text-center", className)}>
      {children && <div className="mb-[var(--ui-space-2)]">{children}</div>}
      <h2 className="m-0 text-[length:var(--ui-font-size-lg)] font-semibold">{title}</h2>
      {description && <p className="m-0 max-w-prose text-[length:var(--ui-font-size-sm)] text-[var(--muted)]">{description}</p>}
      {action && <div className="mt-[var(--ui-space-2)]">{action}</div>}
    </section>
  );
}
