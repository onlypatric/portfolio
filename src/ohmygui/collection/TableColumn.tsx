import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import type { ColumnDefinition } from "./_types";

export type TableColumnProps<T> = UIProps & Omit<ComponentPropsWithoutRef<"th">, "align" | "children" | "width"> & ColumnDefinition<T>;

export function TableColumn<T>({ header, align, width, headerClassName, cellClassName: _cellClassName, sortable: _sortable, render: _render, className, style, ...props }: TableColumnProps<T>) {
  return <th data-ui="TableColumn" {...props} style={{ width, textAlign: align, ...style }} className={twMerge(headerClassName, className)} scope="col">{header}</th>;
}
