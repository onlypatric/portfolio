import type { CSSProperties, ReactNode } from "react";

export type CollectionKey = string | number;

export type ItemKey<T> = (item: T, index: number) => CollectionKey;

export type ItemRenderer<T> = (item: T, index: number) => ReactNode;

export type ColumnDefinition<T> = {
  header: ReactNode;
  align?: "start" | "center" | "end";
  width?: number | string;
  headerClassName?: string;
  cellClassName?: string;
  key: string;
  render?: (item: T, index: number) => ReactNode;
  sortable?: boolean;
};

export function defaultItemKey<T>(item: T, index: number): CollectionKey {
  if (typeof item === "string" || typeof item === "number") return item;
  if (item && typeof item === "object" && "id" in item) {
    const id = (item as { id?: unknown }).id;
    if (typeof id === "string" || typeof id === "number") return id;
  }
  return index;
}

export function mergeCollectionStyle(
  style: CSSProperties | undefined,
  additions: CSSProperties,
) {
  return Object.keys(additions).length > 0
    ? { ...additions, ...style }
    : style;
}
