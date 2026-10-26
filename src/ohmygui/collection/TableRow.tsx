import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { ColumnDefinition } from "./_types";

export type TableRowProps<T> = UIProps & Omit<ComponentPropsWithoutRef<"tr">, "children" | "id"> & {
  columns?: ColumnDefinition<T>[];
  data: T;
  id: string | number;
  index?: number;
  onActivate?: () => void;
  selected?: boolean;
  cells?: ReactNode[];
  cellClassName?: string;
};

export function TableRow<T>({ cells, cellClassName, className, columns, data, id, index = 0, onActivate, onKeyDown, selected = false, ...props }: TableRowProps<T>) {
  const record = data as unknown as Record<string, ReactNode>;
  const values = cells ?? (columns ? columns.map((column) => column.render?.(data, index) ?? record[column.key]) : Object.values(record));
  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    onKeyDown?.(event);
    if (event.target === event.currentTarget && !event.defaultPrevented && onActivate && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onActivate();
    }
  };
  return (
    <tr data-ui="TableRow" {...props} id={String(id)} aria-selected={selected || undefined} tabIndex={onActivate ? (props.tabIndex ?? 0) : props.tabIndex} onKeyDown={handleKeyDown} className={twMerge(selected && "bg-[var(--surface-secondary)]", className)}>
      {values.map((value, cellIndex) => <td key={cellIndex} style={{ textAlign: columns?.[cellIndex]?.align }} className={twMerge("border-t border-[var(--separator)] px-[var(--ui-table-cell-x,var(--ui-space-3))] py-[var(--ui-table-cell-y,var(--ui-space-2))] align-middle text-[length:var(--ui-font-size-sm)]", cellClassName, columns?.[cellIndex]?.cellClassName)}>{value}</td>)}
    </tr>
  );
}
