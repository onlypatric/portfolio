import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef } from "react";
import type { ColumnDefinition } from "./_types";

export type TableColumnProps<T> = UIProps & ComponentPropsWithoutRef<"th"> & ColumnDefinition<T>;

export function TableColumn<T>({ header, sortable: _sortable, render: _render, ...props }: TableColumnProps<T>) {
  return <th data-ui="TableColumn" {...props} scope="col">{header}</th>;
}
