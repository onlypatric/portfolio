import { Button } from "../control/button/Button";
import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { defaultItemKey, type CollectionKey, type ItemKey, type ItemRenderer } from "./_types";

export type ListProps<T> = UIProps & Omit<ComponentPropsWithoutRef<"ul">, "children"> & {
  classNames?: Partial<Record<"row" | "button" | "empty", string>>;
  density?: "comfortable" | "compact";
  emptyState?: ReactNode;
  getKey?: ItemKey<T>;
  items: readonly T[];
  onSelectionChange?: (key: CollectionKey) => void;
  render: ItemRenderer<T>;
  selection?: CollectionKey | readonly CollectionKey[];
};

function isSelected(selection: ListProps<unknown>["selection"], key: CollectionKey) {
  return Array.isArray(selection) ? selection.includes(key) : selection === key;
}

export function List<T>({
  className,
  classNames = {},
  density = "comfortable",
  emptyState,
  getKey = defaultItemKey,
  items,
  onSelectionChange,
  render,
  selection,
  ...props
}: ListProps<T>) {

  return (
    <ul data-ui="List" data-density={density} {...props} className={twMerge("grid", density === "compact" ? "gap-[var(--ui-space-1)]" : "gap-[var(--ui-space-2)]", className)}>
      {items.length === 0 && emptyState !== undefined && <li data-slot="empty" className={twMerge("py-[var(--ui-space-6)] text-center text-[length:var(--ui-font-size-sm)] text-[var(--muted)]", classNames.empty)}>{emptyState}</li>}
      {items.map((item, index) => {
        const key = getKey(item, index);
        const selected = isSelected(selection, key);
        return (
          <li key={key} data-selected={selected || undefined} data-slot="row" className={twMerge("rounded-[var(--field-radius)]", selected && "bg-[var(--ui-selection)]", classNames.row)}>
            {onSelectionChange ? (
              <Button variant="unstyled" type="button" aria-pressed={selected} data-slot="button" className={twMerge("block w-full rounded-[var(--field-radius)] text-start", classNames.button)} onClick={() => onSelectionChange(key)}>{render(item, index)}</Button>
            ) : render(item, index)}
          </li>
        );
      })}
    </ul>
  );
}
