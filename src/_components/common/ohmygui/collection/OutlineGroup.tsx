import { Button } from "../control/button/Button";
import type { UIProps } from "../_types";
import "../theme.css";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { CollectionKey, ItemKey } from "./_types";

export type OutlineGroupProps<T> = UIProps & Omit<ComponentPropsWithoutRef<"ul">, "children"> & {
  childrenKey: keyof T | ((node: T) => readonly T[] | undefined);
  getKey?: ItemKey<T>;
  label?: (node: T) => ReactNode;
  nodes: readonly T[];
  onSelectionChange?: (key: CollectionKey) => void;
  selection?: CollectionKey;
};

function OutlineNodes<T>({
  childrenKey,
  getKey,
  label,
  nodes,
  onSelectionChange,
  selection,
}: Omit<OutlineGroupProps<T>, "className" | "children" | "nodes"> & { nodes: readonly T[] }) {
  const keyFor = getKey ?? ((_node, index) => index);
  const childrenFor = (node: T) => typeof childrenKey === "function" ? childrenKey(node) ?? [] : ((node as Record<PropertyKey, unknown>)[childrenKey] as T[] | undefined) ?? [];
  return (
    <>
      {nodes.map((node, index) => {
        const key = keyFor(node, index);
        const children = childrenFor(node);
        const content = label?.(node) ?? String(node);
        return (
          <li key={key} className="min-w-0">
            {children.length > 0 ? (
              <details open>
                <summary className="cursor-pointer rounded px-[var(--ui-space-2)] py-[var(--ui-space-1)] text-[length:var(--ui-font-size-sm)]">{content}</summary>
                <ul className="ms-4 border-s border-[var(--separator)] ps-[var(--ui-space-2)]"><OutlineNodes childrenKey={childrenKey} getKey={getKey} label={label} nodes={children} onSelectionChange={onSelectionChange} selection={selection} /></ul>
              </details>
            ) : (
              <Button variant="unstyled" type="button" aria-selected={selection === key || undefined} onClick={() => onSelectionChange?.(key)} className="w-full rounded px-[var(--ui-space-2)] py-[var(--ui-space-1)] text-start text-[length:var(--ui-font-size-sm)] hover:bg-[var(--surface-secondary)]">{content}</Button>
            )}
          </li>
        );
      })}
    </>
  );
}

export function OutlineGroup<T>({ childrenKey, className, getKey, label, nodes, onSelectionChange, selection, ...props }: OutlineGroupProps<T>) {
  return <ul data-ui="OutlineGroup" {...props} className={twMerge("grid gap-[var(--ui-space-1)]", className)}><OutlineNodes childrenKey={childrenKey} getKey={getKey} label={label} nodes={nodes} onSelectionChange={onSelectionChange} selection={selection} /></ul>;
}
