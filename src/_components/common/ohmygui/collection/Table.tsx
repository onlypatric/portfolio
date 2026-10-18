import { Button } from "../control/button/Button";
import type { UIProps } from "../_types";
import "../theme.css";
import { useMemo, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { TableRow } from "./TableRow";
import { defaultItemKey, type CollectionKey, type ColumnDefinition, type ItemKey } from "./_types";

export type TableSort = {
  direction: "asc" | "desc";
  key: string;
};

export type TableProps<T> = UIProps & Omit<ComponentPropsWithoutRef<"table">, "children"> & {
  columns: ColumnDefinition<T>[];
  classNames?: Partial<Record<"wrapper" | "header" | "row" | "cell", string>>;
  emptyState?: ReactNode;
  error?: ReactNode;
  getKey?: ItemKey<T>;
  loading?: boolean;
  onSelectionChange?: (keys: CollectionKey[]) => void;
  onSortChange?: (sort: TableSort) => void;
  rows: readonly T[];
  selection?: readonly CollectionKey[];
  sort?: TableSort;
};

export function Table<T>({
  className,
  classNames = {},
  columns,
  emptyState = "No rows",
  error,
  getKey = defaultItemKey,
  loading = false,
  onSelectionChange,
  onSortChange,
  rows,
  selection = [],
  sort: controlledSort,
  ...props
}: TableProps<T>) {
  const [internalSort, setInternalSort] = useState<TableSort>();
  const sort = controlledSort ?? internalSort;
  const displayRows = useMemo(() => {
    if (!sort) return [...rows];
    const column = columns.find((item) => item.key === sort.key);
    if (!column) return [...rows];
    return [...rows].sort((left, right) => {
      const leftValue = column.render?.(left, 0) ?? (left as Record<string, unknown>)[sort.key];
      const rightValue = column.render?.(right, 0) ?? (right as Record<string, unknown>)[sort.key];
      const comparison = String(leftValue ?? "").localeCompare(String(rightValue ?? ""), undefined, { numeric: true });
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [columns, rows, sort]);

  const changeSort = (key: string) => {
    const next: TableSort = { key, direction: sort?.key === key && sort.direction === "asc" ? "desc" : "asc" };
    if (!controlledSort) setInternalSort(next);
    onSortChange?.(next);
  };

  const toggleSelection = (key: CollectionKey) => {
    const next = selection.includes(key) ? selection.filter((item) => item !== key) : [...selection, key];
    onSelectionChange?.(next);
  };

  return (
    <div data-ui="Table" className={twMerge("max-w-full overflow-x-auto rounded-[var(--field-radius)] border border-[var(--border)]", classNames.wrapper)}>
      <table {...props} className={twMerge("w-full border-collapse text-start", className)}>
        <thead data-slot="header" className={classNames.header}>
          <tr>
            {columns.map((column) => (
              <th style={{ width: column.width, textAlign: column.align }} key={column.key} scope="col" aria-sort={sort?.key === column.key ? sort.direction === "asc" ? "ascending" : "descending" : "none"} className={twMerge("border-b border-[var(--border)] px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-start text-[length:var(--ui-font-size-sm)] font-semibold", column.headerClassName)}>
                {column.sortable ? <Button variant="unstyled" type="button" className="font-inherit underline-offset-4 hover:underline" onClick={() => changeSort(column.key)}>{column.header}</Button> : column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan={columns.length} className="px-[var(--ui-space-3)] py-[var(--ui-space-8)] text-center text-[length:var(--ui-font-size-sm)] text-[var(--muted)]">Loading…</td></tr> : error ? <tr><td colSpan={columns.length} className="px-[var(--ui-space-3)] py-[var(--ui-space-8)] text-center text-[length:var(--ui-font-size-sm)] text-[var(--danger)]">{error}</td></tr> : displayRows.length === 0 ? <tr><td colSpan={columns.length} className="px-[var(--ui-space-3)] py-[var(--ui-space-8)] text-center text-[length:var(--ui-font-size-sm)] text-[var(--muted)]">{emptyState}</td></tr> : displayRows.map((row, index) => { const key = getKey(row, index); return <TableRow className={classNames.row} cellClassName={classNames.cell} key={key} id={key} data={row} index={index} columns={columns} selected={selection.includes(key)} onClick={onSelectionChange ? () => toggleSelection(key) : undefined} onActivate={onSelectionChange ? () => toggleSelection(key) : undefined} />; })}
        </tbody>
      </table>
    </div>
  );
}
