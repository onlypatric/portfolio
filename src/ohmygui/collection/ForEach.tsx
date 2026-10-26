import "../theme.css";
import { Fragment, type ComponentPropsWithoutRef } from "react";
import { defaultItemKey, type ItemKey, type ItemRenderer } from "./_types";

export type ForEachProps<T> = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  getKey?: ItemKey<T>;
  items: readonly T[];
  render: ItemRenderer<T>;
};

export function ForEach<T>({ getKey = defaultItemKey, items, render }: ForEachProps<T>) {
  return items.map((item, index) => (
    <Fragment key={getKey(item, index)}>{render(item, index)}</Fragment>
  ));
}
