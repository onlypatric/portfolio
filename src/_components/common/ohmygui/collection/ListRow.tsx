import type { UIProps } from "../_types";
import "../theme.css";
import clsx from "clsx";
import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type ListRowProps = UIProps & Omit<ComponentPropsWithoutRef<"li">, "children"> & {
  as?: ElementType;
  leading?: ReactNode;
  primary?: ReactNode;
  secondary?: ReactNode;
  selected?: boolean;
  trailing?: ReactNode;
};

export function ListRow({ as, className, leading, primary, secondary, selected = false, trailing, ...props }: ListRowProps) {
  const Component = as ?? "li";
  return (
    <Component data-ui="ListRow"
      {...props}
      aria-selected={selected || undefined}
      className={twMerge(clsx("flex min-w-0 items-center gap-[var(--ui-space-3)] rounded-[var(--field-radius)] px-[var(--ui-space-3)] py-[var(--ui-space-2)]", selected && "bg-[var(--surface-secondary)]", className))}
    >
      {leading && <span className="shrink-0">{leading}</span>}
      <span className="min-w-0 flex-1">
        {primary !== undefined && <span className="block truncate text-[length:var(--ui-font-size-sm)] text-[var(--foreground)]">{primary}</span>}
        {secondary !== undefined && <span className="block truncate text-[length:var(--ui-font-size-xs)] text-[var(--muted)]">{secondary}</span>}
      </span>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </Component>
  );
}
