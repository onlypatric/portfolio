import { Children, Fragment, isValidElement, useId, useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import { Draggable, type DraggableItemProps, type DragItemKey, type ItemDrop } from "../behavior/Draggable";
import { validDragItemKey } from "../behavior/_drag";
import "../theme.css";

export type SortableItemProps = Omit<DraggableItemProps, "itemKey" | "dragKey"> & { itemKey?: DragItemKey };
function SortableItem(_props: SortableItemProps) { return null; }
export type SortableProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "onChange"> & {
  order?: readonly DragItemKey[];
  defaultOrder?: readonly DragItemKey[];
  onOrderChange?: (order: DragItemKey[], change: { itemKey: DragItemKey; from: number; to: number }) => void;
  orientation?: "vertical" | "horizontal" | "grid";
  disabled?: boolean;
  animation?: boolean;
  emptyState?: ReactNode;
};

function SortableRoot({ children, order, defaultOrder, onOrderChange, orientation = "vertical", disabled = false, animation = true, emptyState = "No items", className, ...props }: SortableProps) {
  const scope = useId(), root = useRef<HTMLDivElement>(null), positions = useRef(new Map<DragItemKey, DOMRect>());
  const focus = useRef<{ key: DragItemKey; node: Element | null } | null>(null);
  const [localOrder, setLocalOrder] = useState<readonly DragItemKey[]>(defaultOrder ?? []);
  const rows = new Map<DragItemKey, ReactElement<SortableItemProps>>();
  const collect = (nodes: ReactNode) => Children.forEach(nodes, child => {
    if (child == null || typeof child === "boolean") return;
    if (!isValidElement<SortableItemProps>(child)) throw new Error("Sortable expects keyed Sortable.Item children.");
    if (child.type === Fragment) { collect(child.props.children); return; }
    if (child.type !== SortableItem) throw new Error("Sortable expects keyed Sortable.Item children.");
    const key = child.props.itemKey ?? child.key;
    if (!validDragItemKey(key) || rows.has(key)) throw new Error("Sortable.Item requires a unique itemKey or React key; array indices are not stable identities.");
    rows.set(key, child);
  });
  collect(children);
  const requested = order ?? localOrder;
  const keys = [...new Set([...requested.filter(key => rows.has(key)), ...rows.keys()])];
  const signature = JSON.stringify(keys.map(key => [typeof key, key]));
  useLayoutEffect(() => {
    const elements = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-ui-drag-item]') ?? [])
      .filter(node => node.closest('[data-ui="Sortable"]') === root.current);
    const next = new Map<DragItemKey, DOMRect>(), animations: Animation[] = [];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"), forced = matchMedia("(forced-colors: active)");
    for (const [index, node] of elements.entries()) {
      const key = keys[index], rect = node.getBoundingClientRect(), previous = positions.current.get(key);
      next.set(key, rect);
      const x = previous ? previous.left - rect.left : 0, y = previous ? previous.top - rect.top : 0;
      if (animation && !reduced.matches && !forced.matches && !document.hidden && typeof node.animate === "function" && (x || y)) {
        animations.push(node.animate([{ transform: `translate(${x}px, ${y}px)` }, { transform: "translate(0,0)" }], { duration: 180, easing: "ease-out" }));
      }
      if (focus.current?.key === key && (document.activeElement === document.body || document.activeElement === focus.current.node)) node.querySelector<HTMLElement>('[data-slot="dragHandle"]')?.focus({ preventScroll: true });
    }
    focus.current = null; positions.current = next;
    const stop = () => animations.forEach(item => item.cancel());
    const visibility = () => { if (document.hidden) stop(); };
    reduced.addEventListener("change", stop); forced.addEventListener("change", stop);
    document.addEventListener("visibilitychange", visibility); window.addEventListener("resize", stop);
    return () => { stop(); reduced.removeEventListener("change", stop); forced.removeEventListener("change", stop); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("resize", stop); };
  }, [signature, animation]);
  const move = (drop: ItemDrop) => {
    if (disabled || drop.sourceId !== scope) return;
    const from = keys.indexOf(drop.itemKey);
    if (from < 0) return;
    const to = Math.max(0, Math.min(keys.length - 1, drop.index - (from < drop.index ? 1 : 0)));
    if (from === to) return;
    const next = keys.filter(key => key !== drop.itemKey); next.splice(to, 0, drop.itemKey);
    if (drop.method === "keyboard") focus.current = { key: drop.itemKey, node: document.activeElement };
    if (order === undefined) setLocalOrder(next);
    onOrderChange?.(next, { itemKey: drop.itemKey, from, to });
  };
  return <div {...props} ref={root} data-ui="Sortable" data-orientation={orientation} className={twMerge("ui-sortable", className)}>
    <Draggable.Container id={scope} dragKey={scope} disabled={disabled} orientation={orientation} onDrop={move} aria-label={props["aria-label"] ?? "Sortable items"}>
      {keys.map(key => { const row = rows.get(key)!; return <Draggable.Item {...row.props} key={`${typeof key}:${key}`} itemKey={key} disabled={disabled || row.props.disabled} />; })}
      <Draggable.Empty>{emptyState}</Draggable.Empty>
    </Draggable.Container>
  </div>;
}

export const Sortable = Object.assign(SortableRoot, { Item: SortableItem });
