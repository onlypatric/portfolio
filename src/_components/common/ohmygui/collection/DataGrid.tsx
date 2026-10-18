import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { ColumnDefinition, ItemKey } from "./_types";

export type DataGridProps<T> = UIProps & Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  columns: ColumnDefinition<T>[];
  editMode?: boolean;
  getKey?: ItemKey<T>;
  onSelectionChange?: (key: string | number) => void;
  rows: readonly T[];
  selection?: string | number;
};

export function DataGrid<T>({ className, columns, editMode = false, getKey = (_item, index) => index, onSelectionChange, rows, selection, ...props }: DataGridProps<T>) {
  return (
    <div data-ui="DataGrid" {...props} role="grid" aria-colcount={columns.length} aria-rowcount={rows.length} className={twMerge("grid min-w-max", className)}>
      <div role="row" className="grid grid-flow-col auto-cols-fr border-b border-[var(--border)] font-semibold">
        {columns.map((column) => <div key={column.key} role="columnheader" className="px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-[length:var(--ui-font-size-sm)]">{column.header}</div>)}
      </div>
      {rows.map((row, rowIndex) => { const key = getKey(row, rowIndex); return <div key={key} role="row" aria-rowindex={rowIndex + 2} aria-selected={selection === key || undefined} onClick={() => onSelectionChange?.(key)} className="grid grid-flow-col auto-cols-fr border-b border-[var(--separator)]">{columns.map((column) => <div key={column.key} role="gridcell" contentEditable={editMode} suppressContentEditableWarning className="min-w-0 px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-[length:var(--ui-font-size-sm)]">{column.render?.(row, rowIndex) ?? (row as Record<string, ReactNode>)[column.key]}</div>)}</div>; })}
    </div>
  );
}
